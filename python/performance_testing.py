"""
    Performance testing script between MongoDB and MariaDB
"""

from signal import signal, SIGINT
import pprint
import pandas
import mariadb
import pymongo
import sys
from enum import Enum
import datetime
import time
import random

try:
    print("Connecting to MariaDB")
    sql_conn = mariadb.connect(
        user="root",
        password="password",
        host="localhost",
        port=3306,
        database="csc2008_hospital"
    )
except mariadb.Error as e:
    print(f"Error connecting to MariaDB platform: {e}")
    sys.exit(1)

# Try connection for mongoDB
try:
    print("Connecting to MongoDB")
    mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")
except:
    print("No hosts found! Did you start mongodb service?")

# -------------- Test Params -----------------
numOfRuns = 5
totalTimes = []
# --------------------------------------------

def getAvgTimesInMilli(totalTimes):
    timeTaken = 0
    for i in totalTimes:
        timeTaken += i
    avgTime =  round((timeTaken / len(totalTimes)) * 1000, 2)
    return avgTime

# Get cursor
sql_cur = sql_conn.cursor(dictionary=True)
# Get MongoDB instance
db = mongo_client["csc2008_hospital"]

patient_vital_collection = db["patient_vital"]
print("\nTesting Query speeds for patient_vitals")

for i in range(5):
    startTime = time.time()
    sql_cur.execute("SELECT * FROM patient_vitals")
    res = sql_cur.fetchall()
    endTime = time.time()
    t = endTime - startTime
    totalTimes.append(t)
    
sqlAvgTime = getAvgTimesInMilli(totalTimes)
print(f"Average time for SQL is: {sqlAvgTime}ms")

totalTimes.clear()
    
for i in range(5):
    startTime = time.time()
    res = patient_vital_collection.find()
    endTime = time.time()
    t = endTime - startTime
    totalTimes.append(t)

mongoAvgTime = getAvgTimesInMilli(totalTimes)
print(f"Average time for NoSQL is: {mongoAvgTime}ms")

print("\nClosing connections")
sql_conn.close()
mongo_client.close()