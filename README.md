# AI Academic Rule Assistant Using Retrieval-Augmented Generation (UniVerify)

An authenticated Academic Retrieval-Augmented Generation (RAG) Counselor that ingests official university regulations, circulars, handbooks, and examination rules to provide 100% source-verified, hallucination-free answers with exact page-level citations.

---

## 🔴 Problem Statement

University regulations governing attendance, grading, examinations, promotion credits, and condonation policies are typically distributed across lengthy PDF documents, handbooks, and intermittent office circulars.

When students encounter critical academic dilemmas, they face multiple challenges:
* **Manual Search Limits:** Scrolling through hundreds of pages or using `Ctrl + F` fails for conditional, multi-step queries (e.g., *"Can I appear for exams with 68% attendance if I have a medical certificate?"*).
* **AI Hallucinations:** Generic public chatbots lack access to private, autonomous university handbooks and circulars, frequently generating inaccurate, speculative answers that can risk a student's semester.
* **Administrative Bottlenecks:** College offices, exam cells, and department heads are inundated with repetitive inquiries, leading to long queues and delayed responses.

---

## 🟢 Proposed Solution

**UniVerify** is a specialized Academic RAG Assistant built strictly on authenticated institutional documents:
* **Strict Source Grounding:** The system answers strictly from ingested university PDFs, handbooks, and circular notices.
* **Exact Page Citations:** Every single answer references the exact Document Title, Clause/Section, and Page Number with clickable source previews.
* **Zero-Hallucination Guarantee:** If a policy or answer is not contained in the uploaded documents, the AI honestly states:
  > *"Information not found in the official university documents provided. Please consult the Academic Registrar or Controller of Examinations."*
* **Student & Administrator Portals:** Real-time role separation for student counseling and administrative circular publishing.

---

## 🚀 Key Features

### 1. Source-Verified Academic Q&A
* Answers include citations formatted as `[Doc: "Title", Page: X, Section: "Clause Y"]`.
* **Interactive Source Inspector:** Clicking any citation pill opens a modal with the verified excerpt and official document seal.

### 2. Multilingual Support (English, Telugu & Hindi)
* Instant toggling and localized responses in **English**, **Telugu (తెలుగు)**, and **Hindi (हिन्दी)**.
* Keeps academic terminologies (CGPA, SGPA, credits, condonation fee) intact while providing natural regional explanations.

### 3. Multimodal Academic Intelligence
* **Class Lecture Video & Audio Analyzer:** Summarizes recorded lectures, extracts core theorems/formulas, provides timestamped topic breakdowns, and predicts likely exam questions.
* **Notice Board & Circular OCR:** Ingests circular photos, notice board printouts, or grading diagrams with automatic deadline and reference number extraction.
* **Direct Vault Indexing:** Newly analyzed notices or lecture notes can be indexed directly into the live RAG repository with one click.

### 4. Automatic Practice Quiz Generator
* Analyzes ingested regulations or syllabus chunks to generate interactive 5-question multiple-choice quizzes.
* Includes difficulty tiers (Easy, Medium, Hard), instant color-coded feedback, regulation citations, explanations, and confetti scorecards.

### 5. Voice-Enabled Accessibility
* **Speech-to-Text (STT):** Microphone dictation for voice-based queries.
* **Text-to-Speech (TTS):** Natural speech playback with language-matched voices for English, Telugu, and Hindi.

### 6. Role-Based Authentication & Access Control (RBAC)
* **Firebase Authentication:** Google Sign-In and Email/Password authentication.
* **Tailored Registration Forms:**
  * **Students:** Configures Roll Number, Department, Semester, Recorded Attendance (%), and CGPA for personalized condonation warnings.
  * **Administrators:** Configures Employee ID, Designation (e.g., *Controller of Examinations*, *Dean of Academics*), and Office **without prompting for attendance or CGPA**.
* **Admin Dashboard:** Drag-and-drop PDF ingestion (client-side PDF.js parsing page-by-page), manual circular clause publishing, knowledge chunk deletion, and emergency top-ticker alerts.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **AI & LLM Engine** | **Google Gemini API** (`gemini-3.1-flash-lite`, `gemini-3.8-flash` via `@google/genai` SDK) |
| **Backend & Middleware** | **Node.js**, **Express.js**, **TypeScript** (`tsx`), `dotenv` |
| **Frontend Framework** | **React 19**, **Vite 8**, **TypeScript** |
| **UI & Styling** | **Tailwind CSS v4** (Glassmorphism design), **Lucide React**, **Canvas-Confetti** |
| **Document Ingestion** | **PDF.js** (`pdfjs-dist`) for browser client-side page-by-page extraction |
| **Database & Auth** | **Firebase Authentication** (Google SSO + Email/Password), **Cloud Firestore** |
| **Voice APIs** | **Web Speech Recognition** (STT) & **Web Speech Synthesis** (TTS) |

---

