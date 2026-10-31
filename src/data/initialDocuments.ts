import { DocumentChunk } from '../types';

export const INITIAL_UNIVERSITY_DOCUMENTS: DocumentChunk[] = [
  // Document 1: Academic Regulations (R24 Handbook)
  {
    id: 'reg-r24-p1',
    title: 'University Academic Regulations Handbook (R24)',
    category: 'Regulations',
    pageNumber: 1,
    section: 'Clause 1.0 - Academic Program & Duration of Study',
    content: `1.1 Title: These regulations shall be called Academic Regulations (R24) for Under Graduate (B.Tech) Programs.
1.2 Eligibility: Admission shall be made based on rank obtained in State EAPCET / JEE Mains or as per State Higher Education Council guidelines.
1.3 Normal Duration: The regular program of study for B.Tech degree shall be four (4) academic years consisting of eight (8) semesters.
1.4 Maximum Duration: A student must complete the program within a maximum period of eight (8) consecutive academic years from the academic year of admission (i.e. double the normal duration of study).
1.5 Lateral Entry: Lateral entry students admitted into the third semester (second year) must complete their course of study within a maximum period of six (6) consecutive academic years. Failure to meet this requirement leads to forfeiture of university seat.`,
    dateAdded: '2026-08-01',
    isOfficial: true,
    tags: ['duration', 'eligibility', 'lateral-entry', 'r24'],
  },
  {
    id: 'reg-r24-p2',
    title: 'University Academic Regulations Handbook (R24)',
    category: 'Regulations',
    pageNumber: 2,
    section: 'Clause 4.0 - Attendance Requirements, Condonation & Detention',
    content: `4.1 Minimum Attendance: A student shall be eligible to appear for Semester End Examinations (SEE) only if he/she acquires a minimum aggregate attendance of 75% in all subjects/laboratories prescribed for the semester.
4.2 Condonation of Shortage of Attendance: Condonation of shortage of attendance between 65% and 74% (both inclusive) may be recommended by the Principal/Dean on genuine medical grounds or university-authorized participation in National/State level sports, cultural, NCC, or NSS events.
4.3 Procedure for Condonation: Medical certificates with proper outpatient/inpatient hospital slips must be submitted to the Head of the Department within three (3) working days of returning to campus. A non-refundable condonation fee of ₹1,500/- (Rupees One Thousand Five Hundred only) per semester must be paid prior to examination hall ticket issuance.
4.4 Strict Detention Threshold: Under NO circumstances shall condonation be granted to students whose aggregate attendance is below 65%.
4.5 Consequence of Detention: A student who acquires less than 65% aggregate attendance is formally detained, is NOT eligible to write semester-end examinations, and must repeat that entire semester in the subsequent academic year with the next batch of students upon payment of tuition fee.`,
    dateAdded: '2026-08-01',
    isOfficial: true,
    tags: ['attendance', 'condonation', 'detention', 'medical-leave', 'fee'],
  },
  {
    id: 'reg-r24-p3',
    title: 'University Academic Regulations Handbook (R24)',
    category: 'Regulations',
    pageNumber: 3,
    section: 'Clause 6.0 - Credit Structure, Minimum Pass Marks & Promotion Rules',
    content: `6.1 Total Degree Credits: A student must earn a total of 160 credits to qualify for the award of B.Tech Degree.
6.2 Minimum Pass Marks:
  - Internal Continuous Assessment (CIE): Minimum 35% marks required (14 out of 40 marks).
  - Semester End Examination (SEE): Minimum 35% marks required (21 out of 60 marks).
  - Aggregate Minimum: An aggregate of 40% combined in CIE + SEE (40 out of 100 marks) is required to secure a pass grade in any course.
6.3 Promotion Criteria between Academic Years:
  - Promotion from 1st Year to 2nd Year: A student must acquire at least 50% of total credits allotted to 1st year (minimum 20 credits out of 40 credits).
  - Promotion from 2nd Year to 3rd Year: A student must acquire at least 60% of total credits allotted to 1st and 2nd years combined (minimum 48 credits out of 80 credits).
  - Promotion from 3rd Year to 4th Year: A student must acquire at least 60% of total credits allotted to 1st, 2nd, and 3rd years combined (minimum 72 credits out of 120 credits).
6.4 If a student fails to meet the required credit threshold for promotion, the student is held back in the existing year until sufficient credits are cleared in supplementary examinations.`,
    dateAdded: '2026-08-01',
    isOfficial: true,
    tags: ['credits', 'promotion', 'pass-marks', 'cie', 'see', 'backlogs'],
  },
  {
    id: 'reg-r24-p4',
    title: 'University Academic Regulations Handbook (R24)',
    category: 'Regulations',
    pageNumber: 4,
    section: 'Clause 7.0 - Grading System, SGPA/CGPA & Percentage Conversion',
    content: `7.1 10-Point Absolute Grading Scale:
  - Marks >= 90%: Grade 'O' (Outstanding) - Grade Point 10.0
  - Marks 80% to 89%: Grade 'A+' (Excellent) - Grade Point 9.0
  - Marks 70% to 79%: Grade 'A' (Very Good) - Grade Point 8.0
  - Marks 60% to 69%: Grade 'B+' (Good) - Grade Point 7.0
  - Marks 50% to 59%: Grade 'B' (Above Average) - Grade Point 6.0
  - Marks 40% to 49%: Grade 'C' (Pass) - Grade Point 5.0
  - Marks < 40%: Grade 'F' (Fail) - Grade Point 0.0
  - Absent: Grade 'Ab' - Grade Point 0.0
7.2 Semester Grade Point Average (SGPA): Sum of (Credits × Grade Points) divided by Sum of registered semester credits.
7.3 Cumulative Grade Point Average (CGPA): Calculated across all completed semesters.
7.4 Official CGPA to Percentage Conversion Formula:
  Percentage of Marks = (CGPA - 0.75) × 10
  Example: A CGPA of 8.25 equals (8.25 - 0.75) × 10 = 75.0%.
7.5 Degree Classification:
  - First Class with Distinction: CGPA >= 7.75, provided the student clears all subjects in first appearance within 4 regular years without any historical backlogs.
  - First Class: CGPA >= 6.75 and < 7.75.
  - Second Class: CGPA >= 5.75 and < 6.75.
  - Pass Class: CGPA >= 5.00 and < 5.75.`,
    dateAdded: '2026-08-01',
    isOfficial: true,
    tags: ['grading', 'cgpa', 'percentage-formula', 'distinction', 'sgpa'],
  },
  {
    id: 'reg-r24-p5',
    title: 'University Academic Regulations Handbook (R24)',
    category: 'Regulations',
    pageNumber: 5,
    section: 'Clause 9.0 - Examination Malpractice & Scale of Punishments',
    content: `9.1 Disciplinary Action for Malpractice in Examinations:
  - Case 1: Possession of unauthorized written/printed chits, scribbled notes, or electronic devices (smartphones, smartwatches, programmable calculators) in examination hall:
    Punishment: Expulsion from examination hall, cancellation of the performance in that specific subject, and a penalty fine of ₹1,000/-.
  - Case 2: Copying from notes or allowing other students to copy answers:
    Punishment: Cancellation of performance in ALL theory and practical subjects of that semester examination session.
  - Case 3: Tampering with answer booklet barcode, tearing pages, or inserting external sheets:
    Punishment: Cancellation of all subjects of the session + debarment from writing next two (2) subsequent semester examinations.
  - Case 4: Impersonation / Proxy attendance in examination:
    Punishment: Expulsion of both the candidate and impersonator for two (2) full academic years, cancellation of past semester results, and filing of police complaint under Section 419 of Indian Penal Code (IPC).
  - Case 5: Misbehavior, assault, or threatening invigilator/examination staff:
    Punishment: Immediate rustication from university for minimum three (3) years and criminal proceedings.`,
    dateAdded: '2026-08-01',
    isOfficial: true,
    tags: ['malpractice', 'penalties', 'exam-rules', 'discipline', 'expulsion'],
  },

  // Document 2: Examination & Evaluation Circular 2026
  {
    id: 'circ-exam-2026-p1',
    title: 'Examination & Evaluation Circular (Ref: COE/2026/SEE-SUPPL)',
    category: 'Circulars',
    pageNumber: 1,
    section: 'Circular Notification - Supplementary Registration & Fee Schedule',
    content: `OFFICE OF THE CONTROLLER OF EXAMINATIONS (COE)
CIRCULAR REF: COE/UNIV/2026/CIRC-114
DATE: October 20, 2026

SUBJECT: Schedule for Odd Semester End Examinations (SEE) & Supplementary Registration 2026-27.

1. Commencing Date of Regular Odd Semester Exams: December 01, 2026.
2. Supplementary Examination Registration Timeline:
  - Online Registration Starts: November 01, 2026
  - Last Date Without Late Fee: November 15, 2026 (5:00 PM)
  - Last Date With Late Fee of ₹500/-: November 20, 2026
  - Last Date With Super Fine of ₹2,000/-: November 25, 2026
3. Prescribed Examination Fees:
  - Whole Semester Regular Examination Fee: ₹1,800/-
  - Supplementary Fee for 1 Subject: ₹600/-
  - Supplementary Fee for 2 Subjects: ₹1,000/-
  - Supplementary Fee for 3 or more Subjects: ₹1,500/-
  - Laboratory/Project Supplementary Fee: ₹800/- per lab.
4. Hall tickets will be issued through student portal from November 27, 2026, strictly contingent upon clearance of tuition dues and minimum 75% attendance / approved condonation.`,
    dateAdded: '2026-10-20',
    isOfficial: true,
    tags: ['circular', 'supplementary', 'deadlines', 'exam-fee', 'see-2026'],
  },
  {
    id: 'circ-exam-2026-p2',
    title: 'Examination & Evaluation Circular (Ref: COE/2026/SEE-SUPPL)',
    category: 'Circulars',
    pageNumber: 2,
    section: 'Circular Notification - Revaluation, Challenge Evaluation & Grace Marks Policy',
    content: `5. Recounting & Revaluation Guidelines:
  - Recounting Fee: ₹400/- per subject (verifies totaling of marks only).
  - Revaluation Fee: ₹1,200/- per answer script.
  - Timeline: Applications must be submitted within seven (7) calendar days of result declaration.
  - Revision Rule: If the difference between original valuation and revaluation is >= 15% of maximum marks, the higher marks will be awarded. If difference is < 15%, the average of both marks will be considered.
6. Challenge Evaluation Policy:
  - If a student remains unsatisfied after revaluation, they may apply for Challenge Evaluation.
  - Fee: ₹10,000/- per answer script (caution deposit).
  - A panel of two senior external professors will independently evaluate the script in the COE office.
  - Refund condition: If the student scores an increase of 15% or more over previous marks, ₹8,000/- is refunded to student bank account. Otherwise, whole fee is forfeited.
7. Grace Marks Rule:
  - Grace marks up to maximum 0.5% of total aggregate marks of that semester can be added to a maximum of two (2) theory subjects to enable the candidate to pass, provided the candidate passes all other courses.`,
    dateAdded: '2026-10-20',
    isOfficial: true,
    tags: ['revaluation', 'challenge-evaluation', 'grace-marks', 'recounting'],
  },

  // Document 3: Mandatory Industrial Internship & MOOCs Policy
  {
    id: 'doc-internship-p1',
    title: 'Mandatory Industrial Internship & MOOCs Credit Transfer Guidelines',
    category: 'Handbooks',
    pageNumber: 1,
    section: 'Section 3.2 - Summer Internship & Swayam/NPTEL Policy',
    content: `1. Mandatory Internship Duration:
  - Every B.Tech student must undergo an industrial training / internship of minimum 6 to 8 weeks duration during the summer vacation between 6th and 7th semesters.
  - Weightage: 2 Credits. Evaluated through viva-voce and company supervisor completion certificate in 7th semester.
  - Internships at AICTE/MSME recognized industrial units, research laboratories (ISRO, DRDO, CSIR), or registered startup companies with valid GSTIN are accepted.
2. Online Courses & Credit Transfer (SWAYAM / NPTEL):
  - Students are permitted to earn up to twelve (12) credits through approved SWAYAM / NPTEL MOOC courses in place of Professional or Open Elective courses.
  - Minimum course duration: 8-week course equals 2 credits; 12-week course equals 3 credits.
  - Prior approval of Department Academic Advisory Committee (DAAC) is mandatory before registering for the MOOC course.
  - Only Proctored End-Term Exam certificates with >= 50% score are eligible for credit mapping.`,
    dateAdded: '2026-07-15',
    isOfficial: true,
    tags: ['internship', 'moocs', 'nptel', 'swayam', 'credits'],
  },

  // Document 4: Campus & Hostel Disciplinary Code
  {
    id: 'doc-hostel-p1',
    title: 'University Campus & Hostel Code of Conduct',
    category: 'Hostel & Discipline',
    pageNumber: 1,
    section: 'Clause 2.0 - Hostel Timings, Gate Pass & Anti-Ragging Mandatory Code',
    content: `2.1 Curfew & Movement Timings:
  - In-time for all residential hostels is strictly 9:30 PM on weekdays and 10:00 PM on weekends/holidays.
  - Biometric facial recognition entry closes automatically at 9:30 PM.
  - Outstation night-out permissions require digital consent through Warden ERP Portal from registered parent/guardian phone number at least 24 hours in advance.
2.2 Zero-Tolerance Anti-Ragging Policy:
  - Ragging in any form (verbal abuse, forced physical tasks, teasing, extortion) inside campus, hostels, or college buses is a cognizable criminal offense under Supreme Court of India directives and UGC Regulations 2009.
  - Action on Incident: Upon receipt of verbal or written complaint, the Anti-Ragging Squad investigates within 24 hours.
  - Penalties: Immediate suspension from hostel and classes, withholding scholarship/results, permanent debarment from admission to any other institution, and mandatory filing of FIR with local police station within 12 hours under Section 3 of Anti-Ragging Act.
2.3 Quiet Hours: 11:00 PM to 6:00 AM are designated silent study hours across all hostel blocks. Loud speakers or musical equipment are prohibited.`,
    dateAdded: '2026-06-10',
    isOfficial: true,
    tags: ['hostel-rules', 'curfew', 'anti-ragging', 'discipline', 'warden'],
  },
];

