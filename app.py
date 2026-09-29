from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_mysqldb import MySQL
import os
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

load_dotenv()

app = Flask(__name__)

limiter = Limiter(
    key_func=get_remote_address,
    app=app,
    default_limits=[]
)

# ---------- Configuration ----------
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST', 'localhost')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER', 'root')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB', 'lost_and_found')
app.config['MYSQL_PORT'] = int(os.getenv('MYSQL_PORT', 3306))
app.config['UPLOAD_FOLDER'] = os.path.join('static', 'uploads')

# Create upload folder if it doesn't exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# Initialize MySQL connection
mysql = MySQL(app)

# ---------- Mock Sample Data (For local dev / demo when MySQL is not connected) ----------
SAMPLE_FOUND_ITEMS = [
    (1, 'Set of Room & Bike Keys', 'student.lost@nie.ac.in', '+91 98450 12345', 'others', 'Found near reading table in Central Library 2nd floor. Has metallic silver keyring.', '2026-09-29', 'found', 'sg.jpg'),
    (2, 'Apple iPhone 13 (Product Red)', 'staff.assist@nie.ac.in', '+91 94480 54321', 'electronics', 'Found on Canteen bench during lunch break. Protected with transparent case.', '2026-09-28', 'found', 'rediphone.webp'),
    (3, 'Smart Fitness Watch (Black)', 'sports.desk@nie.ac.in', '+91 91234 56789', 'electronics', 'Located on the sidelines of the basketball court pavilion.', '2026-09-28', 'found', 'rsws.webp'),
    (4, 'Boat Wireless Earbuds (White)', 'security.gj@nie.ac.in', '+91 99887 76655', 'electronics', 'Deposited at Golden Jubilee security desk. Left on bench.', '2026-09-27', 'found', 'tws.webp'),
    (5, 'Student College ID Card & Lanyard', 'library.help@nie.ac.in', '+91 98765 43210', 'documents', 'Found in Mech Engineering Seminar Hall Row 4.', '2026-09-26', 'found', 'neel.jpg'),
    (6, 'Denim College Jacket (Size M)', 'lostdesk@nie.ac.in', '+91 97766 55443', 'clothing', 'Found hanging on chair in 3rd floor Computer Lab.', '2026-09-25', 'found', 'res_pic.jpg')
]

# ---------- Routes ----------

# Home page: FinNIE landing page with dynamic mascot stage
@app.route('/')
def home():
    return render_template('home.html')

# Report item page
@app.route('/report')
def report():
    return render_template('report.html')

# Form submission handler
@app.route('/submit', methods=['POST'])
@limiter.limit("10 per minute")
def submit():
    # Get form data
    name = request.form['name']
    email = request.form['email'].strip().lower()
    phone = request.form['phone']
    category = request.form['category']
    description = request.form['description']
    reported_date = request.form['reportedDate']
    status = request.form['status']
    image_file = request.files.get('image')

    if not email.endswith('@nie.ac.in'):
        return "Only @nie.ac.in email addresses are allowed.", 400

    # Handle image upload
    image_filename = None
    if image_file and image_file.filename != '':
        image_filename = secure_filename(image_file.filename)
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_filename)
        image_file.save(image_path)

    try:
        cur = mysql.connection.cursor()

        # If status is 'resolved', delete matching record
        if status.lower() == 'resolved':
            cur.execute('''
                DELETE FROM reports
                WHERE name = %s AND category = %s AND reported_date = %s
            ''', (name, category, reported_date))
        else:
            # Insert new report
            cur.execute('''
                INSERT INTO reports (name, email, phone, category, description, reported_date, status, image)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ''', (name, email, phone, category, description, reported_date, status, image_filename))

        mysql.connection.commit()
        cur.close()
    except Exception as e:
        # Fallback in local demo without live MySQL server
        pass

    return redirect(url_for('reported_items'))

# Reported items page: Shows only items marked as 'found'
@app.route('/reported')
def reported_items():
    search_query = request.args.get('q', '').strip()
    category = request.args.get('category', '').strip()

    query = "SELECT * FROM reports WHERE status = 'found'"
    params = []

    if search_query:
        query += " AND (LOWER(name) LIKE LOWER(%s) OR LOWER(category) LIKE LOWER(%s) OR LOWER(description) LIKE LOWER(%s))"
        term = f"%{search_query}%"
        params.extend([term, term, term])

    if category:
        query += " AND category = %s"
        params.append(category)

    query += " ORDER BY id DESC"

    try:
        cur = mysql.connection.cursor()
        cur.execute(query, params)
        found_items = cur.fetchall()
        cur.close()
    except Exception as e:
        # If MySQL connection fails or is offline, provide sample items for full UI preview
        filtered = []
        for item in SAMPLE_FOUND_ITEMS:
            matches_q = True
            if search_query:
                q_low = search_query.lower()
                matches_q = (q_low in item[1].lower() or q_low in item[4].lower() or q_low in item[5].lower())
            matches_cat = True
            if category:
                matches_cat = (category.lower() == item[4].lower())
            if matches_q and matches_cat:
                filtered.append(item)
        found_items = filtered

    return render_template('reported.html', reports=found_items, search_query=search_query, category_filter=category)

# ---------- Run the App ----------
if __name__ == '__main__':
    app.run(debug=True, port=5000)
