import { useState } from "react";
import "./App.css";
export default App;

const gameUtils = {
  createGameArray: () => {
    const gameArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "Z", "X", "Y", "W"];
    return gameArray;
  },

  createRandomizedState: (gameArray) => {
    const copyArray = [...gameArray];
    let resultArray = [];

    while (copyArray.length > 0) {
      const positionCut = randomInt(0, copyArray.length - 1);
      resultArray.push(copyArray.splice(positionCut, 1)[0]);
    }

    return resultArray;
  },

  createGrid: (array, rowMaxItems) => {
    let resultGrid = [];
    let rowGrid = [];
    let currentRowItems = 0;

    for (let k = 1; k <= array.length; k++) {
      if (currentRowItems < rowMaxItems) {
        rowGrid.push(array[k - 1]);
        currentRowItems++;
      } else {
        resultGrid.push(rowGrid);

        rowGrid = [];
        currentRowItems = 0;
        rowGrid.push(array[k - 1]);
        currentRowItems++;
      }
    }

    resultGrid.push(rowGrid);
    return resultGrid;
  },


};

function fakeClick(letter) {
  // Check if this is a score or reset
  // If this is a score: Add one to score counter, add the clicked item to the "already clicked element" reshuffle
  // If this is
}

function App() {

  const [clickedItems, setclickedItems] = useState([]);
  const [score, setScore] = useState(0);
  const [highscore, setHighscore] = useState(0);
  const [tileNumber, setTileNumber] = useState(5);

  const [gameArray, setGameArray] = useState(gameUtils.createGameArray());
  const [randGameArray, setRandGameArray] = useState(
    gameUtils.createRandomizedState(gameArray)
  );
  const [currentGrid, setCurrentGrid] = useState(
    gameUtils.createGrid(randGameArray, tileNumber)
  );



  function resetGame() {
    setScore(0);
    setclickedItems([]);  
  }

  function handleClick(letter) {
    if (!clickedItems.includes(letter)) {
      //points
      setScore(score + 1);
      setclickedItems([...clickedItems, letter]);

      if (score >= highscore) setHighscore(score+1);

    } else {
      //reset
      resetGame();
    }

    setRandGameArray(gameUtils.createRandomizedState(gameArray));
    setCurrentGrid(gameUtils.createGrid(randGameArray, tileNumber));
  }

  function buildGridElements(array) {
    return array.map((row, rowIndex) => {
      return (
        <div className="grid-row" key={"row-" + rowIndex}>
          {row.map((item, itemIndex) => {
            return (
              <div
                className="grid-item"
                key={rowIndex + "x" + itemIndex}
                onClick={(e) => handleClick(e.target.textContent)}
              >
                {item}
              </div>
            );
          })}
        </div>
      );
    });
  }

  return (
    <>
      <div id="scoreboard">
        <div className="currentScore">Current Score: {score}</div>
        <div className="highScore">Highest Score: {highscore}</div>
      </div>

      <div id="game-setup">
        <input type = "text" id="tile-number" onChange={(e) => setTileNumber(e.target.value)} value = {tileNumber} />
        <button className="btn-reset">Reset</button>
      </div>

      <div className="grid">{buildGridElements(currentGrid)}</div>{" "}
    </>
  );
}

// Auxiliary Function

function randomInt(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
