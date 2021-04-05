"""
    Data generation program to emulate taking in vitals data for patient
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


# ----- System variables ----- 
class CovidStatus(Enum):
    NOT_INFECTED = 0
    INFECTED = 1

class Symptoms(Enum):
    Dry_Cough = 0
    Fever = 1
    Tiredness = 2
    Arrythmia = 3
    Pneumonia = 4
    Sore_Throat = 5
    Headache = 6
    Runny_Nose = 7
    Cough = 8

class PatientVital():
    def __init__(self, pv_id, vital_datetime):
        self.pv_id = pv_id
        self.heart_rate = 0
        self.bp_systolic = 0
        self.bp_diastolic = 0
        self.temperature = 0
        self.vital_datetime = vital_datetime
        self.patient_patient_id = 100
        self.patient_room_room_id = 1100
        self.patient_room_hospital_hos_id = 1
        self.patient_patient_vitals_pv_id = 2000
        self.patient_doctor_doctor_id = 170995
        self.covid19_details_covid_id = 6500
    

enumRange = {
        "covidMin" : 0,
        "covidMax" : len(Symptoms)-2,
        "regMin" : 5,
        "regMax" : len(Symptoms)-1
        }

# ----- Util Functions -----
def getTime(): 
    return pandas.to_datetime(datetime.datetime.today()).round('H')

def generateVitals(patient_vital, vital_info):
    patient_vital.heart_rate = random.randint(vital_info['min_heart_rate'], vital_info['max_heart_rate'])
    patient_vital.bp_systolic = random.randint(vital_info['min_bp_systolic'], vital_info['max_bp_systolic'])
    patient_vital.bp_diastolic = random.randint(vital_info['min_bp_diastolic'], vital_info['max_bp_diastolic'])
    patient_vital.temperature = random.uniform(vital_info['min_temp'], vital_info['max_temp'])
    return patient_vital

def signal_handler(receiver, frame):
    print("\nClosing db connections")
    sql_conn.close()
    mongo_client.close()
    exit()
    
def insert_data(pv_id, heart_rate, bp_systolic, bp_diastolic, temperature, vital_datetime, patient_patient_id, patient_room_room_id, patient_room_hospital_hos_id, patient_patient_vitals_pv_id, patient_doctor_doctor_id, covid19_details_covid_id):
    sql_cur.execute("""INSERT INTO patient_vital 
        (pv_id, heart_rate, bp_systolic, bp_diastolic, temperature, vital_datetime,
         patient_patient_id, patient_room_room_id, patient_room_hospital_hos_id, 
        patient_patient_vitals_pv_id, patient_doctor_doctor_id, covid19_details_covid_id)
        VALUES (?, ?, ? ,? ,? ,? ,? ,? ,? ,? ,? ,?)""", (pv_id, heart_rate, bp_systolic, bp_diastolic, temperature, vital_datetime, patient_patient_id, patient_room_room_id, patient_room_hospital_hos_id, patient_patient_vitals_pv_id, patient_doctor_doctor_id, covid19_details_covid_id))
    
    
signal(SIGINT, signal_handler)
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

# Arrange in descending to get latest entry
sql_cur.execute("SELECT * FROM patient_vital ORDER BY vital_datetime DESC")
latest_patient_vital_record = sql_cur.fetchone()

sql_cur.execute("SELECT MIN(heart_rate) as min_heart_rate, MAX(heart_rate) as max_heart_rate, MIN(bp_systolic) as min_bp_systolic, MAX(bp_systolic) as max_bp_systolic, MIN(bp_diastolic) as min_bp_diastolic, MAX(bp_diastolic) max_bp_diastolic, MIN(temperature) as min_temp, MAX(temperature) as max_temp FROM patient_vital")

covid_vital_info = sql_cur.fetchone()
# print(latest_patient_vital_record['vital_datetime'])
regular_vital_info = {
    "min_heart_rate": 60,
    "max_heart_rate": 100,
    "min_bp_systolic": 90,
    "max_bp_systolic": 120,
    "min_bp_diastolic": 60,
    "max_bp_diastolic": 80,
    "min_temp": 35.5,
    "max_temp": 37.5 
}

# 0 is not infected, 1 is infected
currState = 1
currTime = latest_patient_vital_record['vital_datetime']
currPvID = latest_patient_vital_record['pv_id']
patient_vital = PatientVital(currPvID+1, currTime)
hourCounter = 0
minutesCounter = 1
entryCount = 0
if (len(sys.argv) > 1):
    limit = int(sys.argv[1])
else:
    limit = 10

# ------ Data Generation Loop ------
def generateData(entryCount, limit, patient_vital):
    while(entryCount < limit):
        min = 0
        max = 0

        patient_vital.vital_datetime += datetime.timedelta(hours = hourCounter, minutes=30)
        print(patient_vital.vital_datetime)
        # if(minutesCounter % 2 == 0):
        #     patient_vital.vital_datetime += datetime.timedelta(hours = hourCounter, minutes=0)
        #     print(patient_vital.vital_datetime)
        # else:
        #     patient_vital.vital_datetime += datetime.timedelta(hours = hourCounter, minutes=30)
        #     print(patient_vital.vital_datetime)
            
        # minutesCounter += 1
        # if(minutesCounter == 2):
        #     minutesCounter = 0
        #     hourCounter += 1

        if(CovidStatus(currState) is CovidStatus.NOT_INFECTED):
            # print("is not infected")
            min = enumRange['regMin']
            max = enumRange['regMax']
            patient_vital = generateVitals(patient_vital, regular_vital_info)
        elif(CovidStatus(currState) is CovidStatus.INFECTED):
            # print("is infected")
            min = enumRange['covidMin']
            max = enumRange['covidMax']
            patient_vital = generateVitals(patient_vital, covid_vital_info)

        # print(patient_vital.bp_diastolic)
        symptoms = ""
        addedSymptom = []

        for i in range(random.randint(1, 3)):

            sympInt = random.randint(min, max)

            if sympInt not in addedSymptom:
                if(i != 0):
                    symptoms += ", "
                addedSymptom.append(sympInt)
                symptom = Symptoms(sympInt).name.replace("_"," ")
                symptoms += symptom

        insert_data(patient_vital.pv_id, patient_vital.heart_rate, patient_vital.bp_systolic, patient_vital.bp_diastolic, patient_vital.temperature, patient_vital.vital_datetime, patient_vital.patient_patient_id, patient_vital.patient_room_room_id, patient_vital.patient_room_hospital_hos_id, patient_vital.patient_patient_vitals_pv_id, patient_vital.patient_doctor_doctor_id, patient_vital.covid19_details_covid_id)
        
        patient_vital.pv_id += 1
        entryCount += 1
        # if (entryCount == 10):
        #     try:
        #         sql_conn.commit()
        #         print("Entries committed")
        #     except mariadb.Error as e:
        #         print(f'Error committing changes: {e}')
        #     entryCount=0

        # Determine if patient has covid or not. End of loop to-do
        # if(random.randint(0,10) < 4):
        #     currState = 1
        # else:
        #     currState = 0

        time.sleep(1)
    sql_conn.commit()
    print("Entries committed")
    
# ---------------------------------
generateData(entryCount, limit, patient_vital)
sql_conn.close()
print("Connection closed")
