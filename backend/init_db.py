import sqlite3

conn = sqlite3.connect("backend/database.db")
cursor = conn.cursor()

cursor.execute("""
DROP TABLE IF EXISTS users
""")

cursor.execute("""
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    edad INTEGER,
    ciudad TEXT,
    orientacion TEXT,
    bio TEXT,
    hobbies TEXT,
    intereses TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

conn.commit()
conn.close()

print("Base de datos creada correctamente")
