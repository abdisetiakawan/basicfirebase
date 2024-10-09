import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  getFirestore,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

import "dotenv/config";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// init firebase app
initializeApp(firebaseConfig);

// init services
const db = getFirestore();
const auth = getAuth();

// collection reference
const collectionRef = collection(db, "books");

// queries
// const q = query(
//   collectionRef,
//   where("author", "==", "kakashi"),
//   orderBy("title", "desc")
// );
// queries
const q = query(collectionRef, orderBy("createdAt"));

// get collection data
// getDocs(collectionRef)
//   .then((data) => {
//     let books = [];
//     data.docs.forEach((doc) => {
//       books.push({
//         ...doc.data(),
//         id: doc.id,
//       });
//     });
//     console.log(books);
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

// realtime collection data
const unsubscribeCol = onSnapshot(q, (data) => {
  let books = [];
  data.docs.forEach((doc) => {
    books.push({
      ...doc.data(),
      id: doc.id,
    });
  });
  console.log(books);
});

// adding documents
const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = addBookForm.title.value;
  const author = addBookForm.author.value;

  addDoc(collectionRef, {
    title,
    author,
    createdAt: serverTimestamp(),
  }).then(() => {
    addBookForm.reset();
  });
});

// deleting documents
const deleteBookForm = document.querySelector(".delete");

deleteBookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const docRef = doc(db, "books", deleteBookForm.id.value);
  deleteDoc(docRef).then(() => {
    deleteBookForm.reset();
  });
});

// updating a document
const updateBookForm = document.querySelector(".update");

updateBookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = updateBookForm.title.value;
  const author = updateBookForm.author.value;
  const docRef = doc(db, "books", updateBookForm.id.value);
  updateDoc(docRef, {
    title,
    author,
  }).then(() => {
    updateBookForm.reset();
  });
});

// signin users up
const signupForm = document.querySelector(".signup");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signupForm.email.value;
  const password = signupForm.password.value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log("User Created: ", cred.user);
      signupForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// logging in and out
const logoutButton = document.querySelector(".logout");

logoutButton.addEventListener("click", (e) => {
  e.preventDefault();
  signOut(auth)
    .then(() => {
      console.log("user signed out");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;
  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log("user logged in: ", cred.user);
      loginForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// unsubscribing from changes (auth and db)
const unsubButton = document.querySelector(".unsub");

unsubButton.addEventListener("click", (e) => {
  console.log("unsubscribing");
  unsubAuth();
  unsubscribeCol();
});

// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("user logged in: ", user);
  } else {
    console.log("user logged out");
  }
});

// get a single document
// const docRef = doc(db, "books", "Hu6Lej1J1FnEdPgxcyli");
// getDoc(docRef).then((doc) => {
//   console.log(doc.data(), doc.id);
// });

// onSnapshot(docRef, (doc) => {
//   console.log(doc.data(), doc.id);
// });
