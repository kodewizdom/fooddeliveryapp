import React, { useState, useEffect } from "react";
import { LoginBg, Logo } from "../assets";
import { LoginInput } from "../components";
import { FaEnvelope, FaLock, FcGoogle } from "../assets/icons";
import { motion } from "framer-motion";
import { buttonClick } from "../animations";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { app } from "../config/firebase.config";
import { userSignUp, userLogin, userGoogleLogin } from "../api";
import { setUserDetails } from "../context/actions/userActions";
import { alertInfo, alertWarning } from "../context/actions/alertAction";

const Login = () => {
  const [userEmail, setUserEmail] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirm_password] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const loginWithGoogle = async () => {
    try {
      const userCred = await signInWithPopup(firebaseAuth, provider);
      if (userCred && userCred.user) {
        const res = await userGoogleLogin({
          email: userCred.user.email,
          name: userCred.user.displayName,
          picture: userCred.user.photoURL,
        });
        if (res && res.success && res.token) {
          localStorage.setItem("token", res.token);
          dispatch(setUserDetails(res.data));
          navigate("/", { replace: true });
        } else {
          dispatch(alertWarning(res?.msg || "Google login failed"));
        }
      }
    } catch (err) {
      dispatch(alertWarning(err?.message || "Google Sign-In failed"));
    }
  };

  const signUpWithEmailPass = async () => {
    if (userEmail === "" || password === "" || confirm_password === "") {
      dispatch(alertInfo("Required fields should not be empty"));
      return;
    }
    if (password !== confirm_password) {
      dispatch(alertWarning("Passwords don't match"));
      return;
    }

    const res = await userSignUp({ email: userEmail, password });
    if (res && res.success && res.token) {
      localStorage.setItem("token", res.token);
      dispatch(setUserDetails(res.data));
      setUserEmail("");
      setPassword("");
      setConfirm_password("");
      navigate("/", { replace: true });
    } else {
      dispatch(alertWarning(res?.msg || "Signup failed"));
    }
  };

  const signInWithEmailPass = async () => {
    if (userEmail === "" || password === "") {
      dispatch(alertInfo("Please enter email and password"));
      return;
    }

    const res = await userLogin({ email: userEmail, password });
    if (res && res.success && res.token) {
      localStorage.setItem("token", res.token);
      dispatch(setUserDetails(res.data));
      setUserEmail("");
      setPassword("");
      navigate("/", { replace: true });
    } else {
      dispatch(alertWarning(res?.msg || "Invalid credentials"));
    }
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden flex">
      <img
        src={LoginBg}
        className="w-full object-cover absolute top-0 left-0"
        alt=""
      />

      {/* Content box */}
      <div className="flex flex-col items-center bg-lightOverlay w-[80%] md:w-508 h-full z-10 backdrop-blur-md p-4 px-4 py-12 gap-6">
        {/* Top logo section */}
        <div className="flex items-center justify-start gap-4 w-full">
          <img src={Logo} className="w-8" alt="" />
          <p className="text-headingColor font-semibold text-2xl">City</p>
        </div>

        {/* Welcome text */}
        <p className="text-3xl font-semibold text-headingColor">Welcome Back</p>
        <p className="text-xl text-textColor -mt-6">
          {isSignUp ? "Sign Up" : "Sign In"} with following
        </p>

        {/* Input section */}
        <div className="w-full flex flex-col items-center gap-6 px-4 md:px-12 py-4">
          <LoginInput
            placeHolder={"Email Here"}
            icon={<FaEnvelope className="text-xl text-textColor" />}
            inputState={userEmail}
            inputStateFunc={setUserEmail}
            type="email"
            isSignUp={isSignUp}
          />

          <LoginInput
            placeHolder={"Password Here"}
            icon={<FaLock className="text-xl text-textColor" />}
            inputState={password}
            inputStateFunc={setPassword}
            type="password"
            isSignUp={isSignUp}
          />

          {isSignUp && (
            <LoginInput
              placeHolder={"Confirm Password Here"}
              icon={<FaLock className="text-xl text-textColor" />}
              inputState={confirm_password}
              inputStateFunc={setConfirm_password}
              type="password"
              isSignUp={isSignUp}
            />
          )}

          {!isSignUp ? (
            <p>
              Doesn't have an account:{" "}
              <motion.button
                {...buttonClick}
                className="text-red-400 underline cursor-pointer bg-transparent"
                onClick={() => setIsSignUp(true)}
              >
                Create one
              </motion.button>
            </p>
          ) : (
            <p>
              Already have an account:{" "}
              <motion.button
                {...buttonClick}
                className="text-red-400 underline cursor-pointer bg-transparent"
                onClick={() => setIsSignUp(false)}
              >
                Sign-in here
              </motion.button>
            </p>
          )}

          {/* Button section */}
          {isSignUp ? (
            <motion.button
              {...buttonClick}
              className="w-full px-4 py-2 rounded-md bg-red-400 cursor-pointer text-white text-xl capitalize hover:bg-red-500 transition-all duration-150"
              onClick={signUpWithEmailPass}
            >
              Sign Up
            </motion.button>
          ) : (
            <motion.button
              {...buttonClick}
              className="w-full px-4 py-2 rounded-md bg-red-400 cursor-pointer text-white text-xl capitalize hover:bg-red-500 transition-all duration-150"
              onClick={signInWithEmailPass}
            >
              Sign in
            </motion.button>
          )}
        </div>

        <div className="flex items-center justify-between gap-16">
          <div className="w-24 h-[1px] rounded-md bg-white"></div>
          <p className="text-white">or</p>
          <div className="w-24 h-[1px] rounded-md bg-white"></div>
        </div>

        <motion.div
          {...buttonClick}
          className="flex items-center justify-center px-20 py-2 bg-lightOverlay backdrop-blur-md cursor-pointer rounded-3xl gap-4"
          onClick={loginWithGoogle}
        >
          <FcGoogle className="text-3xl" />
          <p className="capitalize text-base text-headingColor">
            Signin with Google
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
