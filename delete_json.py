import os
path = "public/data/status.json"
if os.path.exists(path):
    os.remove(path)
    print("Deleted.")
else:
    print("Not found.")
