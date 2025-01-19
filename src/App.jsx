import { useState, useEffect } from "react";
import "./App.css";
export default App;

const gameUtils = {

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

const externalSources = {
  getRandomPokemon: async () => {
    const apiURL = `https://pokeapi.co/api/v2/pokemon/${randomInt(1, 300)}/`;
    const response = await fetch(apiURL);
    const jsonResponse = await response.json();

    return {
      id: jsonResponse.id,
      sprite: jsonResponse.sprites.front_default,
    };
  },

  getPokemonList: (n) => {
    const pokemonList = [];
    for (let i = 1; i <= n; i++) {
      pokemonList.push(externalSources.getRandomPokemon());
    }

    return pokemonList;
  },
};

function App() {
  console.log("rendering");

  const [clickedItems, setclickedItems] = useState([]);
  const [score, setScore] = useState(0);
  const [highscore, setHighscore] = useState(0);
  const [tileNumber, setTileNumber] = useState(5);  
  const [totalTiles, setTotalTiles] = useState(5);
  const [totalTilesSubmited, setTotalTilesSubmited] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const [gameArray, setGameArray] = useState([]);
  const [pokemonList, setPokemonList] = useState([]);
  const [randGameArray, setRandGameArray] = useState([]);
  const [currentGrid, setCurrentGrid] = useState([]);

  console.log("States after render:", {
    // Game progress states
    clickedItems: clickedItems,
    clickedItemsLength: clickedItems.length,
    score: score,
    highscore: highscore,

    // Configuration states
    tileNumber: tileNumber,
    totalTiles: totalTiles,

    // Loading state
    isLoading: isLoading,

    // Game data states
    pokemonList: pokemonList,
    pokemonListLength: pokemonList.length,
    gameArray: gameArray,
    gameArrayLength: gameArray.length,
    randGameArray: randGameArray,
    randGameArrayLength: randGameArray.length,
    currentGrid: currentGrid,
    currentGridLength: currentGrid.length,
  });

  // FUNCTIONS

  function softResetGame() {
    setScore(0);
    setclickedItems([]);
  }

  function resetGame() {


    setScore(0);
    setclickedItems([]);
    setTotalTilesSubmited(totalTiles)
    setTileNumber(Math.floor(Math.sqrt(totalTiles)))
  }

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const fetchPokemon = async () => {
      try {
        const pokemonPromisses = externalSources.getPokemonList(totalTilesSubmited);
        const result = await Promise.all(pokemonPromisses);

        if (isMounted) {
          setPokemonList(result);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to get Pokes: ", error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPokemon();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [totalTilesSubmited]);

  //THIS WILL take the recent pokemon list and build the gameArray with it
  useEffect(() => {
    if (pokemonList.length > 0) {
      const randomStateArray = gameUtils.createRandomizedState(pokemonList);
      const gridArray = gameUtils.createGrid(randomStateArray, tileNumber);

      setGameArray(pokemonList);
      setRandGameArray(randomStateArray);
      setCurrentGrid(gridArray);
    }
  }, [pokemonList]);

  function handleClick(letter) {
    if (!clickedItems.includes(letter)) {
      //points
      setScore(score + 1);
      setclickedItems([...clickedItems, letter]);

      if (score >= highscore) setHighscore(score + 1);
    } else {
      //reset
      softResetGame();
    }

    setRandGameArray(gameUtils.createRandomizedState(gameArray));
    setCurrentGrid(gameUtils.createGrid(randGameArray, tileNumber));
  }


  //BUILD GRID

  //COMPONENTS
  const GridItem = ({ pokemon, onClickFunction }) => (
    <img
      className="grid-item"
      key={pokemon.id}
      src={pokemon.sprite}
      onClick={() => onClickFunction(pokemon.id)}
      alt={`Pokemon ${pokemon.id}`}
    />
  );

  const GridRow = ({ row, onClickFunction }) => (
    <div className="grid-row">
      {row.map((pokemon) => <GridItem pokemon={pokemon}  onClickFunction = {onClickFunction} />)}
    </div>
  );

  const GridTotal = ({currentGridArray, onClickFunction}) => (


    <div className="grid">
      {currentGridArray.map((row) => <GridRow row={row}  onClickFunction = {onClickFunction} />)}
    </div>
    
  )

  return (
    <>
      {isLoading ? (
        <div className="loading-div">Loading</div>
      ) : (
        <>
          <div id="scoreboard">
            <div className="currentScore">Current Score: {score}</div>
            <div className="highScore">Highest Score: {highscore}</div>
          </div>

          <div id="game-setup">
            <input
              type="text"
              id="tile-number"
              onChange={(e) => setTotalTiles(e.target.value)}
              value={totalTiles}
            />
            <button className="btn-reset" onClick = {resetGame}> Reset</button>
          </div>

          <GridTotal currentGridArray={currentGrid} onClickFunction = {handleClick} />

        </>
      )}
    </>
  );
}

// Auxiliary Function

function randomInt(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

