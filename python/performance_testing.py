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
if (len(sys.argv) > 1):
    numOfRuns = int(sys.argv[1])
else:
    numOfRuns = 5
    
totalTimes = []
# --------------------------------------------

def getAvgTimesInMilli(totalTimes):
    timeTaken = 0
    for i in totalTimes:
        timeTaken += i
    avgTime =  round((timeTaken / len(totalTimes)) * 1000, 2)
    return avgTime

def printResults(type, sqlTime, noSqlTime):
    if(sqlTime < noSqlTime):
        print(f"\nSQL {type} time is {round((noSqlTime - sqlTime), 2)}ms faster than NoSQL on average")
    else:
        print(f"\nSQL {type} time is {round((sqlTime - noSqlTime), 2)}ms slower than NoSQL on average")
        
def runTest(queryCallback):
    for i in range(numOfRuns):
        startTime = time.time()
        queryCallback()
        endTime = time.time()
        t = endTime - startTime
        totalTimes.append(t)

# Get cursor
sql_cur = sql_conn.cursor(dictionary=True)
# Get MongoDB instance
db = mongo_client["csc2008_hospital"]


patient_vital_collection = db["patient_vital"]
print("\nTesting Query speeds for patient_vitals")

def runSQLSelect():
    sql_cur.execute("SELECT * FROM patient_vitals")
    sql_cur.fetchall()

runTest(runSQLSelect)
    
print("\nCalculating times for SQL")
sqlAvgTime = getAvgTimesInMilli(totalTimes)
print(f"Average time for SQL is: {sqlAvgTime}ms")

totalTimes.clear()
    
def runNoSQLFind():
    res = patient_vital_collection.find()

runTest(runNoSQLFind)

print("\nCalculating times for NoSQL")
mongoAvgTime = getAvgTimesInMilli(totalTimes)
print(f"Average time for NoSQL is: {mongoAvgTime}ms")

printResults("Query", sqlAvgTime, mongoAvgTime)

print("\nClosing connections")
sql_conn.close()
mongo_client.close()