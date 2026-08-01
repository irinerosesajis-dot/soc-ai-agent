from app.utils.ioc_detector import detect_ioc_type

samples = [
    "8.8.8.8",
    "google.com",
    "https://google.com/login",
    "44d88612fea8a8f36de82e1278abb02f",
    "da39a3ee5e6b4b0d3255bfef95601890afd80709",
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
]

for s in samples:
    print(s, "->", detect_ioc_type(s))