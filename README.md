🚖 Ride-Ease: Ride-Ease is a full-stack ride-booking web application designed to simplify urban transportation by giving users greater control and flexibility over their journeys. Unlike traditional ride-hailing platforms, Ride-Ease allows passengers to book rides with multiple pickup and multiple drop locations in a single trip. This ensures convenience for groups of people traveling together or for individuals who need to make several stops along their route.
The platform is built with a user-friendly interface for customers to quickly book, manage, and track their rides in real time. At the same time, it provides a dedicated driver dashboard where drivers can view assigned trips, navigate through optimized routes, and monitor their earnings with ease.
On the technical side, Ride-Ease integrates secure authentication (JWT + Google OAuth), interactive route mapping powered by OSRM, and seamless online payments via Razorpay. The system is backed by Node.js, Express, and MongoDB on the backend and a React + Tailwind CSS frontend, ensuring both performance and scalability.
By combining real-time routing, flexible booking options, and transparent payments, Ride-Ease aims to deliver a modern, reliable, and efficient ride-booking experience for both riders and drivers.

✨ Features

1. 🔐 Authentication System – Secure login/signup with JWT + Google OAuth
2. Multiple Pickup & Drop Locations – Flexible and customizable route planning
3. 🗺 Live Route Mapping – Powered by OSRM (Open Source Routing Machine)
4. 💳 Online Payments – Integrated with Razorpay
5. 👤 User & Driver Dashboards – Manage bookings, history, and profile
6. 💼 Admin Panel (future) – For monitoring and analytics
   
🛠 Tech Stack

 Frontend: React.js, Tailwind CSS
 Backend: Node.js, Express.js
 Database: MongoDB
 Authentication: JWT
 Mapping & Routing: OSRM
 Payments: Razorpay
 
🚀 Getting Started

1. Clone the repository
   git clone https://github.com/Nabhyadav6829/Ride-Ease.git
   cd Ride-Ease
2. Install dependencies
   For both frontend and backend:
   npm install
3. Setup environment variables
   Create a .env file in the backend directory and add:
    PORT=5000
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_secret_key
    RAZORPAY_KEY_ID=your_key_id
    RAZORPAY_KEY_SECRET=your_key_secret
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
4. Run the app
   Start backend server:
     npm run server
   Start frontend:
     npm start
   
📸 Screenshots
<img width="1899" height="1050" alt="Screenshot 2025-09-06 140301" src="https://github.com/user-attachments/assets/44059629-6a20-4eac-a6b0-4ad014847c5d" />
<img width="1914" height="1046" alt="Screenshot 2025-09-06 140344" src="https://github.com/user-attachments/assets/a4ba4c7b-12de-4b32-8ae1-ead35aed556a" />
<img width="1897" height="1059" alt="Screenshot 2025-09-06 140422" src="https://github.com/user-attachments/assets/8c50e06f-1e48-4d5b-bd8b-eb543bab02f7" />
<img width="1898" height="1048" alt="Screenshot 2025-09-06 140444" src="https://github.com/user-attachments/assets/4c58ed92-183a-41e2-be8d-3199454291b1" />
<img width="1890" height="1042" alt="Screenshot 2025-09-06 140544" src="https://github.com/user-attachments/assets/8b34f35f-6dd6-4540-9e61-32c5e78b7404" />


try it out: https://ride-ease.onrender.com/

🤝Contributions are welcome!

 Fork the repo
 Create a new branch (feature/your-feature)
 Commit your changes
 Push and create a Pull Request

📜 License

This project is licensed under the MIT License.
