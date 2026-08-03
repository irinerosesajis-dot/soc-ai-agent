import io
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
    KeepTogether,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT


def generate_pdf_report(record: dict) -> bytes:
    """
    Generates a professional black-and-white printable A4 PDF report
    from a stored investigation document record.
    """
    buffer = io.BytesIO()

    # Document setup: A4 with 36pt (0.5 in) margins
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=45
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        alignment=TA_LEFT,
        textColor=colors.black
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        alignment=TA_LEFT,
        textColor=colors.HexColor("#333333")
    )

    classification_style = ParagraphStyle(
        'Classification',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        alignment=TA_RIGHT,
        textColor=colors.HexColor("#666666")
    )

    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        spaceBefore=10,
        spaceAfter=6,
        textColor=colors.black
    )

    normal_text = ParagraphStyle(
        'NormalText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor("#1A1A1A")
    )

    bold_label = ParagraphStyle(
        'BoldLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.black
    )

    story = []

    # Extract stored data
    inv_id = record.get("id", "N/A")
    timestamp = record.get("timestamp") or record.get("date") or "N/A"
    gen_timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")

    investigation = record.get("investigation") or record
    ioc = investigation.get("ioc") or record.get("ioc", "Unknown")
    ioc_type = investigation.get("ioc_type") or record.get("ioc_type", "Unknown")
    risk_level = investigation.get("risk_level") or record.get("risk_level", "Low")
    vt = investigation.get("virustotal") or record.get("virustotal")
    abuse = investigation.get("abuseipdb") or record.get("abuseipdb")
    ai_summary = (
        investigation.get("ai_summary")
        or record.get("ai_summary")
        or record.get("summary")
        or "AI summary unavailable."
    )

    # 1. Header Banner Table
    header_table_data = [
        [
            Paragraph("<b>AI SOC AGENT</b>", title_style),
            Paragraph("<b>Classification:</b> INTERNAL USE ONLY", classification_style)
        ],
        [
            Paragraph("Threat Intelligence Investigation Report", subtitle_style),
            Paragraph(f"<b>Report Date:</b> {gen_timestamp}", classification_style)
        ]
    ]

    header_table = Table(header_table_data, colWidths=[340, 182])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 6))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.black, spaceAfter=10))

    # 2. Metadata & Summary Grid Table
    story.append(Paragraph("Investigation Details & Summary", section_heading))
    
    meta_table_data = [
        [
            Paragraph("<b>Investigation ID:</b>", bold_label),
            Paragraph(str(inv_id), normal_text),
            Paragraph("<b>Target IOC:</b>", bold_label),
            Paragraph(str(ioc), normal_text)
        ],
        [
            Paragraph("<b>Timestamp:</b>", bold_label),
            Paragraph(str(timestamp), normal_text),
            Paragraph("<b>IOC Type:</b>", bold_label),
            Paragraph(str(ioc_type), normal_text)
        ],
        [
            Paragraph("<b>Status:</b>", bold_label),
            Paragraph("Completed", normal_text),
            Paragraph("<b>Risk Level:</b>", bold_label),
            Paragraph(f"<b>{risk_level}</b>", normal_text)
        ]
    ]

    meta_table = Table(meta_table_data, colWidths=[110, 150, 110, 152])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8F9FA")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#D0D5DD")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#EAECF0")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 12))

    # 3. VirusTotal Summary Section
    story.append(Paragraph("VirusTotal Threat Analysis", section_heading))
    if vt and isinstance(vt, dict):
        vt_data = [
            [
                Paragraph("<b>Malicious Detections</b>", bold_label),
                Paragraph("<b>Suspicious Detections</b>", bold_label),
                Paragraph("<b>Harmless Flags</b>", bold_label),
                Paragraph("<b>Undetected</b>", bold_label),
                Paragraph("<b>Reputation Score</b>", bold_label)
            ],
            [
                Paragraph(str(vt.get("malicious", 0)), normal_text),
                Paragraph(str(vt.get("suspicious", 0)), normal_text),
                Paragraph(str(vt.get("harmless", 0)), normal_text),
                Paragraph(str(vt.get("undetected", 0)), normal_text),
                Paragraph(str(vt.get("reputation", 0)), normal_text)
            ]
        ]
        vt_table = Table(vt_data, colWidths=[104, 104, 104, 104, 106])
        vt_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#EFEFEF")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CCCCCC")),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E0E0E0")),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(vt_table)
    else:
        story.append(Paragraph("VirusTotal data is not available for this investigation.", normal_text))
    
    story.append(Spacer(1, 12))

    # 4. AbuseIPDB Summary Section
    story.append(Paragraph("AbuseIPDB Threat Intelligence", section_heading))
    if abuse and isinstance(abuse, dict):
        abuse_data = [
            [Paragraph("<b>Abuse Confidence Score:</b>", bold_label), Paragraph(f"{abuse.get('abuseConfidenceScore', 0)}%", normal_text)],
            [Paragraph("<b>Country Code:</b>", bold_label), Paragraph(str(abuse.get('countryCode', 'N/A')), normal_text)],
            [Paragraph("<b>ISP Provider:</b>", bold_label), Paragraph(str(abuse.get('isp', 'N/A')), normal_text)],
            [Paragraph("<b>Usage Type:</b>", bold_label), Paragraph(str(abuse.get('usageType', 'N/A')), normal_text)],
            [Paragraph("<b>Total Community Reports:</b>", bold_label), Paragraph(str(abuse.get('totalReports', 0)), normal_text)],
            [Paragraph("<b>Last Reported At:</b>", bold_label), Paragraph(str(abuse.get('lastReportedAt') or 'N/A'), normal_text)]
        ]
        abuse_table = Table(abuse_data, colWidths=[180, 342])
        abuse_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (0,-1), colors.HexColor("#F8F9FA")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CCCCCC")),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E0E0E0")),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
        ]))
        story.append(abuse_table)
    else:
        story.append(Paragraph("Not applicable for this IOC type.", normal_text))

    story.append(Spacer(1, 14))

    # 5. AI Investigation Summary Section
    story.append(Paragraph("AI Investigation Summary (Google Gemini)", section_heading))
    story.append(HRFlowable(width="100%", thickness=0.75, color=colors.black, spaceAfter=8))

    # Formatter for AI summary sections
    ai_lines = ai_summary.splitlines()
    for line in ai_lines:
        line_str = line.strip()
        if not line_str:
            story.append(Spacer(1, 4))
            continue
        
        # Format headings
        if line_str.replace(":", "") in ["OVERALL ASSESSMENT", "THREAT RATIONALE", "RECOMMENDED NEXT ACTIONS"]:
            heading_title = line_str.replace(":", "")
            story.append(Spacer(1, 4))
            story.append(Paragraph(f"<b>{heading_title}</b>", ParagraphStyle(
                'AIHead',
                parent=normal_text,
                fontName='Helvetica-Bold',
                fontSize=10,
                leading=14,
                textColor=colors.black
            )))
            story.append(Spacer(1, 2))
        else:
            story.append(Paragraph(line_str, normal_text))
            story.append(Spacer(1, 2))

    story.append(Spacer(1, 12))

    # 6. Incident Report Card Details Table
    story.append(KeepTogether([
        Paragraph("Incident Report Details", section_heading),
        Table([
            [Paragraph("<b>Target IOC</b>", bold_label), Paragraph(str(ioc), normal_text)],
            [Paragraph("<b>IOC Type</b>", bold_label), Paragraph(str(ioc_type), normal_text)],
            [Paragraph("<b>Assessed Risk Level</b>", bold_label), Paragraph(f"<b>{risk_level}</b>", normal_text)],
            [Paragraph("<b>Investigation Date</b>", bold_label), Paragraph(str(timestamp), normal_text)],
            [Paragraph("<b>Investigation Status</b>", bold_label), Paragraph("Completed", normal_text)]
        ], colWidths=[180, 342], style=[
            ('BACKGROUND', (0,0), (0,-1), colors.HexColor("#F8F9FA")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CCCCCC")),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E0E0E0")),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
        ])
    ]))

    # Footer Page Canvas Handler
    def add_footer(canvas, doc):
        canvas.saveState()
        canvas.setFont('Helvetica', 8)
        canvas.setFillColor(colors.HexColor("#555555"))
        
        # Footer text line 1 & 2
        footer_line1 = "Generated automatically by AI SOC Agent | Confidential Incident Report"
        footer_line2 = "Threat Intelligence Sources: VirusTotal • AbuseIPDB • Google Gemini AI"
        
        canvas.drawString(36, 28, footer_line1)
        canvas.drawString(36, 18, footer_line2)
        
        page_num = f"Page {canvas._pageNumber}"
        canvas.drawRightString(A4[0] - 36, 28, page_num)
        
        canvas.setStrokeColor(colors.HexColor("#CCCCCC"))
        canvas.setLineWidth(0.5)
        canvas.line(36, 38, A4[0] - 36, 38)
        canvas.restoreState()

    doc.build(story, onFirstPage=add_footer, onLaterPages=add_footer)
    
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
