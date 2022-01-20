import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import Character from './Character';
import ClientHandler from './ClientHandler';
import characterA from './character_files/characterA.json';
import GameModel from './GameModel';

const PORT = 3001;
const SECONDS_PER_GAME_LOOP = 0.10;

const clientHandlers = new Map<string, ClientHandler>();
const gameModel = new GameModel();
let socketCounter = 0;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const VERBOSE = true;

function logVerbose(logText:string) {
  if (VERBOSE) { console.log(logText); } // eslint-disable-line
}

app.use(cors({
  origin: 'http://localhost:3000',
}));

const handleCreateCharacter = (client:ClientHandler) => {
  const characterID = gameModel.createCharacter(client);
  client.setCharacterID(characterID);
};

io.on('connection', (socket) => {
  logVerbose('a user connected!');
  const newClient = new ClientHandler(
    socket,
    gameModel,
    () => { logVerbose('a user disconnected....!'); },
  );
  clientHandlers.set(`${socketCounter}`, newClient);
  // logVerbose(clientHandlers.toString());
  socketCounter += 1;
  socket.emit('accepted_connection');

  socket.on('create_character', () => {
    handleCreateCharacter(newClient);
  });
});

let ellipsisCount = 1;
const maxEllipsis = 3;
const gameLoopInterval = setInterval(() => {
  ellipsisCount %= (maxEllipsis + 1);
  const ellipsis = '.'.repeat(ellipsisCount) + ' '.repeat(maxEllipsis - ellipsisCount);
  process.stdout.write(`\rUpdating all characters${ellipsis}`);
  ellipsisCount += 1;
  gameModel.updateGame(SECONDS_PER_GAME_LOOP);
}, 1000 * SECONDS_PER_GAME_LOOP);

server.listen(PORT, () => {
  logVerbose(`Listening on *:${PORT}`);
});
