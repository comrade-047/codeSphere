# codeSphere

A full-stack web application where users can write, run, and submit code in multiple programming languages (C++, Python, JavaScript, Java). Features include real-time code execution, user authentication, submission history, AI-based code review, and resizable panel layout like LeetCode.

---

## 🔧 Tech Stack

### Frontend:
- React 18
- Tailwind CSS v4
- Monaco Editor
- React Router
- React Resizable panels
- React Lucide Icons

### Backend:
- Node.js & Express
- MongoDB with Mongoose
- Docker (for code sandboxing)
- JWT Authentication
- Axios

---

## 📁 Folder Structure (key)

```
.
├── backend/                # Express + MongoDB server
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.js
│
├── compiler/               # Code execution logic
│   ├── runner/             # Language-specific runners
│   ├── docker/             # Dockerfiles per language
│   └── index.js
│
├── client/                 # React frontend
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── utils/
│   └── App.js
```

---

## ⚙️ Features

- ✅ User Signup / Login (JWT Auth)
- ✅ Monaco Editor with theme & language support
- ✅ Run and Submit Code (C++, Python, JavaScript, Java)
- ✅ Input/Output console
- ✅ View past submissions
- ✅ AI code review (limited to accepted submissions)
- ✅ Responsive and resizable panels

---

## 🚀 Getting Started (Local Development)

1. **Clone the repo**:
   ```bash
   git clone https://github.com/comrade-047/Online-Judge.git
   cd online-compiler
   ```

2. **Install dependencies** (client and backend):
   ```bash
   cd backend && npm install
   cd ../client && npm install
   ```

3. **Set up environment variables**:
   - Create `.env` files in `backend/` and `client/` with your MongoDB URI, JWT secrets, etc.

4. **Run Docker-based compiler**:
   ```bash
   docker-compose up --build
   ```

5. **Start dev servers**:
   ```bash
   # In backend/
   npm run dev

   # In client/
   npm start
   ```

---

## 🧪 Future Improvements

- Add support for more languages (Rust, Go)
- Add problem scoring & leaderboard
- Auto-save code drafts
- Real-time collaboration

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
