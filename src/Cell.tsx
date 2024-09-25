import React, { useContext } from "react";
import { CellCoordsData } from "./Canvas";
import { MouseContext } from "./MouseContext";
import { throttle } from "lodash";

export interface CellProps {
  status: string;
  row: number;
  col: number;
  handleCellClick: ({}: CellCoordsData) => void;
  // handleCellDrag: ({}: CellCoordsData) => void;
}

const Cell = (props: CellProps) => {
  const mouseContext = useContext(MouseContext);

  function handleExternalClick() {
    props.handleCellClick({
      row: props.row,
      col: props.col,
    });
  }

  // const handleMouseMove = (e: any) => {
  //   if (mouseContext.isMouseDown) {
  //     props.handleCellDrag({
  //       row: props.row,
  //       col: props.col,
  //     });
  //   }
  // };

  return (
    <div
      className={props.status === "dead" ? "square dead" : "square alive"}
      onClick={handleExternalClick}
      // onMouseMove={handleMouseMove}
    ></div>
  );
};

export default Cell;
