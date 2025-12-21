# WANDERLUST 🧭

WanderLust is a complete full‑stack web application inspired by platforms like Airbnb. The goal of this project was to understand how real‑world web applications are built end‑to‑end — from backend architecture and database design to authentication, third‑party integrations, and deployment.

This project was designed and implemented entirely by me as a major learning project, with a strong focus on backend logic, security, and real production‑style workflows rather than just UI.

# 🌟 KEY FEATURE
1.) User authentication & authorization (login, signup, protected routes)

2.) Persistent session management using MongoDB Atlas

3.) Create, edit, and delete property listings

4.) Image upload and storage using Cloudinary

5.) Interactive maps using Leaflet and OpenStreetMap

6.) Search and filter listings by title, location, or country

7.) Flash messages and proper error handling

8.) Server‑side rendering using EJS templates

9.) Deployed on Render with environment‑based configuration

# 🛠 TECH STACK
1.) Backend
- Node.js
- Express.js
  
2.) Database
- MongoDB Atlas
- Mongoose ODM

3.) Frontend (Server‑Side Rendered)
- EJS
- HTML, CSS, Bootstrap

4.) Authentication & Sessions
- Passport.js
- express‑session
- connect‑mongo

5.) External Services
- Cloudinary (image storage)
- Leaflet + OpenStreetMap (maps)

 6.) Deployment
 - Render
 - GitHub

# What I Focused On While Building This -
Instead of just creating pages, I focused on understanding:

1.) How authentication and sessions actually work

2.) How data flows from the client to the server and database

3.) How to securely store sessions in MongoDB using connect‑mongo

4.) How to integrate third‑party services (maps, image uploads)

5.) How deployment differs from local development

6.) How to debug real production‑level errors (MongoDB Atlas, DNS, env variables)

# This project helped me move from "writing code" to "thinking like a backend developer".

# 🧠 Challenges & Learning Outcomes

Building WanderLust wasn't just about writing code; it was about solving real-world production hurdles. Some of the key challenges I overcame include:

### 1. API Selection & Risk Management (Maps)
- **Challenge:** Initially planned to use Mapbox but discovered it required credit card credentials for API access, which posed a financial risk for a student project.
- **Solution:** Pivoted to **Leaflet.js** and **OpenStreetMap**, which are open-source and free. 
- **Technical Hurdle:** Faced an issue where the map would only show a hardcoded default location rather than the listing's actual coordinates.
- **Fix:** Implemented a geocoding logic that checks for valid location strings. I updated the backend to prioritize the actual Latitude/Longitude of the listing, using the default location only as a "fallback" in case of timeouts or geocoding errors.

### 2. Cloud Storage & Asynchronous Data Flow (Cloudinary)
- **Challenge:** Storing high-quality images directly in MongoDB is inefficient and increases database load. I also faced an issue where images sometimes failed to render immediately after upload due to asynchronous behavior.
- **Solution:** Integrated Cloudinary for cloud-based image storage and stored only the returned secure image URL in MongoDB instead of raw image data.
- **Technical Hurdle:** Handling multipart/form-data requests and ensuring the image upload completes before saving the listing data.
- **Fix:** Used **multer** along with **multer-storage-cloudinary** to parse incoming files. Implemented async/await logic so the database saves the listing only after Cloudinary confirms a successful upload, preventing broken image links and ensuring reliable rendering.

### 3. Cloud Storage & Asynchronous Data Flow (Cloudinary)
- **Challenge:** During the initial deployment on Render, the application failed to connect to MongoDB Atlas because the .env file was included in .gitignore, meaning environment variables were not available in the production environment.
- **Root Cause:** Sensitive credentials (database URL, session secrets, Cloudinary keys) are intentionally excluded from version control, so the deployed application had no access to them by default.
- **Solution:** Added all required environment variables manually in the Render dashboard and configured MongoDB Atlas IP Whitelisting to allow connections from Render’s servers.
- **Fix:** After properly setting environment variables in Render and updating Atlas network access, I redeployed the application, which successfully established database connectivity and ran as expected in production.

### 4. Database Connectivity & DNS Issues (`EREFUSED`)
- **Challenge:** Encountered `EREFUSED` errors when connecting to MongoDB Atlas due to local ISP restrictions on SRV records.
- **Solution:** Debugged network-level issues by whitelisting IP addresses in Atlas and switching to Google's Public DNS (8.8.8.8) to ensure stable communication between the Node.js server and the cloud database.

# ⚙️ Installation & Setup :

 Prerequisites
 - Node.js (v18+ recommended)
 - MongoDB Atlas account
 - Cloudinary account

Steps :
1.) Clone the repository git clone https://github.com/Rishit110305/Major-Project.git

2.) Install dependencies ( npm install )

3.) Create a .env file in the root directory
DB_URL=your_mongodb_atlas_url
SESSION_SECRET=your_session_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
NODE_ENV=development

4.) Start the server 

5.) Open in browser ( http://localhost:8080 )

# 🌐 Live Demo
Deployed on Render: https://major-project-2x5b.onrender.com

# 🪜 Project Structure
- models/ – Mongoose schemas
- controllers/ – All logics
- views/ – EJS templates
- public/ – Static assets (CSS, JS)
- utils/ – Helper functions & error handling

# 🙌 Acknowledgement
This project was built as part of my learning journey in full‑stack web development. It reflects my understanding of backend systems, databases, authentication, and deployment, and it played a major role in strengthening my confidence as a developer.

# 📫 Contact
If you have feedback or suggestions, feel free to connect with me.

Developer: Rishit Goswami
