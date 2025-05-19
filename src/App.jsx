import React, { useState, useEffect } from 'react';

import { io } from 'socket.io-client';
import { Copy, Users, Trophy, Crown, Loader2 } from 'lucide-react';
import RenderCell from './components/RenderCell';
import Background from './components/Background';
import Attente from './components/Attente';


const socket = io('http://localhost:3000/');

const App = () => {
  let playerTeam = [];
  const [roomId, setRoomId] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [message, setMessage] = useState('');
  const [players, setPlayers] = useState([]);
  const [winner, setWinner] = useState(null);
  const [gravityInverted, setGravityInverted] = useState(false);
  const [playerColors, setPlayerColors] = useState({});
  const [lastMove, setLastMove] = useState(null);
  const [mode, setMode] = useState('1v1');  // Initialisation à '1v1' par défaut
  const [waitingScreen, setWaitingScreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [winningCells, setWinningCells] = useState([]);
  const [turnOrder, setTurnOrder] = useState([]);


  const resetGame = () => {
    setBoard(Array(6).fill(null).map(() => Array(7).fill(null)));  // Réinitialise le tableau de jeu
    setCurrentPlayer('');  // Réinitialise le joueur actuel
    setJoinRoomId('')
    setRoomId('')
    setWinner(null);  // Réinitialise le gagnant
    setGravityInverted(false);  // Réinitialise l'inversion de gravité
    setPlayerColors({});  // Réinitialise les couleurs des joueurs
    setLastMove(null);  // Réinitialise le dernier mouvement
    setWinningCells([]);  // Réinitialise les cellules gagnantes
    setPlayers([]); 
    setMessage("La partie est terminée");  // Message de fin
    setGameStarted(false);  // Arrête la partie
  };


  


  useEffect(() => {
    socket.on('play', ({ row, column, playerId }) => {
      const handlePlay = ({ row, column, playerId }) => {
        setLastMove({ row, col: column });
        // Ne change pas currentPlayer ici
        // Ne change pas le message ici
      };
    
      socket.on('play', handlePlay);
      return () => socket.off('play', handlePlay);  /*
      if (mode === '1v1') {
        console.log("1vs1")
        setCurrentPlayer(prev => (prev === players[0] ? players[1] : players[0]));
        setMessage(currentPlayer === socket.id ? "C'est votre tour" : "Tour de l'adversaire");
      } else if (mode === '2v2') {
        console.log("2vs2")
        const currentIndex = players.indexOf(currentPlayer);
        const nextPlayerIndex = (currentIndex + 1) % players.length;
        setCurrentPlayer(players[nextPlayerIndex]);
  
        // Gérer le message pour le 2v2
        const teamGreenPlayers = teamGreen.filter(id => id === socket.id);
        const teamYellowPlayers = teamYellow.filter(id => id === socket.id);
  
        if (teamGreenPlayers.length > 0) {
          setMessage(currentPlayer === socket.id ? "Tour de votre coéquipier" : "Tour de l'autre équipe");
        } else if (teamYellowPlayers.length > 0) {
          setMessage(currentPlayer === socket.id ? "Tour de votre coéquipier" : "Tour de l'autre équipe");
        } else {
          setMessage(currentPlayer === socket.id ? "C'est votre tour" : "Tour de l'adversaire");
        }
      }*/
    });
    return () => socket.off('play');
  }, [players, currentPlayer, mode,]);
  




  useEffect(() => {
    const handleUpdatePlayers = ({ players }) => {
      setPlayers(players);          // met à jour le state => re-render du compteur
    };
  
    socket.on('updatePlayers', handleUpdatePlayers);
    return () => socket.off('updatePlayers', handleUpdatePlayers);
  }, []);
      

  useEffect(() => {
    const handleGameWon = ({ winner, team }) => {
      if (team) {
        console.log(`L'équipe ${team} a gagné ! Joueur décisif : ${winner}`);
      } else {
        console.log(`Le joueur ${winner} a gagné !`);
      }
  
      setWinner(winner);
  
      const message =
        mode === '1v1'
          ? (winner === socket.id ? "🎉 Vous avez gagné !" : "💀 Vous avez perdu.")
          : team === 'green'
          ? "🎉 L'équipe vert a gagné !"
          : "🎉 L'équipe jaune a gagné !";
  
      setMessage(message);
  
      setTimeout(() => {
        resetGame();
      }, 5500);
    };
  
    socket.on('gameWon', handleGameWon);
  
    return () => socket.off('gameWon', handleGameWon);
  }, [mode, socket, resetGame]);
  

  
  useEffect(() => {

    console.log("État des joueurs : ", players);
    console.log("État du joueur actuel : ", currentPlayer);
    console.log("Mode actuel : ", mode);
  
    const handleConnect = () => setPlayerId(socket.id);
    const handleGameCreated = ({ roomId, roomMode }) => {
      setRoomId(roomId);
      setMessage("En attente d'autres joueurs...");
      setWaitingScreen(true);
    };


    const handleStartGame = ({ players, playerColors, mode, teamGreen, teamYellow }) => {
      console.log("Le mode est ", mode);
      setMode(mode);
      setWaitingScreen(false);
      setGameStarted(true);
      setPlayers(players);
      setPlayerColors(playerColors);
      setBoard(Array(6).fill(null).map(() => Array(7).fill(null))); // réinitialise le tableau    
    };
    

    /*const handleUpdateBoard = ({ board, currentPlayer}) => {
      setBoard(board);
      setCurrentPlayer(currentPlayer);
      setMessage(currentPlayer === socket.id ? "C'est votre tour" : "Tour de l'adversaire");
    };
*/
const handleUpdateBoard = ({ board, currentPlayer, teamGreen, teamYellow }) => {
  setBoard(board);
  setCurrentPlayer(currentPlayer);


  if (mode === '2v2') {
    // ✅ Ne faire les vérifs d’équipe que en 2v2
    if (teamGreen?.includes(socket.id)) {
      playerTeam = teamGreen;
      console.log("✅ Je suis dans l'équipe verte");
    } else if (teamYellow?.includes(socket.id)) {
      playerTeam = teamYellow;
      console.log("✅ Je suis dans l'équipe jaune");
    } else {
      console.log("❌ Mon socket.id ne correspond à aucune équipe !");
    }
  }

  const isMyTurn = currentPlayer === socket.id;
  const isMyTeamTurn = playerTeam.includes(currentPlayer);
  console.log("Ultra Important 1   ",isMyTeamTurn)
  console.log("Ultra Important 2   ",playerTeam)



 // console.log("👥 playerTeam :", playerTeam);
 // console.log("🔄 isMyTeamTurn :", isMyTeamTurn);
  //console.log("🎮 isMyTurn :", isMyTurn);

  // 🎮 Mode 1v1
  if (mode === '1v1') {
    setMessage(isMyTurn ? "C'est votre tour" : "Tour de l'adversaire");
  }

  // 👥 Mode 2v2
  else if (mode === '2v2') {
    if (isMyTeamTurn) {
    //  alert("à Toi")
      setMessage(isMyTurn ? "C'est votre tour" : "C'est le tour de votre coéquipier");
   // setMessage("C'est votre tour" );

    } else {
      setMessage("Tour de l'équipe adverse");
    }
  }
};

socket.on('updateBoard', handleUpdateBoard);






    const handlePlayerLeft = () => {
      setMessage("Un joueur a quitté la partie");
      setGameStarted(false);
      setBoard([]);
      resetGame();
    };

    const handleError = (error) => setMessage(error);

    socket.on('connect', handleConnect);
    socket.on('gameCreated', handleGameCreated);
    socket.on('startGame', handleStartGame);
    socket.on('playerLeft', handlePlayerLeft);
    socket.on('error', handleError);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('gameCreated', handleGameCreated);
      socket.off('startGame', handleStartGame);
      socket.off('playerLeft', handlePlayerLeft);
      socket.off('error', handleError);
      socket.off('updateBoard', handleUpdateBoard);

    };
  }, [mode,]);

  

  const resetGameState = () => {
    setGravityInverted(false);
    setPlayerColors({});
    setLastMove(null);
    setWinningCells([]);
    setWinner(null);
  };

  const handleCreateGame = () => socket.emit('createGame', { mode });

  const handleJoinGame = () => {
    socket.emit('joinGame', { roomId: joinRoomId ,mode});
  
    // Ajout d'un listener pour gérer les erreurs
    socket.on('error', (error) => {
      setMessage(error); // Affiche l'erreur
      console.log(error); // Affiche l'erreur
      setWaitingScreen(false); // On arrête d'afficher la salle d'attente si l'erreur est présente
    });
  
    // Réponse du serveur après tentative de rejoindre la salle
    socket.on('roomNotFound', () => {
      setMessage('La partie avec ce code n\'existe pas.');
      setWaitingScreen(false); // Annule l'affichage de la salle d'attente
    });
  
    socket.on('success', (message) => {
      setMessage(message); // Affiche le message de succès
      setWaitingScreen(true); // Si tout est OK, on affiche la salle d'attente
    });
  };
    
  const handleColumnClick = (column) => {
    if (currentPlayer === socket.id && !winner) {
      socket.emit('play', { roomId: roomId || joinRoomId, column, gravityState: gravityInverted });
    }
  };

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDisconnectSockets = () => {
    socket.disconnect();
    setMessage("Vous avez quitté la partie. Votre adversaire remporte la victoire.");
  
    // Effacer le message après 5 secondes
    setTimeout(() => {
      setMessage("");
    }, 5000);
  
    resetGame()
  };
  
  const handleQuitGame = () => {
    socket.emit('playerLeft', { roomId: roomId || joinRoomId }); // Envoyer un message au serveur pour notifier le départ du joueur
    handleDisconnectSockets(); // Déconnecte le joueur et réinitialise l'état du jeu
  };

  
  const getCellImage = (cell) => {
    if (cell === null) return 'bg-white'; // Applique un fond blanc si la cellule est vide
    return playerColors[cell] === 'green' ? '/assets/green.png' : '/assets/yellow.png'; // Retourne l'image correspondante pour chaque joueur
  };
  



  

  return (
      <div className="h-screen flex flex-col items-center justify-center p-4 grid-bg overflow-hidden">
        <Background />
      <h1 className="text-4xl md:text-6xl font-bold mb-8 text-white tracking-tight flex items-center gap-3">
        <Crown className="w-10 h-10 md:w-12 md:h-12 text-yellow-400" />
        Puissance 4
      </h1>
  
      {!gameStarted ? (
          waitingScreen ? (
            <Attente
              roomId={roomId}
              players={players}
              mode={mode}
              handleCopyRoomId={handleCopyRoomId}
              copied={copied}
            />
          ) : (
          <div className="glass-panel rounded-2xl p-8 shadow-xl space-y-6 w-full max-w-md">

                  {/* ✅ Ajout du champ d'erreur ici */}
      {message && (
        <div className="text-white text-center text-sm font-semibold bg-red-600/70 px-4 py-2 rounded-xl transition-all duration-300">
          {message}
        </div>
      )}


            <div className="flex justify-between gap-4">
              <button
                onClick={() => setMode('1v1')}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                  mode === '1v1'
                    ? 'text-white shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                style={mode === '1v1' ? { backgroundImage: 'linear-gradient( #db2777)' } : {}}
              >
                1 vs 1
              </button>
              <button
                onClick={() => setMode('2v2')}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                  mode === '2v2'
                    ? 'text-white shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                style={mode === '2v2' ? { backgroundImage: 'linear-gradient( #db2777)' } : {}}
              >
                2 vs 2
              </button>
            </div>
  
            <button
              onClick={handleCreateGame}
              className="w-full text-white px-6 py-4 rounded-xl font-semibold
                transition-all transform hover:scale-105 shadow-lg
                flex items-center justify-center gap-2"
              style={{
                backgroundColor: '#db2777', // Utilisation de la couleur unique #db2777
              }}
            >
              <Users className="w-5 h-5" />
              Créer une partie
            </button>
  
            <div className="space-y-3">
              <input
                type="text"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                placeholder="Entrez le code de la partie"
                className="w-full bg-white/20 text-black placeholder-white/60 border-2 border-white/30
                  rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => {
                  if (joinRoomId.trim() === '') {
                    setMessage('Le code de la partie est invalide.'); // Message d'erreur
                    return; // Ne pas rejoindre si le code est vide
                  }
                  handleJoinGame();
                  setWaitingScreen(true)
                }}
                className="w-full text-white px-6 py-4 rounded-xl font-semibold border-2 border-custom-purple transition-all transform hover:scale-105 shadow-lg"
              >
                Rejoindre la partie
              </button>
            </div>
          </div>
        )
      ) : (
        <div className="space-y-6">
          {winner && (
            <div className="text-center text-2xl font-bold mt-4 text-green-500">
              {winner === playerId ? "🏆 Vous avez gagné la partie !" : "😢 L'adversaire a gagné..."}
            </div>
          )}
  
          <div className="game-board p-4 rounded-2xl bg-black">
            <button
              onClick={handleQuitGame}
              className="text-white px-6 py-4 rounded-xl font-semibold border-2 border-red-500 bg-red-500 transition-all transform hover:scale-105 shadow-lg mt-4 fixed top-0 left-0 z-50 m-2 w-auto min-w-[150px]"
            >
              Quitter la partie
            </button>
            {message && (
              <div className="text-white text-xl font-bold bg-black/50 p-4 rounded-xl mb-4 transition-all duration-500">
                {message}
              </div>
            )}
  
            <div className="grid grid-cols-7 gap-2">
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
          </div>
        </div>
      )}
    </div>
  );
  }
  
  export default App;
  
