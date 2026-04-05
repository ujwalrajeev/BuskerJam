import "./Home.scss";
import DefaultInput from "../components/DefaultInput";
import DefaultButton from "../components/DefaultButton";
import DefaultDropdown from "../components/DefaultDropdown";
import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { Progress } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import PianoGame from "../components/PianoGame";
import { updateDoc, doc, increment } from "firebase/firestore";
import { db } from "../firebase";

function Home() {
  const [reactionCount, setReactionCount] = useState({
    like: 0,
    love: 0,
    clap: 0,
  });
  const [active, setActive] = useState<string>("");
  const { width, height } = useWindowSize();
  const [runCofetti, setRunConfetti] = useState<boolean>(false);

  const [currentPlayer, setCurrentPlayer] = useState<string>("player");
  const [selectedInstrument, setSelectedInstrument] =
    useState<string>("Select Instrument");
  const [leaderboard, setLeaderboard] = useState([
    { name: "Player 1", score: 0 },
    { name: "Player 2", score: 0 },
    { name: "Player 3", score: 0 },
  ]);
  const buskerEmail = localStorage.getItem("buskerEmail");
  const buskerData = JSON.parse(localStorage.getItem("buskerData") || "{}");
  const [totalScore, setTotalScore] = useState<number>(
    parseInt(buskerData.totalScore) || 0,
  );
  const [percentage, setPercentage] = useState<number>(0);

  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [activeTile, setActivetile] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(800);
  const [timeLeft, setTimeLeft] = useState(60);

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
    if (currentPlayer === "player") {
      const name = "Player " + String(Math.floor(Math.random()));
      setCurrentPlayer(name);
    }
    setRunConfetti(false);
    setGameStarted(true);
  };

  const goFullScreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  const handleClick = (index: number) => {
    if (index === activeTile) {
      setScore((s) => s + 1);
    }
  };

  const handleProgressBar = () => {
    var calcPercentage = (score / 15) * 100;
    setPercentage(calcPercentage);
    if (score >= 15) {
      setRunConfetti(false);
      setTimeout(() => {
        setRunConfetti(true);
      }, 0);

      setTotalScore((prev) => prev + 1);
      setPercentage(0);
      setScore(0);
    }
  };

  const updateTotalScore = async (email: string, value: number) => {
    const ref = doc(db, "buskerData", email);

    await updateDoc(ref, {
      totalScore: value,
    });
  };

  const exitGame = () => {
    setGameStarted(false);
    setTimeLeft(60);
    setScore(0);
    setSpeed(800);
  };

  useEffect(() => {
    if (gameStarted) {
      const interval = setInterval(() => {
        const rand = Math.floor(Math.random() * 9);
        setActivetile(rand);
      }, speed);
      return () => clearInterval(interval);
    }
  }, [gameStarted, speed]);

  useEffect(() => {
    if (!gameStarted) return;

    if (selectedInstrument === "Drums") {
      const timer = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            exitGame();
            return 0;
          }
          setSpeed((s) => Math.max(300, s - 20));
          return t - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameStarted, selectedInstrument]);

  useEffect(() => {
    handleProgressBar();
    setLeaderboard((prev) => {
      let updated = [...prev];

      const index = updated.findIndex((p) => p.name === currentPlayer);

      if (index !== -1) {
        updated[index].score = score;
      } else {
        updated.push({ name: currentPlayer, score });
      }
      updated.sort((a, b) => b.score - a.score);

      return updated.slice(0, 3);
    });
  }, [score]);

  useEffect(() => {
    if (buskerEmail) {
      updateTotalScore(buskerEmail, totalScore);
      const updatedData = { ...buskerData, totalScore: totalScore };
      localStorage.setItem("buskerData", JSON.stringify(updatedData));
    }
  }, [totalScore]);

  return (
    <div className="home-container">
      <Confetti
        width={width}
        height={height}
        numberOfPieces={300}
        recycle={false}
        initialVelocityX={-10}
        initialVelocityY={0}
        run={runCofetti}
        confettiSource={{
          x: width - 20,
          y: 50,
          w: 0,
          h: 0,
        }}
      />
      <div className="progress-bar">
        <Progress.Line
          percent={percentage}
          vertical={true}
          showInfo={false}
          status="active"
          radius={1}
          strokeColor="red"
          strokeWidth={25}
          trailColor="white"
        />
      </div>
      <div className="item-column-contaier center-align width-100p">
        {/* <h1 className="title margin-bottom10">BuskerJam</h1> */}
        <div className="item-row-container space-between width-100p padding-right20 padding-left20">
          <div className="item-row-container gap-xs">
            <img
              src="./icons/busking.png"
              alt="Music Icon"
              className="title-icon"
              onClick={goFullScreen}
            />
            <h1 className="title">BuskerJam</h1>
          </div>

          <span className="item-row-container">
            <p>Busker Score :</p>
            <p className="bold-2x">{totalScore}</p>
          </span>
        </div>

        {/* <div className="item-row-container width-100p space-around">
          <div className="item-row-container gap-x2">
            <img
              src="./icons/podium.png"
              alt="Leaderboard Image"
              className="icon-m"
            />
            <div className="item-column-container left-align gap-x margin-top10">
              <p className="leaderboard-1st">
                {"1. " +
                  (leaderboard[0].name || "Unknown") +
                  " - " +
                  leaderboard[0].score}
              </p>
              <p className="leaderboard-2nd">
                {"2. " +
                  (leaderboard[1].name || "Unknown") +
                  " - " +
                  leaderboard[1].score}
              </p>
              <p className="leaderboard-3rd">
                {"3. " +
                  (leaderboard[2].name || "Unknown") +
                  " - " +
                  leaderboard[2].score}
              </p>
            </div>
          </div>
        </div> */}
      </div>

      {!gameStarted && (
        <div className="item-column-container gap-x2 left-align">
          <span className="item-row-container gap-x">
            <p>Jam with</p>
            <p className="bold-2x">{buskerData.fullName}</p>
          </span>
          <DefaultDropdown
            options={["Select Instrument", "Piano", "Drums"]}
            value={selectedInstrument}
            onChange={(value) => setSelectedInstrument(value)}
          />
          <div className="item-row-container">
            {/* <DefaultInput
              placeholder="Your name (optional)"
              type="text"
              value={currentPlayer === "player" ? "" : currentPlayer}
              className="bordered-input"
              onChange={(e) => {
                setCurrentPlayer(e.target.value);
              }}
            /> */}
            <DefaultButton text="Start Jaming" onClick={handleStartGame} />
          </div>
        </div>
      )}

      {gameStarted && selectedInstrument === "Drums" && (
        <div className="game">
          <div className="grid">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={`block ${i === activeTile ? "active" : ""}`}
                onClick={() => handleClick(i)}
              />
            ))}
          </div>
          <div className="item-row-container gap-x4">
            <div className="score">Score: {score}</div>
            <div className="score">Time left: {timeLeft}</div>
          </div>
        </div>
      )}

      {gameStarted && selectedInstrument === "Piano" && (
        <PianoGame gameStarted={gameStarted} setScore={setScore} />
      )}

      <div className="item-column-container">
        {!gameStarted && (
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
        )}
        {gameStarted && <DefaultButton text="Exit" onClick={exitGame} />}
        <div className="item-row-container">
          <div className="item-row-container">
            <img src="./icons/qr.png" alt="QR Code" className="qr-code" />
            <div className="item-column-container gap-x left-align">
              <p>Scan, support, collect stamps </p>
              <span className="item-row-container gap-x">
                <p>and</p>
                <p className="bold-2x">Win Rewards!</p>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
