import { Copy, Loader2 } from "lucide-react";

const Attente = ({ roomId, players, mode, handleCopyRoomId, copied }) => {
    console.log('Mode actuel:', mode);

  return (
    <div className="glass-panel rounded-2xl p-8 text-center text-white space-y-4">
      <Loader2 className="w-16 h-16 animate-spin mx-auto text-white" />
      <p className="text-xl font-semibold">
        Joueurs connectés : {players.length} / {mode === '1v1' ? 2 : 4}
      </p>
      <div className="flex gap-2 justify-center mt-2">
        {[...Array(mode === '1v1' ? 2 : 4)].map((_, index) => (
          <div
            key={index}
            className={`w-4 h-4 md:w-5 md:h-5 rounded-full transition-all duration-300 
              ${index < players.length ? 'bg-green-400' : 'bg-white/40'}`}
          />
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 bg-white/20 rounded-lg p-4">
        <p className="text-sm">
          Code de la partie : <strong>{roomId}</strong>
        </p>
        <button
          onClick={handleCopyRoomId}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <Copy className={`w-5 h-5 ${copied ? 'text-green-400' : 'text-white'}`} />
        </button>
      </div>
    </div>
  );
};

export default Attente;
