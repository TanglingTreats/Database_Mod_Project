"""
    Data generation program to emulate taking in vitals data for patient
"""
import pprint
import mariadb
import pymongo
import sys
from enum import Enum
import time
import random


# ----- System variables ----- 
class CovidStatus(Enum):
    NOT_INFECTED = 0
    INFECTED = 1
currState = 0

class Symptoms(Enum):
    Dry_Cough = 0
    Fever = 1
    Tiredness = 2
    Arrythmia = 3
    Pneumonia = 4
    Runny_Nose = 5
    Cough = 6
    

enumRange = {
        "covidMin" : 0,
        "covidMax" : len(Symptoms)-1,
        "regMin" : 5,
        "regMax" : len(Symptoms)-1
        }

#------------------------------

pp=pprint.PrettyPrinter(indent=4)

# Try connection to mariadb
try:
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
    mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")
except:
    print("No hosts found! Did you start mongodb service?")

# Get cursor
sql_cur = sql_conn.cursor(dictionary=True)

# ------ Data Generation Loop ------
while(True):
    if(CovidStatus(currState) is CovidStatus.NOT_INFECTED):
        print("is not infected")
        print(Symptoms(random.randint(enumRange['regMin'], enumRange['regMax'])))
    elif(CovidStatus(currState) is CovidStatus.INFECTED):
        print("is infected")
        print(Symptoms(random.randint(enumRange['covidMin'], enumRange['covidMax'])))

    # Determine if patient has covid or not
    if(random.randint(0,10) < 4):
        currState = 1
    else:
        currState = 0
    time.sleep(2)
    
# ---------------------------------
sql_conn.close()
