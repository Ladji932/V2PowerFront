import React from 'react';

const Board = ({ board, lastMove, handleColumnClick, getCellImage, RenderCell }) => {
  return (
    <div className="grid grid-cols-7 gap-2 p-4 rounded-2xl bg-black sm:grid-cols-6 md:grid-cols-5 lg:grid-cols-7">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div key={`${rowIndex}-${colIndex}`}>
            {RenderCell({
              cell,
              rowIndex,
              colIndex,
              lastMove,
              handleColumnClick,
              getCellImage
            })}
          </div>
        ))
      )}
    </div>
  );
};

export default Board;
