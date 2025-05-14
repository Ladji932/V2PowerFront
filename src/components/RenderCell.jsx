const RenderCell = ({
  cell,
  rowIndex,
  colIndex,
  lastMove,
  currentPlayer,
  playerId,
  winner,
  gravityInverted,
  handleColumnClick,
  getCellImage,
}) => {
  const isLastMove = lastMove && lastMove.row === rowIndex && lastMove.col === colIndex;
  const isPlayable = currentPlayer === playerId && !cell && !winner;

  return (
    <div
      onClick={() => isPlayable ? handleColumnClick(colIndex) : undefined}
      className={`w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden 
        ${isPlayable ? 'cursor-pointer cell-hover' : 'cursor-not-allowed'}
        ${isLastMove ? (gravityInverted ? 'token-drop-inverted' : 'token-drop') : ''}
        transition-all transform hover:scale-105 shadow-inner relative 
        ${cell === null ? 'bg-white' : ''}`}
    >
      {cell !== null && (
        <img 
          src={getCellImage(cell)} 
          alt="token" 
          className="w-full h-full object-cover" 
        />
      )}
      {isLastMove && (
        <div className="absolute inset-0 animate-ping rounded-full bg-white/30" />
      )}
    </div>
  );
};

export default RenderCell;
