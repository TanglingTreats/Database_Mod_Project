"""
    MariaDB to MongoDB migration script based on new structure for NoSQL
"""
import mariadb
import sys

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
    
# Get cursor
sql_cur = sql_conn.cursor(dictionary=True)

# -------------- Get data from MariaDB -------------- 
# Retrieve patient data
sql_cur.execute("SELECT * FROM patient;")
patient_result = sql_cur.fetchall()

sql_cur.execute("SELECT * FROM patient_vitals")
patient_vitals_result = sql_cur.fetchall()

sql_cur.execute("SELECT * FROM room")
room_result = sql_cur.fetchall()

sql_cur.execute("SELECT * FROM hospital")
hospital_result = sql_cur.fetchall()

sql_cur.execute("SELECT * FROM covid19_details")
covid19_details_result = sql_cur.fetchall()

sql_cur.execute("SELECT * FROM doctor")
doctor_result = sql_cur.fetchall()

sql_cur.execute("SELECT * FROM medical_record")
medical_record_result = sql_cur.fetchall()

sql_cur.execute("SELECT * FROM ward_record")
ward_result = sql_cur.fetchall()
# -------------- Get data from MariaDB -------------- 
    
print("Patient: ")
print(patient_result)

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

sql_conn.close()
