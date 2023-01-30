import { useState, useEffect } from "react";

// types
type Drop = "blue" | "teal" | "yellow" | "red" | "indigo";
type Bottle = Drop[];
// colors array
const colors: Drop[] = ["blue", "teal", "yellow", "red", "indigo"];

// React component
function Puzzle() {
  // state
  const [firstLaunched, setFirstLaunched] = useState(true); // first launch
  const [numBottles, setNumBottles] = useState<number>(4); // number of bottles
  const [numColors, setNumColors] = useState<number>(5); // number of volors
  const [bottles, setBottles] = useState<Bottle[] | []>([]); // array fo bottles
  const [selectedBottle, setSelectedBottle] = useState<number | undefined>(
    undefined
  ); // selected bottle idx
  // new game button click
  function newGame() {
    // not first launch: confirm new game
    if (
      firstLaunched == false &&
      confirm("Are you sure you want to leave current game?") == true
    ) {
      initNewGame();
      setFirstLaunched(false);
    }
  }
  // init new game
  function initNewGame() {
    setBottles([]);
    let bottles: Bottle[] = [];
    // create a new bottle
    for (let i: number = 0; i < numBottles; i++) {
      let bottle: Bottle = [];
      // random non reptead color
      for (let k: number = 0; bottle.length < numColors; k++) {
        let colorsCopy = [...colors];
        let j = Math.floor(Math.random() * colorsCopy.length);
        let color: Drop = colors[j];
        if (!bottle.includes(color)) {
          bottle.push(color);
        }
        colorsCopy.splice(k, 1);
      }
      // insert bottle
      bottles.push(bottle);
    }
    // add two empty bottles
    bottles.push([]);
    bottles.push([]);
    setSelectedBottle(undefined);
    setBottles(bottles);
  }
  // handle bottle click
  function handleSelectBottle(idx: any): any {
    // no bottle selected or selected is different from clicked bottle
    if (selectedBottle === undefined) {
      setSelectedBottle(idx);
    } else if (selectedBottle === idx) {
      // already selected = unselect it
      setSelectedBottle(undefined);
    }
    // move from selected bottle to targer bottle
    if (selectedBottle !== undefined) {
      const newBottles = [...bottles];
      const targetBottle = newBottles[idx];
      const fromBottle = newBottles[selectedBottle];
      // only add if bottle is not full and target color is same as selected color or target is empty
      if (
        targetBottle.length < numColors &&
        (fromBottle[fromBottle.length - 1] ==
          targetBottle[targetBottle.length - 1] ||
          targetBottle.length == 0)
      ) {
        const popedDrop = fromBottle.pop();
        if (popedDrop) {
          targetBottle.push(popedDrop);
          setSelectedBottle(undefined);
        }
      } else {
        setSelectedBottle(undefined);
      }
      setBottles(newBottles);
    }
  }
  // full bottle status
  function isBottleCompleted(idx: number): boolean {
    const bottle = bottles[idx];
    let isComplete =
      bottle.every((val, i, arr) => val == arr[0]) &&
      bottle.length == numBottles;
    return isComplete;
  }
  // new game on mounted
  useEffect(() => {
    if (firstLaunched) {
      initNewGame();
      setFirstLaunched(false);
      console.log("use effect triggered");
    }
    // clean up
    return () => {};
  });
  return (
    <div className="app-wrapper">
      <h1>Sort colors</h1>
      <div className="bottles-container">
        {bottles.map((bottle, ind) => (
          <div
            className={`bottle hoverable ${
              selectedBottle === ind &&
              bottles[ind].length &&
              !isBottleCompleted(ind) &&
              "selected"
            } ${isBottleCompleted(ind) && "completed"}`}
            key={ind}
            onClick={() => handleSelectBottle(ind)}
          >
            {bottle &&
              bottle.map((drop, did) => (
                <div key={did} className={`drop ${drop && drop}`}></div>
              ))}
          </div>
        ))}
      </div>
      <div className="actions">
        <button onClick={newGame}>New game</button>
      </div>
    </div>
  );
}

export default Puzzle;
