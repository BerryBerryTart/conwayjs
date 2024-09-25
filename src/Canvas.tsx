import React, { useState, useRef, useEffect } from "react";
import Cell from "./Cell";

export interface CellCoordsData {
  row: number;
  col: number;
}

interface CanvasProps {
  width: number;
  height: number;
}

interface CellCheckType {
  coords: CellCoordsData;
  status: string;
}

const Canvas = (props: CanvasProps) => {
  const { width, height } = props;
  const [aliveCells, setAliveCells] = useState<CellCoordsData[]>([]);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const incrementor = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  useEffect(() => {
    return function cleanUp() {
      clearTimeout(incrementor.current);
    };
  }, []);

  useEffect(() => {
    if (running) {
      setTimeout(() => {
        cellLifeCheck();
      }, 100);
    }
  }, [running, aliveCells]);

  function handleCellClick(data: CellCoordsData) {
    if (running) return;
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

  const handleCellDrag = (data: CellCoordsData) => {
    if (running) return;
    const clonedAlive = structuredClone(aliveCells);
    clonedAlive.push({ col: data.col, row: data.row });
    setAliveCells(clonedAlive);
  };

  function handleReset() {
    setStep(0);
    setAliveCells([]);
    clearTimeout(incrementor.current);
    incrementor.current = undefined;
    setRunning(false);
  }

  function handleNextClick() {
    cellLifeCheck();
  }

  function handleStartTime() {
    setRunning(true);
  }

  function handleStopTime() {
    clearTimeout(incrementor.current);
    incrementor.current = undefined;
    setRunning(false);
  }

  const getCellStr = (cell: CellCoordsData): string => {
    return `${cell.row}|${cell.col}`;
  };

  function cellLifeCheck() {
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
            rowIndex < width &&
            colIndex >= 0 &&
            colIndex < height
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
  }

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
          rowIndex < width &&
          colIndex >= 0 &&
          colIndex < height
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

  const renderAllCells = () => {
    const elements = [];
    for (let columnIndex = 0; columnIndex < height; columnIndex++) {
      let row = [];
      for (let rowIndex = 0; rowIndex < width; rowIndex++) {
        const isAlive = aliveCells.find(
          (el) => el.col === columnIndex && el.row === rowIndex
        );
        row.push(
          <Cell
            status={isAlive ? "alive" : "dead"}
            key={"r:" + rowIndex + ";c:" + columnIndex}
            col={columnIndex}
            row={rowIndex}
            handleCellClick={handleCellClick}
            // handleCellDrag={handleCellDrag}
          />
        );
      }
      elements.push(
        <div className="row" key={"r:" + columnIndex}>
          {row}
        </div>
      );
    }
    return elements;
  };

  return (
    <div>
      {renderAllCells()}
      <div className="controls">
        <button onClick={handleNextClick} disabled={running}>
          Next
        </button>
        <button onClick={handleStartTime} disabled={running}>
          Start
        </button>
        <button onClick={handleStopTime}>Stop</button>
        <button onClick={handleReset}>Reset</button>
        <p className="steps">N = {step}</p>
      </div>
    </div>
  );
};

export default Canvas;
