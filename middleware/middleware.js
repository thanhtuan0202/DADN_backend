import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
  } from "firebase/auth";

const authenticationUser = async (req, res, next) => {
    let token = null;
    
};