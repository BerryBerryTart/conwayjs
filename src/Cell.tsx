import React from "react";
import { CellCoordsData } from "./Canvas";
import { throttle } from "lodash";

export interface CellProps {
  style: string;
  row: number;
  col: number;
  handleCellClick: ({}: CellCoordsData) => void;
  handleCellHover: ({}: CellCoordsData) => void;
}

const Cell = (props: CellProps) => {
  function handleExternalClick() {
    props.handleCellClick({
      row: props.row,
      col: props.col,
    });
  }

  const returnHoverPos = throttle(() => {
    props.handleCellHover({
      row: props.row,
      col: props.col,
    });
  }, 100);

  return (
    <div
      className={props.style}
      onClick={handleExternalClick}
      onMouseEnter={returnHoverPos}
    ></div>
  );
};

export default Cell;
