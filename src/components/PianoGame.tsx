import "./PianoGame.scss";
import { useEffect, useState } from "react";

type Tile = {
  id: number;
  col: number;
  y: number;
};

type Props = {
  gameStarted: boolean;
  setScore: React.Dispatch<React.SetStateAction<number>>;
};

export default function PianoGame({ gameStarted, setScore }: Props) {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [isMissed, setIsMissed] = useState<boolean>(false);

  const TILE_HEIGHT = 100;
  const GAME_HEIGHT = 600;
  const MOVE_SPEED = 10;
  const SPAWN_RATE = 800;
  const HIT_ZONE = 200;
  const MISS_ZONE = 550;

  // Click tile
  const handleClick = (id: number) => {
    const tile = tiles.find((t) => t.id === id);
    if (!tile) return;

    if (tile.y >= HIT_ZONE && tile.y <= MISS_ZONE) {
      // valid hit
      setTiles((prev) => prev.filter((t) => t.id !== id));
      setScore((s) => s + 1);
    } else {
      // bad click (optional penalty)
      //setScore((s) => Math.max(0, s - 1));
    }
  };

  // Movement loop
  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      setTiles((prev) => {
        let updatedTiles = prev.map((tile) => ({
          ...tile,
          y: tile.y + 10,
        }));

        // Detect missed tiles
        const remainingTiles: typeof updatedTiles = [];

        updatedTiles.forEach((tile) => {
          if (tile.y > MISS_ZONE) {
            // Missed tile
            //setScore((s) => Math.max(0, s - 1)); // reduce score safely
            setIsMissed(true);
            setTimeout(() => {
              setIsMissed(false);
            }, 1000);
          } else {
            remainingTiles.push(tile);
          }
        });

        return remainingTiles;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [gameStarted]);

  // Spawn loop
  useEffect(() => {
    if (!gameStarted) return;

    const spawn = setInterval(() => {
      setTiles((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(), // safer ID
          col: Math.floor(Math.random() * 4),
          y: 0,
        },
      ]);
    }, SPAWN_RATE);

    return () => clearInterval(spawn);
  }, [gameStarted]);

  // Remove offscreen tiles
  useEffect(() => {
    setTiles((prev) => prev.filter((tile) => tile.y < GAME_HEIGHT));
  }, [tiles]);

  return (
    <div className="piano-game">
      <div className="columns">
        {[...Array(4)].map((_, colIndex) => (
          <div key={colIndex} className="column">
            {tiles
              .filter((t) => t.col === colIndex)
              .map((tile) => (
                <div
                  key={tile.id}
                  className="tile"
                  style={{ top: tile.y }}
                  onClick={() => handleClick(tile.id)}
                />
              ))}
          </div>
        ))}
      </div>
      {isMissed && (
        <div className="missed-tile">
          <p>MISS</p>
        </div>
      )}
    </div>
  );
}
