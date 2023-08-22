import Users from "../models/userModel.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export const userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const auth = getAuth();
  await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      Users.getById(user.uid).then((newuser) => {
        res.status(200).send({
          ...JSON.parse(newuser.toString()),
          accessToken: user.accessToken,
          message: "success",
        });
      });
    })
    .catch((error) => {
        res.status(400);
        return next(new Error("Invalid email or password"));
    });
};

export const userLogout = async (req, res, next) => {
  const auth = getAuth();
  await signOut(auth)
    .then(() => {
      res.status(200).send({
        message: "Log out successfully",
      });
    })
    .catch((error) => {
      res.status(401).send({
        message: error.message,
      });
    });
};

export const userSignup = async (req, res, next) => {
  const { email, password, name, photoURL, phoneNumber } = req.body;
  if (!email || !password || !name || !photoURL || !phoneNumber) {
    res.status(400);
    return next(new Error("All fields must be fill"));
  }
  const auth = getAuth();
  await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const newUser = new Users(user.uid, email, name, photoURL, phoneNumber);
      newUser.save();
      res.status(200).send({
        message: "Sign up successfully",
      });
    })
    .catch((error) => {
      res.status(400);
      return next(new Error("Email has already used!"));
    });
};
