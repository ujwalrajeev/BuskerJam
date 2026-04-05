import "./Login.scss";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import DefaultInput from "../components/DefaultInput";
import DefaultButton from "../components/DefaultButton";
import DefaultDropdown from "../components/DefaultDropdown";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [signedIn, setSignedIn] = useState<boolean>(false);
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

  const handleRouting = () => {
    if (selectedInstrument === "Select Instrument") {
      setError("Please select an instrument");
      return;
    }
    // Redirect to the appropriate page based on the selected instrument
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
      {!signedIn && (
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
          {error && <p className="error-message">{error}</p>}
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
