import React, { createContext, PropsWithChildren, useState } from "react";

export interface MouseContextType {
  isMouseDown: boolean;
}

export const MouseContext = createContext<MouseContextType>({} as MouseContextType);

export const MouseContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [isMouseDown, setIsMouseDown] = useState(false);

  const mouseDown = () => {
    setIsMouseDown(true);
  };

  const mouseUp = () => {
    setIsMouseDown(false);
  };

  return (
    <MouseContext.Provider value={{isMouseDown}}>
      <div onMouseDown={mouseDown} onMouseUp={mouseUp}>
        {children}
      </div>
    </MouseContext.Provider>
  );
};