## 📁 Project Structure

```text
├── .env.example                     # Environment template
├── firebase-applet-config.json      # Firebase project credentials & configuration
├── firebase-blueprint.json          # Firestore schema definition (intermediate representation)
├── firestore.rules                  # Firestore security & role-based access rules
├── index.html                       # HTML5 entry point with Google Fonts
├── metadata.json                    # AI Studio metadata & server capabilities
├── package.json                     # Dependencies and build scripts
├── server.ts                        # Express server with Gemini API routes & Vite middleware
├── tsconfig.json                    # TypeScript compiler configuration
├── vite.config.ts                   # Vite configuration
└── src/
    ├── App.tsx                      # Root component: Tab routing, auth state, emergency alerts
    ├── main.tsx                     # React root mount
    ├── index.css                    # Tailwind CSS v4 styling & typography
    ├── types.ts                     # TypeScript data contracts & interfaces
    ├── data/
    │   └── initialDocuments.ts      # Authenticated R24 regulations, circulars & sample questions
    ├── firebase/
    │   └── config.ts                # Firebase Auth & Firestore client initialization
    ├── services/
    │   └── api.ts                   # Client-side API layer connecting to Gemini & LocalStorage
    ├── utils/
    │   ├── pdfParser.ts             # PDF.js page-by-page text extraction utility
    │   └── speech.ts                # Voice Speech-to-Text & Text-to-Speech assistants
    └── components/
        ├── AuthModal.tsx            # Dynamic Student vs Admin Google / Email authentication modal
        ├── Navbar.tsx               # Header with language switcher, profile badge, and tabs
        ├── RagChat.tsx              # Strict RAG chat with clickable citations & voice playback
        ├── DocumentVault.tsx        # Regulation repository, PDF reader, and category filtering
        ├── MultimodalAnalyzer.tsx   # Lecture video summarizer & circular notice OCR
        ├── QuizGenerator.tsx        # Automatic regulation quiz generator & scorecard
        ├── CircularsNoticeBoard.tsx # University bulletins, deadline trackers, and direct AI queries
        ├── AdminDashboard.tsx       # Drag & drop PDF ingestion, clause publishing & broadcast ticker
        └── CitationViewerModal.tsx  # Interactive source document page excerpt modal
```

---

## 💻 Run Locally

### 1. Prerequisites
Ensure you have the following installed on your system:
* **Node.js** (v18.0.0 or higher recommended)
* **npm** (v9.0.0 or higher)
* A valid **Google Gemini API Key** (obtainable from [Google AI Studio](https://aistudio.google.com/))

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/academic-rag-assistant.git
cd academic-rag-assistant
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy the example environment file and add your credentials:
```bash
cp .env.example .env
```
Open `.env` and set:
```env
# Google Gemini API Key for server-side inference
GEMINI_API_KEY="your-actual-gemini-api-key"

# Application hosting URL (optional for local dev)
APP_URL="http://localhost:3000"
```

### 5. Start the Development Server
The application runs as a unified full-stack server where Express mounts Vite middlewares on port `3000`:
```bash
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

### 6. Build for Production
To build the static assets for deployment:
```bash
npm run build
npm run start
```

---

## 🎯 Real-World Academic Use Cases

1. **Attendance Condonation Verification:**
   * A student with 68% attendance asks if they can appear for exams.
   * *UniVerify Response:* Identifies Clause 4.2 of the R24 Handbook, confirms eligibility for condonation (65%–74% bracket), states the ₹1,500 fee, requires a medical certificate within 3 days, and cites Page 2.
2. **CGPA to Percentage Conversion:**
   * Converts CGPA directly according to official university formula: `Percentage = (CGPA - 0.75) * 10` (Clause 7.4, Page 4).
3. **Promotion & Credit Check:**
   * Confirms credit thresholds required to enter 2nd, 3rd, and 4th academic years.
4. **Examination Malpractice & Penalties:**
   * Clarifies exact penalties for mobile phones, notes, or impersonation according to university disciplinary codes.
5. **Supplementary Exam Deadlines:**
   * Retrieves dates, late fees, and challenge evaluation rules from active Controller of Examinations (COE) circulars.
6. **Class Lecture Catch-Up:**
   * Uploads recorded lecture videos/slides to extract an executive summary and key exam definitions.

---

## 🔮 Future Enhancements

* **LMS Integration:** Direct two-way sync with Moodle, Canvas, and Blackboard for automated course regulation checks.
* **Instant WhatsApp / SMS Alerts:** Automated broadcast notifications when high-priority circulars (exam dates, detention lists) are published.
* **Exam Trend Prediction:** Fine-tuning a specialized Gemini model on 10 years of past university question papers to identify high-probability exam concepts.
* **Multi-Campus Multi-Tenancy:** Dynamic sub-organization support for autonomous colleges and multi-campus universities.

---

## 📄 License
This project is licensed under the Apache 2.0 License.
