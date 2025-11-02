# 🎵 BandAid Track Generator

> Your personal, pocket-sized track generator. Instantly create musical backing for your vocals or compositions.

BandAid is a web-based track generator that lets you create simple melodies and drum beats right in your browser. It’s built with **React**, **Node.js**, **Tone.js**, and **Soundfont Player** — designed as a fun experimental tool for quick music ideas and rhythm exploration.

---

## 💡 The Problem It Solves

As people who love to sing, we often feel the need to have an instrumental backing, or have a melody or a composition in mind but lack an instrument to immediately try it out. BandAid was born to fix this exact problem, offering a seamless, handy solution for instant instrumental backing. Never lose your creative spark again.

## 🌟 Key Features

* **Instant Chord Progressions:** Quickly generate harmonic backdrops that perfectly complement your melodies and vocals.
* **Dynamic Customization:** Adjust tempo, key, and instrumentation to fine-tune every element of your unique track.
* **Seamless Looping:** Craft compelling rhythms with simple beat patterns and loop options for smooth, continuous playback.
* **Fluid Workflow:** Master your creative process with keyboard shortcuts for effortless real-time adjustments.

## 🤔 How It Works

1.  **Choose Your Scale:** Select your scale and a series of chords will form the harmonic foundation of your track.
2.  **Adjust and Customize:** Tailor your track with simple controls for tempo, scale, and instrument selection.
3.  **Generate and Play:** Instantly generate and play your backing track. It's that simple!

## 💻 Technology Stack

* **Frontend:** React
* **Backend:** Node.js (with Express)
* **Web Audio:** Tone.js & Soundfont Player

---

## 🏃‍♀️ How to Run This Project (Local Setup)

This project is split into a separate `frontend` (React) and `backend` (Node.js). You will need **two terminals** (like PowerShell or Command Prompt) open at the same time to run it.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/sneha-ojha/BandAid-trackgenerator.git](https://github.com/sneha-ojha/BandAid-trackgenerator.git)
    ```
2.  **Go into the main project folder:**
    ```bash
    cd BandAid-trackgenerator
    ```

---

### Terminal 1: Start the Backend Server

1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install the backend dependencies:
    ```bash
    npm install
    ```
3.  Start the backend server:
    ```bash
    node server.js
    ```
    *Leave this terminal running. You should see a message like "Server listening on port..."*

---

### Terminal 2: Start the Frontend App

1.  Open a **new, separate** terminal window.
2.  From the root `BandAid-trackgenerator` folder, navigate to the frontend:
    ```bash
    cd frontend
    ```
3.  Install the frontend dependencies:
    ```bash
    npm install
    ```
4.  Start the frontend development server:
    ```bash
    npm run dev
    ```

---

The app should now be running! Your browser will likely open automatically to the correct address (e.g., `http://localhost:5173`).

## 🤝 How to Contribute

This project is open source and we welcome contributions! This project is especially looking for help to **improve the instrument sound quality**.

If you have an idea for a feature or want to help, please feel free to:
1.  Fork the repository.
2.  Check out the [Issues tab](https://github.com/sneha-ojha/BandAid-trackgenerator/issues) to find tasks (especially those labeled `help wanted` or `good first issue`).
3.  Create a new branch for your feature (`git checkout -b feature/my-cool-feature`).
4.  Submit a Pull Request with a clear description of your changes.

Don't forget to read the `CONTRIBUTING.md` file for more details!

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

Built to solve by **Sneha Ojha**.
