// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBB1X2VE8D4No0vQ_lNJktOLKDah65qmR4",
  authDomain: "markinidia-ad8c7.firebaseapp.com",
  databaseURL: "https://markinidia-ad8c7-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "markinidia-ad8c7",
  storageBucket: "markinidia-ad8c7.firebasestorage.app",
  messagingSenderId: "966413003987",
  appId: "1:966413003987:web:edf8425871816d9c35b826"
};

firebase.initializeApp(firebaseConfig);

// Services
const auth = firebase.auth();
const db = firebase.database();
