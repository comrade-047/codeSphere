# codeSphere 🚀

codeSphere is a modern, full-stack online judge platform designed for competitive programming. It features an asynchronous and scalable architecture that allows users to write, run, and submit code in multiple languages. The platform includes a robust contest system with live leaderboards, a feature-rich discussion forum, and an admin panel for easy management.

---

## 🔧 Tech Stack

### **Frontend**
- **Framework:** React 18
- **Styling:** Tailwind CSS
- **Code Editor:** Monaco Editor
- **Routing:** React Router
- **UI:** React Resizable Panels, Lucide Icons

### **Backend & Infrastructure**
- **API:** Node.js & Express
- **Database:** MongoDB with Mongoose
- **Job Queue:** Redis with BullMQ
- **Authentication:** JSON Web Tokens (JWT)
- **Code Sandboxing:** Docker

### **Deployment**
- **Judge & Redis:** AWS EC2
- **Container Registry:** AWS ECR
- **Backend API:** Render (or similar PaaS)
- **Frontend:** Vercel (or similar static host)

---

## 📁 Project Architecture

The application is built on a decoupled, microservice-inspired architecture to ensure scalability and reliability.


```
.
├── backend/                # Express + MongoDB server
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.js
│
├── judge/               # Asynchronous job processor (compiles & runs code)
│   ├── config/          
│   ├── models/            (shared schemas)
|   ├── dockerRunner.js
│   └── utils.js
│   └── worker.js
│
├── client/                 # React frontend
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── utils/
│   └── App.js
```

---

## ✨ Features

- ✅ **Asynchronous Judging:** A scalable system using a job queue to handle multiple submissions without blocking the API.
- ✅ **Multi-Language Support:** Securely run and judge code in C++, Python, JavaScript, and Java.
- ✅ **Full Contest System:**
    - Admin panel to create and manage contests.
    - User registration for upcoming events.
    - Time-based problem visibility.
    - Leaderboard
- ✅ **Discussion Forum:**
    - General discussion area for community topics.
    - Problem-specific discussion tabs.
    - Create threads and post replies.
- ✅ **User Authentication:** Secure JWT-based authentication with persistent sessions.
- ✅ **Modern UI:** A clean, interface with resizable panels and dark mode.
- ✅ **AI Code Review:** Get an AI-powered review for accepted practice submissions.

---

## 🚀 Getting Started (Local Development)

This project uses **Docker Compose** to simplify the local setup. All services (backend, judge, database, and Redis) can be started with a single command.

### **Prerequisites**
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/) (for managing local files)

### **Setup**
1.  **Clone the repo**:
    ```bash
    git clone [https://github.com/comrade-047/Online-Judge.git](https://github.com/comrade-047/Online-Judge.git)
    cd Online-Judge
    ```
2. **Install dependencies** (client and backend):
   ```bash
   cd backend && npm install
   cd ../judge && npm install
   cd ../client && npm install
   ```

3.  **Set up environment variables**:
    - Create a `.env` file inside the `/server` directory.
    - Create another `.env` file inside the `/judge` directory.
    - Create another `.env` file inside `/client` directory
    - Populate them with your MongoDB URI, JWT secret, and Redis details as needed (see the `.env.example` files in each directory for a template). For local Docker Compose setup, the Redis host will be `redis`.

4.  **Build and Run the Application**:
    From the judge directory of the project, run:
    ```bash
    docker-compose up --build
    ```
    - The `--build` flag is only needed the first time you run it or after making changes to dependencies or Dockerfiles.
    - To run in the background, add the `-d` flag: `docker-compose up -d`.

Your application is now running!
- **Frontend:** `http://localhost:5173` (or your configured Vite port)
- **Backend API:** `http://localhost:3000`

---

## 🧪 Future Enhancements

- **Real-Time UI with WebSockets**  
  Replace the current polling mechanism with WebSockets (using a library like Socket.IO) for instant updates on submission statuses and live leaderboard changes.

- **Code Execution Optimization**  
  Further optimize the judge worker by pre-warming containers or exploring lighter-weight sandboxing technologies to reduce execution latency.

- **Problem of the Day (POTD)**  
  Implement a feature to automatically select and feature a "Problem of the Day" on the homepage to encourage daily engagement.

- **Enhanced User Profiles**  
  Build out user profiles with submission statistics, activity heatmaps, and ranking history.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
