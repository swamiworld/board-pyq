/* App settings. Same Firebase project as study-desk.
   While apiKey starts with "PASTE", the app runs in demo mode and saves data on the device only.
   On localhost you can also add ?demo=1 (student) or ?demo=parent to the address to force demo mode. */
window.APP_CONFIG = {
  firebase: {
    apiKey: "AIzaSyBZSTSQp3kQ967kunJJqaoBEZITtLka9RM",
    authDomain: "study-desk-a8b12.firebaseapp.com",
    projectId: "study-desk-a8b12",
    storageBucket: "study-desk-a8b12.firebasestorage.app",
    messagingSenderId: "149289090409",
    appId: "1:149289090409:web:d937e31140d3582aa8d1f8"
  },

  // The admin adds parents and students inside the app (stored in Firestore).
  adminEmail: "swamiworld@gmail.com",

  // First-run seed only: when the admin first signs in, these students are added under the first parent.
  // Demo mode also starts from them. After that, manage people in the app, not here. Lowercase emails.
  students: [
    { email: "dharshiniworld@gmail.com", name: "Dharshini" }
  ],
  parentEmails: ["swamiworld@gmail.com"],

  // Subjects. `bank` is the window variable set by that subject's question file (questions.js sets window.PYQ).
  // A subject shows up in the app only once its bank is loaded: add its <script> tag in index.html.
  // paperSize = questions in a full Section A, used to show how many a paper is missing.
  // Question ids must be unique across all banks (Maths uses m0001...; use p, c, s, e prefixes for the others).
  subjects: [
    { key: "maths",    name: "Maths",            bank: "PYQ", paperSize: 20 },
    { key: "physics",  name: "Physics",          bank: "PYQ_PHYSICS" },
    { key: "chemistry",name: "Chemistry",        bank: "PYQ_CHEMISTRY" },
    { key: "cs",       name: "Computer Science", bank: "PYQ_CS" },
    { key: "english",  name: "English",          bank: "PYQ_ENGLISH" }
  ],

  // Test defaults and limits
  defaults: { count: 10, timerOn: false },
  minCount: 5,
  maxCount: 30,
  secondsPerQuestion: 90,

  // Awards by percentage score, highest first
  awards: [
    { min: 100, key: "trophy", icon: "🏆", name: "Trophy",       line: "Perfect score!" },
    { min: 80,  key: "gold",   icon: "🥇", name: "Gold medal",   line: "Brilliant work!" },
    { min: 60,  key: "silver", icon: "🥈", name: "Silver medal", line: "Well done!" },
    { min: 40,  key: "bronze", icon: "🥉", name: "Bronze medal", line: "Good effort, keep climbing!" },
    { min: 0,   key: "star",   icon: "⭐", name: "Keep going star", line: "Every test makes you stronger." }
  ]
};
