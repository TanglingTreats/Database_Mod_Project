"""
    MariaDB to MongoDB migration script based on new structure for NoSQL
"""
import pprint
import mariadb
import pymongo
import sys

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

# -------------- Get data from MariaDB -------------- 
# Retrieve patient data
sql_cur.execute("SELECT * FROM patient;")
patient_result = sql_cur.fetchall()

sql_cur.execute("SELECT * FROM patient_vital")
patient_vitals_result = sql_cur.fetchall()

sql_cur.execute("SELECT * FROM doctor")
doctor_result = sql_cur.fetchall()

sql_cur.execute("SELECT * FROM medical_record")
medical_record_result = sql_cur.fetchall()

sql_cur.execute("SELECT * FROM covid19_details")
covid_detail_result = sql_cur.fetchall()

# -------------- Get data from MariaDB -------------- 
    
# Start mongodb migration
# Separate unbounded information into different collection. e.g. patient vitals
hospital_db = mongo_client["csc2008_hospital"]

patient_collection = hospital_db['patient']
patient_collection.drop()

# ----------- Insert patient data -----------
patient_list = []

for i in patient_result:
    sql_cur.execute("SELECT * FROM doctor WHERE doctor_id = ?",(i['doctor_id'],))
    doc = sql_cur.fetchone()

    sql_cur.execute("SELECT * FROM room WHERE room_id = ?", (i['room_id'],))
    room = sql_cur.fetchone()
    patient = {
                "patient_id": i['patient_id'],
                "name": i['name'],
                "age" : i['age'],
                "gender" : i['gender'],
                "doctor" : doc,
                "ward_info" : {
                    "ward": room['ward_no'],
                    "room": room['room_no'],
                    "bed": room['bed_no']
                    }
            }
    patient_list.append(patient)
res = patient_collection.insert_many(patient_list)
# print(res.inserted_ids)
#----------------------------

# ----------- Insert patient_vital data -----------
patient_vital_collection = hospital_db['patient_vital']
patient_vital_collection.drop()

patient_vital_list = []

for i in patient_vitals_result:
    print(i['vital_datetime'])
    patient_vital = {
            "patient_vital_id" : i['pv_id'],
            "patient_id" : i['patient_patient_id'],
            "heart_rate" : i['heart_rate'],
            "bp_systolic" : i['bp_systolic'],
            "bp_diastolic" : i['bp_diastolic'],
            "temperature" : i['temperature'],
            "vital_datetime" : i['vital_datetime'],
            "covid19_details_covid_id" : i['covid19_details_covid_id']
            }
    print(patient_vital)
    patient_vital_list.append(patient_vital)

# pp.pprint(patient_vital_list)
res = patient_vital_collection.insert_many(patient_vital_list)
# print(res.inserted_ids)

# ----------- Insert covid19 test data -----------
covid_collection = hospital_db["covid_detail"]
covid_collection.drop()

covid_detail_list = []

sql_cur.execute("SELECT * FROM covid19_details INNER JOIN patient_vital ON covid19_details.covid_id = patient_vital.covid19_details_covid_id ")
covid_vital_result = sql_cur.fetchall()
# pp.pprint(covid_vital_result)
for i in covid_vital_result:
    covid_detail = {
        "covid_detail_id": i['covid_id'],
        "patient_id": i['patient_patient_id'],
        "is_positive": i['is_positive'],
        "infected_date": i['infected_date'],
        "injection_date": i['injection_date'],
        "last_tested": i['last_tested'],
        "symptoms": i['symptoms'],
        "condition": i['condition_status']
    }
    # print(covid_detail)
    covid_detail_list.append(covid_detail)

res = covid_collection.insert_many(covid_detail_list)
# print(res.inserted_ids)

sql_conn.close()
