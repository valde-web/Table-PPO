  const firebaseConfig = {
  apiKey: "AIzaSyCJ5dsUca2H-fChIAqVDMmzrwbQDLt5Vc8",
  authDomain: "table-ppo.firebaseapp.com",
  databaseURL: "https://table-ppo-default-rtdb.firebaseio.com",
  projectId: "table-ppo",
  storageBucket: "table-ppo.firebasestorage.app",
  messagingSenderId: "72568325953",
  appId: "1:72568325953:web:58bd21e97d5940c107c3c0",
  measurementId: "G-GPY9784S5B"
};

// Инициализация Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();