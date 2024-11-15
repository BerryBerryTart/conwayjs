import React, { useState, useRef, useEffect } from "react";
import Cell from "./Cell";
import { throttle } from "lodash";
import { PatternList } from "./Patterns";

export interface CellCoordsData {
  row: number;
  col: number;
}

interface CellCheckType {
  coords: CellCoordsData;
  status: string;
}

const Canvas = () => {
  const [width, setWidth] = useState<number>(20);
  const [height, setHeight] = useState<number>(20);
  const [widthWindow, setWidthWindow] = useState<number>(window.innerWidth);
  const [heightWindow, setHeightWindow] = useState<number>(window.innerHeight);
  const [aliveCells, setAliveCells] = useState<CellCoordsData[]>([]);
  const [placementCells, setPlacementCells] = useState<CellCoordsData[]>([]);
  const [step, setStep] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(100);
  const [editing, setEditing] = useState<boolean>(false);
  const [pattern, setPattern] = useState<string | undefined>(undefined);

  const incrementor = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const editRef = useRef<CellCoordsData | undefined>(undefined);

  const updateWindowHeight = () => {
    const newHeight = window.innerHeight;
    setHeightWindow(newHeight);

    clearTimeout(incrementor.current);
    incrementor.current = undefined;
    setRunning(false);
  };

  const updateWindowWidth = () => {
    const newWidth = window.innerWidth;
    setWidthWindow(newWidth);

    clearTimeout(incrementor.current);
    incrementor.current = undefined;
    setRunning(false);
  };

  const escapeListener = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      let n = false;
      setEditing(n);
      setRunning(n);
    }
  };

  useEffect(() => {
    const h = throttle(updateWindowHeight, 100);
    const w = throttle(updateWindowWidth, 100);
    const e = throttle(escapeListener, 150);

    window.addEventListener("resize", h);
    window.addEventListener("resize", w);
    window.addEventListener("keydown", e);

    return function cleanUp() {
      clearTimeout(incrementor.current);
      window.removeEventListener("resize", h);
      window.removeEventListener("resize", w);
      window.removeEventListener("keydown", e);
    };
  }, []);

  useEffect(() => {
    // 10px + 50px on each side height
    // each cell is 20px high
    const newHeight = Math.floor((heightWindow - 60) / 20);
    setHeight(newHeight);
  }, [heightWindow]);

  useEffect(() => {
    // 10px + 10px on each side width
    // each cell is 20px wide
    const newWidth = Math.floor((widthWindow - 20) / 20);
    setWidth(newWidth);
  }, [widthWindow]);

  useEffect(() => {
    if (running) {
      incrementor.current = setTimeout(() => {
        cellLifeCheck();
      }, speed);
    }
  }, [running, aliveCells]);

  useEffect(() => {
    if (!editing) {
      setPlacementCells([]);
      editRef.current = undefined;
    }
  }, [editing]);

  useEffect(() => {
    if (editRef.current) placePattern(editRef.current);
  }, [pattern]);

  function handleCellClick(data: CellCoordsData) {
    if (running) return;
    if (editing) {
      const arr = placePattern(data);
      if (arr) setAliveCells(arr);
      return;
    }
    const clonedAlive = structuredClone(aliveCells);
    const isAlreadyAlive = clonedAlive.find(
      (el) => el.col === data.col && el.row === data.row
    );

    if (!isAlreadyAlive) {
      clonedAlive.push({ col: data.col, row: data.row });
    } else {
      const index = clonedAlive.indexOf(isAlreadyAlive);
      clonedAlive.splice(index, 1);
    }
    setAliveCells(clonedAlive);
  }

  const handleCellHover = (data: CellCoordsData) => {
    if (!editing) return;
    placePattern(data);
    editRef.current = data;
  };

  const handleCanvasKeyEvent = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const key = event.key;
    if (key === "r") handlePatternRotate();
  };

  const handlePatternRotate = () => {
    if (!editing || !pattern) return;
    const patternSplitArr = pattern.split("|").filter((el) => !!el);
    const lengths = patternSplitArr.map((a) => a.length);
    const longestRow = Math.max(...lengths);

    //backfill and normalise due to compression
    const patternClone = structuredClone(patternSplitArr);
    for (let i = 0; i < patternClone.length; i++) {
      if (patternClone[i].length < longestRow) {
        patternClone[i] = patternClone[i].padEnd(longestRow, ".");
      }
    }

    //rotato matrix
    const rotatedArr: string[] = [];
    for (let colIndex = longestRow - 1; colIndex >= 0; colIndex--) {
      const buff: string[] = [];
      for (let rowIndex = 0; rowIndex < patternClone.length; rowIndex++) {
        buff.push(patternClone[rowIndex][colIndex]);
      }
      const str = buff.join("");
      rotatedArr.push(str);
    }
    setPattern(rotatedArr.join("|"));
  };

  const placePattern = (data: CellCoordsData) => {
    if (!pattern) return;
    const patternStrings = pattern.split("|");
    const patternArray: string[][] = [];
    for (let rowIndex = 0; rowIndex < patternStrings.length; rowIndex++) {
      const tempArray: string[] = [];
      for (
        let columnIndex = 0;
        columnIndex < patternStrings[rowIndex].length;
        columnIndex++
      ) {
        const p = patternStrings[rowIndex][columnIndex];
        if (p === "." || p === "o") {
          tempArray.push(p);
        }
      }
      patternArray.push(tempArray);
    }
    const clonedAlive = structuredClone(aliveCells);
    const newArray = [] as CellCoordsData[];

    for (let rowIndex = 0; rowIndex < patternArray.length; rowIndex++) {
      for (
        let colIndex = 0;
        colIndex < patternArray[rowIndex].length;
        colIndex++
      ) {
        const p = patternArray[rowIndex][colIndex];
        const isAlive = aliveCells.find(
          (el) =>
            el.col === colIndex + data.col && el.row === rowIndex + data.row
        );
        if (
          p === "o" &&
          rowIndex + data.row < height &&
          colIndex + data.col < width &&
          !isAlive
        ) {
          clonedAlive.push({
            row: rowIndex + data.row,
            col: colIndex + data.col,
          });
          newArray.push({
            row: rowIndex + data.row,
            col: colIndex + data.col,
          });
        }
      }
    }
    setPlacementCells(newArray);
    return clonedAlive;
  };

  function handleReset() {
    setRunning(false);
    clearTimeout(incrementor.current);
    incrementor.current = undefined;
    setStep(0);
    setAliveCells([]);
  }

  function handleNextClick() {
    cellLifeCheck();
  }

  function handleStopTime() {
    clearTimeout(incrementor.current);
    incrementor.current = undefined;
    setRunning(false);
  }

  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const e = event.target.value;
    setSpeed(Number(e));
  };

  const handlePatternSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPattern(event.target.value);
  };

  const getCellStr = (cell: CellCoordsData): string => {
    return `${cell.row}|${cell.col}`;
  };

  const cellLifeCheck = () => {
    const cellsToCheck = new Map<string, string>();

    //first add alive cells
    for (let cellIndex = 0; cellIndex < aliveCells.length; cellIndex++) {
      cellsToCheck.set(getCellStr(aliveCells[cellIndex]), "alive");
    }

    //add dead cells around them next checking for collisions
    for (let cellIndex = 0; cellIndex < aliveCells.length; cellIndex++) {
      const cell = aliveCells[cellIndex];
      for (let rowIndex = cell.row - 1; rowIndex <= cell.row + 1; rowIndex++) {
        for (
          let colIndex = cell.col - 1;
          colIndex <= cell.col + 1;
          colIndex++
        ) {
          const cellStr = getCellStr({ row: rowIndex, col: colIndex });
          if (
            !cellsToCheck.has(cellStr) &&
            rowIndex >= 0 &&
            rowIndex < height &&
            colIndex >= 0 &&
            colIndex < width
          ) {
            cellsToCheck.set(cellStr, "dead");
          }
        }
      }
    }

    const mapArray: CellCheckType[] = Array.from(cellsToCheck).map(
      ([key, value]) => ({
        coords: {
          row: Number(key.split("|")[0]),
          col: Number(key.split("|")[1]),
        },
        status: value,
      })
    );

    const newCells = mapArray
      .map((element) => checkAdjacentCells(element))
      .filter((el) => !!el);

    setAliveCells(newCells);
    setStep((step) => step + 1);
  };

  /*
    {coords} == alive
    null == dead
    1. fewer than two alive cells die
    2. more than three alive cells die
    3. dead cells with three or more neighbours come alive
    4. if three cells are alive, do nothing I guess :)
    */
  function checkAdjacentCells(cellCheck: CellCheckType): CellCoordsData | null {
    const { col, row } = cellCheck.coords;
    const { status } = cellCheck;
    let count = 0;
    for (let rowIndex = row - 1; rowIndex <= row + 1; rowIndex++) {
      for (let colIndex = col - 1; colIndex <= col + 1; colIndex++) {
        if (row === rowIndex && col === colIndex) continue;
        const fCell = aliveCells.find(
          (el) => el.col === colIndex && el.row === rowIndex
        );
        if (
          fCell &&
          rowIndex >= 0 &&
          rowIndex < height &&
          colIndex >= 0 &&
          colIndex < width
        ) {
          count++;
        }
      }
    }
    //final check
    if (count < 2 && status === "alive") {
      return null;
    } else if (count > 3 && status === "alive") {
      return null;
    } else if (count === 3 && status === "dead") {
      return { col, row };
    } else if ((count === 2 || count === 3) && status === "alive") {
      return { col, row };
    }
    return null;
  }

  const getClassName = (status: string) => {
    let className = "square ";

    className = `square ${status === "dead" ? "dead" : "alive"}`;
    return className;
  };

  const renderAllCells = () => {
    const elements = [];
    for (let rowIndex = 0; rowIndex < height; rowIndex++) {
      let column = [];
      for (let columnIndex = 0; columnIndex < width; columnIndex++) {
        const isAlive = aliveCells.find(
          (el) => el.col === columnIndex && el.row === rowIndex
        );
        const isPlacingPattern = placementCells.find(
          (el) => el.col === columnIndex && el.row === rowIndex
        );
        column.push(
          <Cell
            style={`${getClassName(isAlive ? "alive" : "dead")} ${
              isPlacingPattern ? "temp" : ""
            }`}
            key={"r:" + rowIndex + ";c:" + columnIndex}
            col={columnIndex}
            row={rowIndex}
            handleCellClick={handleCellClick}
            handleCellHover={handleCellHover}
          />
        );
      }
      elements.push(
        <div className="row" key={"r:" + rowIndex}>
          {column}
        </div>
      );
    }
    return elements;
  };

  const buildSelectOptions = () => {
    const options = [];
    for (let i = 0; i < PatternList.length; i++) {
      options.push(
        <option
          key={PatternList[i].pattern}
          value={PatternList[i].pattern.replace(/\n|\t| /g, "")}
          disabled={PatternList[i]?.disabled}
        >
          {PatternList[i].description}
        </option>
      );
    }

    return options;
  };

  return (
    <div id="canvas-container">
      <div
        id="canvas"
        onWheel={throttle(handlePatternRotate, 50)}
        onKeyDown={throttle(handleCanvasKeyEvent, 100)}
      >
        {renderAllCells()}
        <div id="controls-container">
          <div className="controls">
            <button onClick={handleNextClick} disabled={running || editing}>
              Next
            </button>
            <button
              onClick={() => setRunning(true)}
              disabled={running || editing}
            >
              Start
            </button>
            <button onClick={handleStopTime} disabled={editing}>
              Stop
            </button>
            <button onClick={handleReset} disabled={editing}>
              Reset
            </button>
            <div id="speed">
              <span>SPEED: </span>
              <input
                type="range"
                name="speed"
                min="25"
                max="300"
                step="25"
                defaultValue={speed}
                onChange={handleSpeedChange}
              />
            </div>
            <p className="steps">STEP: {step.toLocaleString()}</p>
          </div>
          <div id="controls-right">
            {editing && (
              <select value={pattern} onChange={handlePatternSelect}>
                {buildSelectOptions()}
              </select>
            )}
            <button
              onClick={() => setEditing((edit) => !edit)}
              disabled={running}
            >
              {editing ? "CANCEL" : "PLACE PATTERN"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
