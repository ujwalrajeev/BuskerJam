import "./Home.scss";
import DefaultInput from "../components/DefaultInput";

function Home() {
  const goFullScreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <div className="home-title">
          <img
            src="./icons/busking.png"
            alt="BuskerJam Logo"
            className="home-title-icon"
          />
          <p>Jam with</p>
          <h1>Kongappi</h1>
        </div>
      </div>
      <DefaultInput
        placeholder="Enter your name"
        type="text"
        value=""
        className="bordered-input"
        onChange={() => {}}
      />
      <div className="reaction-container">
        <img src="./icons/like.png" alt="Like Icon" className="reaction-icon" />
        <img src="./icons/love.png" alt="Love Icon" className="reaction-icon" />
        <img src="./icons/clap.png" alt="Clap Icon" className="reaction-icon" onClick={goFullScreen}/>
      </div>
    </div>
  );
}

export default Home;
