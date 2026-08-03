from pymongo import MongoClient
import pymongo
from bson.objectid import ObjectId
from app.config import MONGODB_URI, DATABASE_NAME
import logging
import uuid
from datetime import datetime

logger = logging.getLogger(__name__)

_in_memory_history = []

try:
    client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=2000)
    db = client[DATABASE_NAME]
    collection = db["investigations"]
    client.admin.command('ping')
    logger.info("Connected to MongoDB successfully.")
    use_mongodb = True
except Exception as e:
    logger.warning(f"MongoDB connection failed: {e}. Falling back to in-memory history storage.")
    client = None
    db = None
    collection = None
    use_mongodb = False


def save_investigation(investigation_obj: dict) -> dict:
    """
    Saves complete investigation response object to MongoDB.
    Document structure:
    {
        "_id": ObjectId("..."),
        "timestamp": "2026-08-03T22:32:00Z",
        "investigation": {
            "ioc": "...",
            "ioc_type": "...",
            "risk_level": "...",
            "virustotal": {...},
            "abuseipdb": {...},
            "ai_summary": "..."
        }
    }
    """
    global use_mongodb
    iso_timestamp = datetime.utcnow().isoformat() + "Z"
    formatted_date = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")

    investigation_payload = {
        "ioc": investigation_obj.get("ioc", "Unknown"),
        "ioc_type": investigation_obj.get("ioc_type", "Unknown"),
        "risk_level": investigation_obj.get("risk_level", "Low"),
        "virustotal": investigation_obj.get("virustotal"),
        "abuseipdb": investigation_obj.get("abuseipdb"),
        "ai_summary": investigation_obj.get("ai_summary", investigation_obj.get("summary")),
    }

    doc_to_insert = {
        "timestamp": iso_timestamp,
        "date": formatted_date,
        "investigation": investigation_payload
    }

    if use_mongodb and collection is not None:
        try:
            result = collection.insert_one(doc_to_insert)
            doc_id = str(result.inserted_id)
            collection.update_one({"_id": result.inserted_id}, {"$set": {"id": doc_id}})
            return {
                "id": doc_id,
                "timestamp": iso_timestamp,
                "date": formatted_date,
                "investigation": investigation_payload,
                **investigation_payload
            }
        except Exception as err:
            logger.error(f"MongoDB insert error: {err}. Falling back to in-memory.")


    doc_id = f"INV-2026-{uuid.uuid4().hex[:8].upper()}"
    mem_doc = {
        "id": doc_id,
        "timestamp": iso_timestamp,
        "date": formatted_date,
        "investigation": investigation_payload,
        **investigation_payload
    }
    _in_memory_history.insert(0, mem_doc)
    return mem_doc


def get_all_investigations() -> list:
    """Returns list of history summaries (newest first)."""
    global use_mongodb
    if use_mongodb and collection is not None:
        try:
            cursor = collection.find({}).sort("timestamp", pymongo.DESCENDING)
            results = []
            for doc in cursor:
                doc_id = str(doc["_id"])
                inv = doc.get("investigation", {})
                results.append({
                    "id": doc_id,
                    "timestamp": doc.get("timestamp", ""),
                    "date": doc.get("date", doc.get("timestamp", "")),
                    "ioc": inv.get("ioc", "Unknown"),
                    "ioc_type": inv.get("ioc_type", "Unknown"),
                    "risk_level": inv.get("risk_level", "Low"),
                })
            return results
        except Exception as err:
            logger.error(f"Error fetching all from MongoDB: {err}")

    results = []
    for item in _in_memory_history:
        inv = item.get("investigation", item)
        results.append({
            "id": item.get("id"),
            "timestamp": item.get("timestamp"),
            "date": item.get("date"),
            "ioc": inv.get("ioc", "Unknown"),
            "ioc_type": inv.get("ioc_type", "Unknown"),
            "risk_level": inv.get("risk_level", "Low"),
        })
    return results


def get_investigation_by_id(record_id: str) -> dict:
    """Returns the complete stored investigation object for a given ID."""
    global use_mongodb
    if use_mongodb and collection is not None:
        try:
            query = {}
            if ObjectId.is_valid(record_id):
                query = {"_id": ObjectId(record_id)}
            else:
                query = {"id": record_id}

            doc = collection.find_one(query)
            if doc:
                doc_id = str(doc["_id"])
                inv = doc.get("investigation", {})
                return {
                    "id": doc_id,
                    "timestamp": doc.get("timestamp"),
                    "date": doc.get("date", doc.get("timestamp")),
                    "investigation": inv,
                    "ioc": inv.get("ioc"),
                    "ioc_type": inv.get("ioc_type"),
                    "risk_level": inv.get("risk_level"),
                    "virustotal": inv.get("virustotal"),
                    "abuseipdb": inv.get("abuseipdb"),
                    "ai_summary": inv.get("ai_summary"),
                    "summary": inv.get("ai_summary")
                }
        except Exception as err:
            logger.error(f"Error fetching record {record_id} from MongoDB: {err}")

    for item in _in_memory_history:
        if item.get("id") == record_id:
            inv = item.get("investigation", item)
            return {
                "id": item.get("id"),
                "timestamp": item.get("timestamp"),
                "date": item.get("date"),
                "investigation": inv,
                "ioc": inv.get("ioc"),
                "ioc_type": inv.get("ioc_type"),
                "risk_level": inv.get("risk_level"),
                "virustotal": inv.get("virustotal"),
                "abuseipdb": inv.get("abuseipdb"),
                "ai_summary": inv.get("ai_summary"),
                "summary": inv.get("ai_summary")
            }
    return None


