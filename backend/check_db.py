import sqlite3
import pandas as pd

conn = sqlite3.connect('learnmate.db')
try:
    df = pd.read_sql_query("SELECT id, email, full_name FROM users", conn)
    print(df)
except Exception as e:
    print(e)
conn.close()
