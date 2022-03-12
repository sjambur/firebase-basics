import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  collection,
  FieldValue,
  query,
  where,
  getDocs,
  getFirestore,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { faker } from "@faker-js/faker";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyCcRkGEWKXuBogRyU5Mc3VgGQC3oUa9y0s",
  authDomain: "fir-basics-e43d1.firebaseapp.com",
  projectId: "fir-basics-e43d1",
  storageBucket: "fir-basics-e43d1.appspot.com",
  messagingSenderId: "891733967335",
  appId: "1:891733967335:web:4c1180bcdad547f186bd42",
  measurementId: "G-JLGT3R11ST",
});

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const whenSignedIn = document.getElementById("whenSignedIn");
const whenSignedOut = document.getElementById("whenSignedOut");

const signInBtn = document.getElementById("signInBtn");
const signOutBtn = document.getElementById("signOutBtn");

const userDetails = document.getElementById("userDetails");

const createThing = document.getElementById("createThing");
const thingsList = document.getElementById("thingsList");

signInBtn.onclick = () => {
  signInWithPopup(auth, new GoogleAuthProvider());
};

signOutBtn.onclick = () => {
  signOut(auth);
};

let unsubscribe;
let thingsRef;

// Detect auth state

onAuthStateChanged(auth, (user) => {
  if (user !== null) {
    whenSignedIn.hidden = false;
    whenSignedOut.hidden = true;
    userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3> <p>User Id: ${user.uid}</p>`;
    thingsRef = collection(db, "things");

    createThing.onclick = async () => {
      const { serverTimeStamp } = new FieldValue();
      addDoc(thingsRef, {
        uid: user.uid,
        name: faker.commerce.productName(),
      });

      const q = query(thingsRef, where("uid", "==", user.uid));

      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push(`<li>${doc.data().name}</li>`);
        });
        thingsList.innerHTML = items.join("");
      });
    };
  } else {
    whenSignedIn.hidden = true;
    whenSignedOut.hidden = false;
    thingsList.innerHTML = "";

    // unsubscribe when user signs out

    unsubscribe && unsubscribe();
  }
});
