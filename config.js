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

  // Google accounts, in lowercase
  students: [
    { email: "dharshiniworld@gmail.com", name: "Dharshini" }
  ],
  parentEmails: ["swamiworld@gmail.com"],

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
