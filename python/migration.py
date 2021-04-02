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

# Retrieve patient data
sql_cur.execute("SELECT * FROM patient;")
patient_result = sql_cur.fetchall()

sql_cur.execute("SELECT * FROM patient_vitals")
patient_vitals_result = sql_cur.fetchall()
    
print(patient_result)
sql_conn.close()
