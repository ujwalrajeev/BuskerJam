import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "./Rewards.scss";
import DefaultInput from "../components/DefaultInput";
import DefaultButton from "../components/DefaultButton";

export default function Rewards() {
  const [isRegistered, setIsRegistered] = useState<boolean>(true);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [randomNumber, setRandomNumber] = useState<number>(0);
  const [currentAnswer, setCurrentAnswer] = useState<string>("");
  const [totalUserScore, setTotalUserScore] = useState<number>(0);

  const questions = [
    { question: "What is the name of the busker?", answer: "Kongappi" },
    { question: "What is the name of his instrument?", answer: "Piano" },
    { question: "Where is he from?", answer: "Banglore" },
    {
      question: "Which is his favourite song?",
      answer: "Jumbadikkana Jumbara jumba",
    },
  ];

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [uid, setUID] = useState<string | null>(localStorage.getItem("uid"));
  const [collectedStamps, setCollectedStamps] = useState<string[]>([
    "musicLover",
  ]);
  const [hasError, setHasError] = useState<boolean>(false);

  const login = async (email: string, password: string) => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      setUID(userCred.user.uid);
      localStorage.setItem("uid", userCred.user.uid);
      setIsLogged(true);
    } catch (error) {
      setHasError(true);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const uid = userCred.user.uid;

    await setDoc(doc(db, "userData", uid), {
      fullName,
      email,
      stamps: [],
      totalUserScore: 0,
    });

    setUID(uid);
    localStorage.setItem("uid", uid);
    setIsLogged(true);
  };

  const signOut = () => {
    localStorage.removeItem("uid");
    setIsLogged(false);
  };

  const getUserData = async (uid: string) => {
    const ref = doc(db, "userData", uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      setTotalUserScore(snap.data().totalUserScore);
      setFullName(snap.data().fullName);
      setCollectedStamps(snap.data().stamps);
    }

    return null;
  };

  const compareAnswer = () => {
    if (questions[randomNumber].answer === currentAnswer) {
      setTotalUserScore((score) => score + 1);
    }
  };

  const updateTotalUserScore = async () => {
    const ref = doc(db, "userData", email);

    await updateDoc(ref, {
      totalUserScore: totalUserScore,
    });
  };

  useEffect(() => {
    if (uid !== null) {
      getUserData(uid);
      setIsLogged(true);
    }
    setRandomNumber(Math.floor(Math.random() * questions.length));
  }, []);

  useEffect(() => {
    //updateTotalUserScore();
  }, [totalUserScore]);

  return (
    <div className="rewards-container">
      <div className="item-row-container width-100p margin-top10 gap-x">
        <div className="item-row-container gap-xs">
          <img
            src="./icons/busking.png"
            alt="Music Icon"
            className="title-icon"
          />
          <p className="title">BuskerJam</p>
        </div>

        <h1 className="rewards-title">Rewards</h1>
      </div>

      {isLogged && (
        <div className="item-column-container">
          <p className="welcome-text">{"Welcome " + fullName}</p>
          <p className="bold-2x">{"Total Score " + totalUserScore}</p>
        </div>
      )}

      {!isLogged && (
        <div className="item-column-container gap-x4">
          <div className="item-column-container">
            <div className="item-row-container gap-x">
              <p>Collect stamps and</p>
              <p className="bold-2x">Win Rewards!</p>
            </div>
            <div className="marquee">
              <div className="track">
                <img src="./stamps/musicLover.png" />
                <img src="./stamps/drummerKing.png" />
                <img src="./stamps/theDJ.png" />
                <img src="./stamps/musicLover.png" />
                <img src="./stamps/beethoven.png" />
                <img src="./stamps/musicLover.png" />
              </div>
            </div>
          </div>

          {isRegistered && (
            <div className="item-column-container">
              <div className="item-column-container">
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
                  text="Login"
                  onClick={() => login(email, password)}
                />
                {hasError && <p>Something went wrong! Please try again</p>}
              </div>
              <div className="item-row-container">
                <p>Not registered yet?</p>
                <DefaultButton
                  text="Register"
                  onClick={() => setIsRegistered(false)}
                />
              </div>
            </div>
          )}

          {!isRegistered && (
            <div className="item-column-container">
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
              </div>
              <div className="item-row-container">
                <p>Have an account?</p>
                <DefaultButton
                  text="Login"
                  onClick={() => setIsRegistered(true)}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {isLogged && (
        <div className="item-column-container">
          <span className="bold-2x">Your Stamps</span>
          <div className="item-row-container">
            <div className="marquee">
              <div
                className={
                  collectedStamps.length > 4 ? "track" : "track track-nomove"
                }
              >
                {collectedStamps.map((stamp) => (
                  <img key={stamp} src={`./stamps/${stamp}.png`} alt={stamp} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {isLogged && (
        <div className="item-column-container question-container">
          <p className="bold-2x">
            Earn score and stamps by answering the question
          </p>
          <p>{questions[randomNumber]?.question}</p>
          <DefaultInput
            placeholder="Enter yor answer here"
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            type="text"
            className="bordered-input"
          />
          <DefaultButton text="Submit" onClick={compareAnswer} />
        </div>
      )}

      {isLogged && (
        <div className="item-column-container">
          <DefaultButton text="Sign out" onClick={signOut} />
        </div>
      )}
    </div>
  );
}
