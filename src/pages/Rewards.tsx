import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./Rewards.scss";
import DefaultInput from "../components/DefaultInput";
import DefaultButton from "../components/DefaultButton";

export default function Rewards() {
  const questions = [
    { question: "What is the name of the busker?", answer: "Kongappi" },
    { question: "What is the name of his instrument?", answer: "Piano" },
    { question: "Where is he from?", answer: "Banglore" },
    {
      question: "Which is his favourite song?",
      answer: "Jumbadikkana Jumbara jumba",
    },
  ];

  const [userID, setUserID] = useState<string>("");
  const [collectedStamps, setCollectedStamps] = useState<string[]>([
    "musicLover",
  ]);

  const handleUserID = () => {};

  const getUser = async (userId: string) => {
    const docRef = doc(db, "userData", userId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      console.log(snap.data());
      return snap.data();
    } else {
      return null;
    }
  };

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

      {userID === "" && (
        <div className="item-column-container">
          <div className="item-column-container">
            <div className="item-row-container gap-x">
              <p>Collect stamps and</p>
              <p className="bold-2x">Win Rewards!</p>
            </div>
            <div className="marquee">
              <div className="track">
                <img src="./stamps/musicLover.png" />
                <img src="./stamps/musicLover.png" />
                <img src="./stamps/musicLover.png" />
                <img src="./stamps/musicLover.png" />
                <img src="./stamps/musicLover.png" />
                <img src="./stamps/musicLover.png" />
              </div>
            </div>
          </div>

          <div className="item-column-container gap-x3">
            <div className="item-row-container">
              <DefaultInput
                placeholder="Enter your userID"
                type="text"
                value={userID === "" ? "" : userID}
                className="bordered-input"
                onChange={(e) => {
                  setUserID(e.target.value);
                }}
              />
              <DefaultButton text="Go" onClick={handleUserID} />
            </div>
            <div className="item-column-container">
              <p>Not registered yet?</p>
              <DefaultButton text="Register" onClick={handleUserID} />
            </div>
          </div>
        </div>
      )}

      {userID !== "" && (
        <div className="item-column-container">
          <span className="bold-2x">Your Stamps</span>
          <div className="item-row-container">
            <img
              src="./stamps/musicLover.png"
              alt="Music Icon"
              className="stamp"
            ></img>
          </div>
        </div>
      )}
    </div>
  );
}
