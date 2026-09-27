# 🤟 Real-Time Sign Language Translator

A web-based, real-time Sign Language Translator powered by **MediaPipe Hands** and JavaScript. It uses your webcam to detect hand landmarks and translates numerical signs (1–9) and key word gestures instantly.

---

## ✨ Features

- **Real-Time Detection:** Rapid hand landmark tracking via webcam feed using MediaPipe Hands.
- **Custom Gesture Classifier:** Detects numbers **1 through 9** and **7 core word gestures**.
- **Dark / Light Mode:** Fixed theme toggle button in the top-right corner.
- **Responsive & Centered Design:** Clean UI with video-canvas overlay alignment and fixed bottom copyright.

---

## 🖐 Supported Gestures Guide

### 🔢 Numbers (1 to 9)

| Gesture | Hand & Finger Position |
| :--- | :--- |
| **1** | Index finger straight up; all other fingers closed into a fist. |
| **2** | Index and Middle fingers up (V-shape). |
| **3** | Thumb, Index, and Middle fingers extended. |
| **4** | Index, Middle, Ring, and Pinky up; Thumb tucked across palm. |
| **5** | All 5 fingers fully open with hand held **upright (vertical)**. |
| **6** | Thumb tip touches Pinky tip; Index, Middle, and Ring straight up. |
| **7** | Thumb tip touches Ring tip; Index, Middle, and Pinky straight up. |
| **8** | Thumb tip touches Middle tip; Index, Ring, and Pinky straight up. |
| **9** | Thumb tip touches Index tip (held at normal/lower height). |

### 💬 Word Gestures

| Gesture | Hand & Finger Position |
| :--- | :--- |
| **Hello** | All 5 fingers open with hand held **tilted/waving sideways**. |
| **Love You** | Thumb, Index, and Pinky extended; Middle and Ring folded down. |
| **Call Me** | Thumb and Pinky extended outward; middle 3 fingers folded down. |
| **Thumbs Up** | Only Thumb pointing straight up; all 4 fingers closed tightly into a fist. |
| **Super** | Thumb tip touches Index tip (👌 shape) held **high in camera view**. |
| **Help** | All 5 fingers closed into a tight fist held **low in frame (torso level)**. |
| **Angry** | All 5 fingers closed into a tight fist held **mid/high in frame (chest/face level)**. |

---

## 📁 Project Structure

```text
├── index.html     # Main HTML layout with top theme button & footer
├── style.css      # CSS styles, theme variables, and video/canvas alignment
├── script.js     # MediaPipe pipeline initialization & sign classification
└── README.md      # Project documentation