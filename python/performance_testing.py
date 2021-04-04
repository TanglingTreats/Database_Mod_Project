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

tableName = "patient_vital"
# --------------------------------------------

def getAvgTimesInMilli(totalTimes):
    timeTaken = 0
    for i in totalTimes:
        timeTaken += i
    avgTime =  round((timeTaken / len(totalTimes)) * 1000, 2)
    totalTimes.clear()
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


patient_vital_collection = db[f"{tableName}"]
print(f"\nTesting Query speeds for {tableName}")

def runSQLSelect():
    sql_cur.execute(f"SELECT * FROM {tableName};")
    sql_cur.fetchall()

runTest(runSQLSelect)
    
print("\nCalculating times for SQL")
sqlAvgTime = getAvgTimesInMilli(totalTimes)
print(f"Average time for SQL is: {sqlAvgTime}ms")

    
def runNoSQLFind():
    res = patient_vital_collection.find()

runTest(runNoSQLFind)

print("\nCalculating times for NoSQL")
noSQLAvgTime = getAvgTimesInMilli(totalTimes)
print(f"Average time for NoSQL is: {noSQLAvgTime}ms")

printResults("Query", sqlAvgTime, noSQLAvgTime)

print(f"\nTesting Update speeds for {tableName}")

def runSQLUpdate():
    sql_cur.execute(f"UPDATE {tableName} SET heart_rate = 75;")
    # Required to make changes to the database
    sql_conn.commit()

runTest(runSQLUpdate)

sqlAvgTime = getAvgTimesInMilli(totalTimes)
print(f"Average time for SQL is: {sqlAvgTime}ms")

def runNoSQLUpdate():
    patient_vital_collection.update_many({}, {'$set':{"heart_rate": 75}})

runTest(runNoSQLUpdate)
noSQLAvgTime = getAvgTimesInMilli(totalTimes)
print(f"Average time for NoSQL is: {noSQLAvgTime}ms")

printResults("Update", sqlAvgTime, noSQLAvgTime)

print("\nClosing connections")
sql_conn.close()
mongo_client.close()