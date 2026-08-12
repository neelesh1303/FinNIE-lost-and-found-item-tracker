# lost-and-found# 🔎 FinNIE — Lost & Found Item Tracker

**FinNIE** is a simple web-based Lost & Found platform designed to make it easier for people to report missing items, share found items, and help them get back to their owners.

The idea is straightforward: instead of relying on messages, notice boards, or asking around, users can submit an item report with its details and an optional image. Found items can then be viewed by others along with the reporter's contact information.

> **FinNIE — Find, Identify, Notify, Inform, Engage**

## ✨ Features

* **Report Lost or Found Items**
  Submit details such as the item category, description, date, and current status.

* **Image Uploads**
  Attach an image of the item to make identification easier.

* **Found Items Listing**
  Browse items that have been reported as found.

* **Contact Information**
  Found-item reports display the reporter's email and phone number so the owner can get in touch.

* **Status Tracking**
  Reports can be marked as `Lost`, `Found`, or `Resolved`.

* **Automatic Resolution Handling**
  Resolved reports are removed from the active reports database.

* **Responsive Interface**
  A clean interface that works across different screen sizes.

## 🛠️ Tech Stack

| Technology       | Purpose                      |
| ---------------- | ---------------------------- |
| **Python**       | Backend programming          |
| **Flask**        | Web application framework    |
| **MySQL**        | Database for storing reports |
| **HTML**         | Page structure               |
| **CSS**          | Styling and responsive UI    |
| **JavaScript**   | Image preview functionality  |
| **Git & GitHub** | Version control              |

## 📂 Project Structure

```text
FinNIE/
│
├── app.py                  # Flask application and routes
├── requirements.txt        # Python dependencies
├── .gitignore
│
├── templates/
│   ├── base.html           # Shared layout
│   ├── home.html           # Landing page
│   ├── login.html          # Login page
│   ├── report.html         # Report submission form
│   └── reported.html       # Found items listing
│
└── static/
    ├── style.css           # Application styling
    └── uploads/            # Uploaded item images
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd FinNIE
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

On Windows:

```bash
venv\Scripts\activate
```

On macOS/Linux:

```bash
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure MySQL

Create a MySQL database for the application and configure the connection using environment variables.

Create a `.env` file:

```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DB=lost_and_found
MYSQL_PORT=3306
```

The `reports` table should contain fields for:

* ID
* Name
* Email
* Phone
* Category
* Description
* Reported Date
* Status
* Image

### 5. Run the application

```bash
python app.py
```

The application will be available at:

```text
http://127.0.0.1:5000
```

## 🔄 How FinNIE Works

### 1. Submit a Report

A user provides their contact details, item category, description, date, and status. An image can also be uploaded.

### 2. Store the Report

Flask receives the form data and stores the report in MySQL. Uploaded images are saved in the application's uploads directory.

### 3. Browse Found Items

Users can open the **Reported Items** section to see items currently marked as found.

### 4. Reconnect the Owner

If someone recognizes their missing item, they can use the contact details provided in the report to reach the person who found it.

### 5. Resolve the Item

Once the item has been returned, the report can be marked as **Resolved**, removing it from the active reports.

## 💡 Why I Built It

Losing something on a college campus can be surprisingly frustrating. Usually, people depend on E-mail spams and word of mouth to find their belongings.

I built FinNIE as a small practical solution to that problem — a single place where lost and found items can be reported, viewed, and connected back to their owners.

The project also gave me hands-on experience with **Flask, MySQL, form handling, file uploads, database operations, and building a complete web application from frontend to backend.**

## 🔮 Future Improvements

Some features I would like to add in future versions:

* 🔐 Proper user authentication and sessions
* 🔎 Search and filter items by category
* 📍 Location-based item reporting
* 🔔 Notifications when a possible match is reported
* 🖼️ Better image management
* 📊 User dashboard for managing personal reports
* 📱 Further improvements for mobile devices
* 🛡️ Better validation and security for uploaded files

## 👨‍💻 Author

**Neelesh Tripathi**

Built as a full-stack web development project using Flask and MySQL.

---

⭐ If you find FinNIE useful, consider giving the repository a star!
