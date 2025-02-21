import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBsE5jrGyhdMON9viGXH2pXRJa2PoeZt04",
  authDomain: "social-ecf83.firebaseapp.com",
  projectId: "social-ecf83",
  storageBucket: "social-ecf83.firebasestorage.app",
  messagingSenderId: "280883520151",
  appId: "1:280883520151:web:497a3a4c6e1f9ae5b43fd2",
  measurementId: "G-L7MG6ME4D7"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Google Sign-in function
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("Google User:", result.user);
  } catch (error) {
    console.error("Google Sign-in Error:", error);
  }
};

// GitHub Sign-in function
export const signInWithGithub = async () => {
  const provider = new GithubAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("GitHub User:", result.user);
  } catch (error) {
    console.error("GitHub Sign-in Error:", error);
  }
};


export default auth;
