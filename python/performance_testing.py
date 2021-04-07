"""
    Performance testing script between MongoDB and MariaDB
"""

from signal import signal, SIGINT
import data_gen as DataGen
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
    
print(f"\nTest runs for {numOfRuns} times")
    
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
        
def runTest(queryCallback, patient_vital=None):
    for i in range(numOfRuns):
        mongo_pv = {}
        if patient_vital:
            mongo_pv = {
                "patient_vital_id" : patient_vital.pv_id,
                "patient_id" : patient_vital.patient_patient_id,
                "heart_rate" : patient_vital.heart_rate,
                "bp_systolic" : patient_vital.bp_systolic,
                "bp_diastolic" : patient_vital.bp_diastolic,
                "temperature" : patient_vital.temperature,
                "vital_datetime" : patient_vital.vital_datetime,
                "covid19_details_covid_id" : patient_vital.covid19_details_covid_id
                }
        startTime = time.time()
        queryCallback(patient_vital, mongo_pv)
        endTime = time.time()
        t = endTime - startTime
        totalTimes.append(t)
        if patient_vital:
            patient_vital.pv_id += 1
        
        
# ----------- SQL -------------
def runSQLSelect(*args):
    sql_cur.execute(f"SELECT * FROM {tableName};")
    return sql_cur.fetchall()

def runSQLUpdate(*args):
    sql_cur.execute(f"UPDATE {tableName} SET heart_rate = 75;")
    # Required to make changes to the database
    sql_conn.commit()

def runSQLInsert(*args):
    DataGen.insert_data(args[0])
    DataGen.sql_conn.commit()
    
def runSQLDelete(*args):
    sql_cur.execute(f"DELETE FROM {tableName}")
    sql_conn.commit()

def sqlPrintResults(totalTimes):
    print("\nCalculating times for SQL")
    sqlAvgTime = getAvgTimesInMilli(totalTimes)
    print(f"Average time for SQL is: {sqlAvgTime}ms")
    return sqlAvgTime

# ----------- NoSQL -------------
def runNoSQLFind(*args):
    res = patient_vital_collection.find()
    return res

def runNoSQLUpdate(*args):
    patient_vital_collection.update_many({}, {'$set':{"heart_rate": 75}})
    
def runNoSQLInsert(*args):
    # define insert functions
    res = patient_vital_collection.insert_one(args[1])
    
def runNoSQLDelete(*args):
    patient_vital_collection.delete_many({})

def noSqlPrintResults(totalsTimes):
    print("\nCalculating times for NoSQL")
    noSQLAvgTime = getAvgTimesInMilli(totalTimes)
    print(f"Average time for NoSQL is: {noSQLAvgTime}ms")
    return noSQLAvgTime

p_id = int(DataGen.latest_patient_vital_record['pv_id'])
v_datetime = DataGen.latest_patient_vital_record['vital_datetime']
patient_vital = DataGen.PatientVital(p_id+1, v_datetime)
patient_vital=DataGen.generateVitals(patient_vital, DataGen.covid_vital_info)

# Get cursor
sql_cur = sql_conn.cursor(dictionary=True)
# Get MongoDB instance
db = mongo_client["csc2008_hospital"]

patient_vital_collection = db[f"{tableName}"]

sql_cur.execute("SELECT * FROM doctor LIMIT 1;")
doctor = sql_cur.fetchall()[0]

numOfEntries = len(runSQLSelect())
print(f"Test is done on {numOfEntries} entries")


# ---------- Query -----------
print(f"\nTesting Query speeds for {tableName}")

runTest(runSQLSelect)
    
sqlAvgTime = sqlPrintResults(totalTimes)
# print("\nCalculating times for SQL")
# sqlAvgTime = getAvgTimesInMilli(totalTimes)
# print(f"Average time for SQL is: {sqlAvgTime}ms")

    
runTest(runNoSQLFind)

print("\nCalculating times for NoSQL")
noSQLAvgTime = getAvgTimesInMilli(totalTimes)
print(f"Average time for NoSQL is: {noSQLAvgTime}ms")

printResults("Query", sqlAvgTime, noSQLAvgTime)
# ------------------------------------------


# ---------- Insert -----------
print(f"\n\nTesting Insert speeds for {tableName}")

runTest(runSQLInsert, patient_vital=patient_vital)

sqlAvgTime = sqlPrintResults(totalTimes)
# print("\nCalculating times for SQL")
# sqlAvgTime = getAvgTimesInMilli(totalTimes)
# print(f"Average time for SQL is: {sqlAvgTime}ms")

runTest(runNoSQLInsert, patient_vital=patient_vital)

print("\nCalculating times for NoSQL")
noSQLAvgTime = getAvgTimesInMilli(totalTimes)
print(f"Average time for NoSQL is: {noSQLAvgTime}ms")

printResults("Insert", sqlAvgTime, noSQLAvgTime)
# ------------------------------------------

# ---------- Update -----------
print(f"\n\nTesting Update speeds for {tableName}")

runTest(runSQLUpdate)

sqlAvgTime = sqlPrintResults(totalTimes)
# print("\nCalculating times for SQL")
# sqlAvgTime = getAvgTimesInMilli(totalTimes)
# print(f"Average time for SQL is: {sqlAvgTime}ms")

runTest(runNoSQLUpdate)

print("\nCalculating times for NoSQL")
noSQLAvgTime = getAvgTimesInMilli(totalTimes)
print(f"Average time for NoSQL is: {noSQLAvgTime}ms")

printResults("Update", sqlAvgTime, noSQLAvgTime)

# ------------------------------------------

# ---------- Delete -----------
print(f"\n\nTesting Delete speeds for {tableName}")

runTest(runSQLDelete)
sqlAvgTime = sqlPrintResults(totalTimes)

runTest(runNoSQLDelete)
noSQLAvgTime = noSqlPrintResults(totalTimes)

printResults("Delete", sqlAvgTime, noSQLAvgTime)
# ------------------------------------------

print("\nClosing connections")
sql_conn.close()
mongo_client.close()

 