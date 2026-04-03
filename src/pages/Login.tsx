import "./Login.scss";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import DefaultInput from "../components/DefaultInput";
import DefaultButton from "../components/DefaultButton";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to home page or dashboard after successful login
      window.location.href = "/home";
      setError("");
    } catch (error) {
      setError("Invalid email or password");
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
    </div>
  );
}