def delete_investigation(record_id: str) -> bool:
    """Deletes an investigation document by ObjectId string or ID."""
    global use_mongodb, _in_memory_history
    deleted = False
    if use_mongodb and collection is not None:
        try:
            query = {}
            if ObjectId.is_valid(record_id):
                query = {"_id": ObjectId(record_id)}
            else:
                query = {"id": record_id}
            
            res = collection.delete_one(query)
            if res.deleted_count > 0:
                deleted = True
        except Exception as err:
            logger.error(f"Error deleting record {record_id} from MongoDB: {err}")

    _in_memory_history = [i for i in _in_memory_history if i.get("id") != record_id]
    return deleted or True


def get_dashboard_stats() -> dict:
    """Computes SOC Dashboard statistics directly from MongoDB or in-memory fallback."""
    global use_mongodb
    from datetime import datetime, timedelta

    today_str = datetime.utcnow().strftime("%Y-%m-%d")
    
    total = 0
    today_count = 0
    risk_counts = {"low": 0, "medium": 0, "high": 0, "critical": 0}
    type_counts = {"ip_address": 0, "domain": 0, "url": 0, "file_hash": 0, "other": 0}
    
    trend_map = {}
    for i in range(6, -1, -1):
        day_date = (datetime.utcnow() - timedelta(days=i)).strftime("%Y-%m-%d")
        trend_map[day_date] = 0

    recent_list = []

    if use_mongodb and collection is not None:
        try:
            cursor = collection.find({}).sort("timestamp", pymongo.DESCENDING)
            docs = list(cursor)
            total = len(docs)

            for doc in docs:
                inv = doc.get("investigation", {})
                doc_date_str = doc.get("date", "") or doc.get("timestamp", "")
                
                if today_str in doc_date_str or today_str in str(doc.get("timestamp", "")):
                    today_count += 1

                r_level = str(inv.get("risk_level") or doc.get("risk_level", "Low")).lower()
                if r_level in risk_counts:
                    risk_counts[r_level] += 1
                else:
                    risk_counts["low"] += 1

                t_type = str(inv.get("ioc_type") or doc.get("ioc_type", "Unknown")).lower()
                if "ip" in t_type:
                    type_counts["ip_address"] += 1
                elif "domain" in t_type:
                    type_counts["domain"] += 1
                elif "url" in t_type:
                    type_counts["url"] += 1
                elif "hash" in t_type:
                    type_counts["file_hash"] += 1
                else:
                    type_counts["other"] += 1

                for d_key in trend_map.keys():
                    if d_key in doc_date_str or d_key in str(doc.get("timestamp", "")):
                        trend_map[d_key] += 1
                        break

            for doc in docs[:5]:
                doc_id = str(doc.get("id") or doc.get("_id"))
                inv = doc.get("investigation", {})
                recent_list.append({
                    "id": doc_id,
                    "ioc": inv.get("ioc", doc.get("ioc", "Unknown")),
                    "ioc_type": inv.get("ioc_type", doc.get("ioc_type", "Unknown")),
                    "risk_level": inv.get("risk_level", doc.get("risk_level", "Low")),
                    "timestamp": doc.get("timestamp", ""),
                    "date": doc.get("date", doc.get("timestamp", "")),
                    "virustotal": inv.get("virustotal"),
                    "abuseipdb": inv.get("abuseipdb"),
                    "ai_summary": inv.get("ai_summary")
                })

            return {
                "total_investigations": total,
                "today_investigations": today_count,
                "risk_distribution": risk_counts,
                "type_distribution": type_counts,
                "investigations_over_time": [{"date": k, "count": v} for k, v in trend_map.items()],
                "recent_investigations": recent_list
            }

        except Exception as err:
            logger.error(f"MongoDB dashboard stats query error: {err}")

    # Fallback in-memory
    total = len(_in_memory_history)
    for item in _in_memory_history:
        inv = item.get("investigation", item)
        doc_date_str = item.get("date", "") or item.get("timestamp", "")

        if today_str in doc_date_str or today_str in str(item.get("timestamp", "")):
            today_count += 1

        r_level = str(inv.get("risk_level", "Low")).lower()
        if r_level in risk_counts:
            risk_counts[r_level] += 1
        else:
            risk_counts["low"] += 1

        t_type = str(inv.get("ioc_type", "Unknown")).lower()
        if "ip" in t_type:
            type_counts["ip_address"] += 1
        elif "domain" in t_type:
            type_counts["domain"] += 1
        elif "url" in t_type:
            type_counts["url"] += 1
        elif "hash" in t_type:
            type_counts["file_hash"] += 1
        else:
            type_counts["other"] += 1

        for d_key in trend_map.keys():
            if d_key in doc_date_str or d_key in str(item.get("timestamp", "")):
                trend_map[d_key] += 1
                break

    for item in _in_memory_history[:5]:
        inv = item.get("investigation", item)
        recent_list.append({
            "id": item.get("id"),
            "ioc": inv.get("ioc", "Unknown"),
            "ioc_type": inv.get("ioc_type", "Unknown"),
            "risk_level": inv.get("risk_level", "Low"),
            "timestamp": item.get("timestamp", ""),
            "date": item.get("date", ""),
            "virustotal": inv.get("virustotal"),
            "abuseipdb": inv.get("abuseipdb"),
            "ai_summary": inv.get("ai_summary")
        })

    return {
        "total_investigations": total,
        "today_investigations": today_count,
        "risk_distribution": risk_counts,
        "type_distribution": type_counts,
        "investigations_over_time": [{"date": k, "count": v} for k, v in trend_map.items()],
        "recent_investigations": recent_list
    }

