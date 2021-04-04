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


# Get cursor
sql_cur = sql_conn.cursor(dictionary=True)

print("Closing connections")
sql_conn.close()
mongo_client.close()