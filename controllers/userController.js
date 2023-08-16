import Users from '../models/userModel.js';
import {getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword} from "firebase/auth";
import {firebaseDb} from "../config/firebase.js";

export const userLogin = async (req, res, next) => {

    const {email, password} = req.body;
    console.log("user login")
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            const newUser = Users.getById(user.uid)
            res.status(200).send({
                ...JSON.parse(newUser.toString()),
                accessToken: user.accessToken,
                message: 'success',
            })
            // ...
        })
        .catch((error) => {
            res.status(401).send({
                message: error.message,
            })
        });
}

export const userLogout = async (req, res, next) => {
    const auth = getAuth();
    await signOut(auth).then(() => {
        res.status(200).send({
            message: 'Log out successfully',
        })
    }).catch((error) => {
        res.status(401).send({
            message: error.message,
        })
    });
}

export const userSignup = async (req, res, next) => {
    const {email, password, name, photoURL, phoneNumber} = req.body;
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const newUser = new Users("12374asd", email, name, photoURL, phoneNumber);
            newUser.save();
            res.status(200).send({
                message: 'Sign up successfully',
            })
        })
        .catch((error) => {
            const errorCode = error.code;
            res.status(401).send({
                message: error.message,
            })
        });
}