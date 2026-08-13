from flask import Flask, render_template, request, redirect, url_for
from flask_mysqldb import MySQL
import os
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
# import time

load_dotenv()

app = Flask(__name__)

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

# ---------- Routes ----------

# Home page: FinNIE landing page
@app.route('/')
def home():
    return render_template('home.html')

# Report item page
@app.route('/report')
def report():
    return render_template('report.html')

# Form submission handler
@app.route('/submit', methods=['POST'])
def submit():
    # Get form data
    name = request.form['name']
    email = request.form['email'].strip().lower()
    phone = request.form['phone']
    category = request.form['category']
    description = request.form['description']
    reported_date = request.form['reportedDate']
    status = request.form['status']
    image_file = request.files['image']

    if not email.endswith('@nie.ac.in'):
        return "Only @nie.ac.in email addresses are allowed.", 400

    # Handle image upload
    image_filename = None
    if image_file and image_file.filename != '':
        image_filename = secure_filename(image_file.filename)
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_filename)
        image_file.save(image_path)

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

    return redirect(url_for('report'))

# Reported items page: Shows only items marked as 'found'
@app.route('/reported')
def reported_items():
    # start_time = time.perf_counter()
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

    cur = mysql.connection.cursor()
    cur.execute(query, params)
    found_items = cur.fetchall()
    # end_time = time.perf_counter()
    # query_time = end_time - start_time
    # print(f"Search query time: {query_time * 1000:.3f} ms")
    cur.close()
    return render_template('reported.html', reports=found_items, search_query=search_query, category_filter=category)

# ---------- Run the App ----------
if __name__ == '__main__':
    app.run(debug=True)
