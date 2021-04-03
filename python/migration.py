"""
    MariaDB to MongoDB migration script based on new structure for NoSQL
"""
import mariadb
import pymongo
import sys

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

sql_cur.execute("SELECT * FROM patient_vitals")
patient_vitals_result = sql_cur.fetchall()

sql_cur.execute("SELECT * FROM doctor")
doctor_result = sql_cur.fetchall()

sql_cur.execute("SELECT * FROM medical_record")
medical_record_result = sql_cur.fetchall()


# -------------- Get data from MariaDB -------------- 
    
print("Patient: ")
print(patient_result)
'''
print("Room: ")
print(room_result)

print("Hospital")
print(hospital_result)

print("Covid19_Test")
print(covid19_details_result)

print("doctor_results")
print(doctor_result)

print("medical_record")
print(medical_record_result)

print("ward record")
print(ward_result)
'''
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
print(res.inserted_ids)
#----------------------------
# ----------- Insert patient_vital data -----------
patient_vital_collection = hospital_db['patient_vital']
patient_vital_collection.drop()

patient_vital_list = []

for i in patient_vitals_result:
    patient_vital = {
            "patient_vital_id" : i['pv_id'],
            "patient_id" : i['patient_patient_id'],
            "heart_rate" : i['heart_rate'],
            "bp_systolic" : i['bp_systolic'],
            "bp_diastolic" : i['bp_diastolic'],
            "temperature" : i['temperature'],
            "vital_datetime" : i['vital_datetime']
            }
    print(patient_vital)

sql_conn.close()
