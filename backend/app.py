from flask import Flask, render_template, request, redirect, session, url_for

import os

import sqlite3

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "database.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

app = Flask(__name__)


app.secret_key = "super-secreta"


# ---------- LOGIN ----------
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")

        db = get_db()
        cursor = db.cursor()

        cursor.execute(
            "SELECT * FROM users WHERE email = ? AND password = ?",
            (email, password)
        )

        user = cursor.fetchone()
        db.close()

        if user:
            session["user_id"] = user["id"]
            session["user_nombre"] = user["nombre"]
            return redirect("/explorar")

        return "Credenciales incorrectas", 401

    return render_template("frontend/login/index.html")



@app.route("/preferencias")
def preferencias():
    if "user" not in session:
        return redirect("/login")
    return render_template("frontend/preferencias/index.html")


@app.route("/mis_matches")
def mis_matches():
    if "user" not in session:
        return redirect("/login")
    return render_template("frontend/mis_matches/index.html")



# ---------- LOGOUT ----------
@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login")

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        nombre = request.form.get("nombre")
        email = request.form.get("email")
        password = request.form.get("password")
        edad = request.form.get("edad")
        ciudad = request.form.get("ciudad")
        orientacion = request.form.get("orientacion")
        bio = request.form.get("bio")
        hobbies = request.form.get("hobbies")
        intereses = request.form.get("intereses")

        conn = get_db()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO users (
                nombre, email, password, edad, ciudad,
                orientacion, bio, hobbies, intereses
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            nombre, email, password, edad, ciudad,
            orientacion, bio, hobbies, intereses
        ))

        conn.commit()
        conn.close()

        return redirect("/login")

    return render_template("frontend/register/index.html")

@app.route("/debug/users")
def debug_users():
    conn = get_db()
    users = conn.execute("SELECT * FROM users").fetchall()
    conn.close()
    return str([dict(u) for u in users])



# ---------- PROTECCIÓN SIMPLE ----------
@app.route("/explorar")
def explorar():
    if "user" not in session:
        return redirect("/login")
    return render_template("frontend/explorar/index.html")


if __name__ == "__main__":
    app.run(debug=True)
