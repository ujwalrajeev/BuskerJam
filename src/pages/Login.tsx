import "./Login.scss";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import DefaultInput from "../components/DefaultInput";
import DefaultButton from "../components/DefaultButton";
import DefaultDropdown from "../components/DefaultDropdown";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [signedIn, setSignedIn] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(true);
  const [selectedInstrument, setSelectedInstrument] =
    useState<string>("Select Instrument");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
      setSignedIn(true);
      localStorage.setItem("buskerEmail", email);
      getBusker(email);
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "buskerData", email), {
        fullName,
        totalScore: 0,
      });

      setIsRegistered(true);
      setSignedIn(true);
      setError("");
      console.log(email);
      localStorage.setItem("buskerEmail", email);
      getBusker(email);
    } catch (error) {
      setError("Something went wrong! please try again");
    }
  };

  const handleRouting = () => {
    if (selectedInstrument === "Select Instrument") {
      setError("Please select an instrument");
      return;
    }
    window.location.href = "/home";
  };

  const getBusker = async (email: string) => {
    const ref = doc(db, "buskerData", email);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      localStorage.setItem("buskerData", JSON.stringify(snap.data()));
    } else {
      return null;
    }
  };

  return (
    <div className="login-container">
      <div className="login-title">
        <img
          src="./icons/busking.png"
          alt="BuskerJam Logo"
          className="login-title-icon"
        />
        <h1>BuskerJam</h1>
      </div>
      <p>Share your music with the world</p>

      {!signedIn && isRegistered && (
        <div className="auth-container">
          <DefaultInput
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
          />
          <DefaultInput
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          <DefaultButton text="Login" onClick={handleLogin} />
          {error !== "" && <p className="error-message">{error}</p>}
          <div className="item-column-container">
            <p>Not registered yet?</p>
            <DefaultButton
              text="Register"
              onClick={() => setIsRegistered(false)}
            />
          </div>
        </div>
      )}

      {!isRegistered && (
        <div className="auth-container">
          <div className="item-column-container">
            <DefaultInput
              placeholder="Enter your full name"
              type="text"
              value={fullName === "" ? "" : fullName}
              className="bordered-input"
              onChange={(e) => {
                setFullName(e.target.value);
              }}
            />
            <DefaultInput
              placeholder="Enter your email"
              type="text"
              value={email === "" ? "" : email}
              className="bordered-input"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <DefaultInput
              placeholder="Enter your password"
              type="password"
              value={password === "" ? "" : password}
              className="bordered-input"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <DefaultButton
              text="Register"
              onClick={() => signUp(email, password, fullName)}
            />
            {error !== "" && <p className="error-message">{error}</p>}
          </div>
          <div className="item-row-container">
            <p>Have an account?</p>
            <DefaultButton text="Login" onClick={() => setIsRegistered(true)} />
          </div>
        </div>
      )}
      {signedIn && (
        <div className="auth-container">
          <p>You are signed in!</p>
          <DefaultDropdown
            options={[
              "Select Instrument",
              "Guitar",
              "Piano",
              "Drums",
              "Violin",
              "Flute",
              "Cello",
            ]}
            value={selectedInstrument}
            onChange={(value) => setSelectedInstrument(value)}
          />
          <DefaultButton text="Start" onClick={handleRouting} />
          {error && <p className="error-message">{error}</p>}
        </div>
      )}
    </div>
  );
}
