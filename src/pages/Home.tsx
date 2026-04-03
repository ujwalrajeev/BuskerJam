import "./Home.scss";
import DefaultInput from "../components/DefaultInput";
import DefaultButton from "../components/DefaultButton";
import DefaultDropdown from "../components/DefaultDropdown";
import { useState } from "react";

function Home() {
  const [reactionCount, setReactionCount] = useState({
    like: 0,
    love: 0,
    clap: 0,
  });
  const [active, setActive] = useState<string>("");
  const [selectedInstrument, setSelectedInstrument] =
    useState<string>("Select Instrument");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [leaderboard, setLeaderboard] = useState<any>([
    "Kongappi",
    "Player2",
    "Player3",
  ]);

  const handleReactionClick = (type: string, newCount: any) => {
    setActive(type);
    setReactionCount(newCount);
    setTimeout(() => setActive(""), 60);
  };

  const handleStartGame = () => {
    if (selectedInstrument === "Select Instrument") {
      alert("Please select an instrument to start the game.");
      return;
    }
    setGameStarted(true);
  };

  const goFullScreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <div className="home-container">
      <div className="item-column-container">
        <div className="home-header">
          <div className="home-title">
            <img
              src="./icons/busking.png"
              alt="BuskerJam Logo"
              className="home-title-icon"
              onClick={goFullScreen}
            />
            {/*<p>Jam with</p>*/}
            <h1>BuskerJam</h1>
          </div>
        </div>

        <div className="item-column-container">
          <img
            src="./icons/podium.png"
            alt="Leaderboard Image"
            className="icon-m"
          />
          <div>
            <p>1. {leaderboard[0] || "Unknown"}</p>
            <p>2. {leaderboard[1] || "Unknown"}</p>
            <p>3. {leaderboard[2] || "Unknown"}</p>
          </div>
        </div>
      </div>

      {!gameStarted && (
        <div className="item-column-container gap-x2 left-align">
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
          <div className="item-row-container">
            <DefaultInput
              placeholder="Your name (optional)"
              type="text"
              value=""
              className="bordered-input"
              onChange={() => {}}
            />
            <DefaultButton text="Start Game" onClick={handleStartGame} />
          </div>
        </div>
      )}

      <div className="item-column-container">
        <div className="reaction-container">
          <div className="reaction-item">
            <img
              src="./icons/like.png"
              alt="Like Icon"
              className={
                "reaction-icon no-select no-drag no-highlight" +
                (active === "like" ? " active" : "")
              }
              onClick={() =>
                handleReactionClick("like", {
                  ...reactionCount,
                  like: reactionCount.like + 1,
                })
              }
            />
            <span className="reaction-count">{reactionCount.like}</span>
          </div>

          <div className="reaction-item">
            <img
              src="./icons/love.png"
              alt="Love Icon"
              className={
                "reaction-icon no-select no-drag no-highlight" +
                (active === "love" ? " active" : "")
              }
              onClick={() =>
                handleReactionClick("love", {
                  ...reactionCount,
                  love: reactionCount.love + 1,
                })
              }
            />
            <span className="reaction-count">{reactionCount.love}</span>
          </div>
          <div className="reaction-item">
            <img
              src="./icons/clap.png"
              alt="Clap Icon"
              className={
                "reaction-icon no-select no-drag no-highlight" +
                (active === "clap" ? " active" : "")
              }
              onClick={() =>
                handleReactionClick("clap", {
                  ...reactionCount,
                  clap: reactionCount.clap + 1,
                })
              }
            />
            <span className="reaction-count">{reactionCount.clap}</span>
          </div>
        </div>

        <div className="item-row-container space-between width-90">
          <div className="item-row-container">
            <img src="./icons/qr.png" alt="QR Code" className="qr-code" />
            <div className="item-column-container gap-x left-align">
              <p>Scan, support, and </p>
              <p className="bold-2x">Win Rewards!</p>
            </div>
          </div>
          <div className="item-row-container space-between">
            <div className="item-column-container gap-x left-align">
              <p>Jaming with</p>
              <p className="bold-2x">Kongappi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