export const SAMPLE_QUESTIONS = [
  {
    id: 'q1',
    question: 'Can I write my semester exams if I have 68% attendance?',
    category: 'Attendance',
    expectedDoc: 'University Academic Regulations Handbook (R24), Page 2',
  },
  {
    id: 'q2',
    question: 'What is the official formula to convert CGPA to percentage?',
    category: 'Grading',
    expectedDoc: 'University Academic Regulations Handbook (R24), Page 4',
  },
  {
    id: 'q3',
    question: 'What is the credit requirement to get promoted from 2nd year to 3rd year?',
    category: 'Promotion',
    expectedDoc: 'University Academic Regulations Handbook (R24), Page 3',
  },
  {
    id: 'q4',
    question: 'What is the penalty if a student is caught with a mobile phone in the exam hall?',
    category: 'Malpractice',
    expectedDoc: 'University Academic Regulations Handbook (R24), Page 5',
  },
  {
    id: 'q5',
    question: 'What is the fee and procedure for challenge evaluation of answer scripts?',
    category: 'Evaluation',
    expectedDoc: 'Examination & Evaluation Circular (Ref: COE/2026/SEE-SUPPL), Page 2',
  },
  {
    id: 'q6',
    question: 'Does the university allow credit transfer for NPTEL or SWAYAM courses?',
    category: 'Internships',
    expectedDoc: 'Mandatory Industrial Internship & MOOCs Credit Transfer Guidelines, Page 1',
  },
];
