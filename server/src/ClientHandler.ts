import { Socket } from 'socket.io';
import { AnimationState, Position } from './AnimationUtil';
import CharacterListener from './CharacterListener';
import GameModel from './GameModel';

export default class ClientHandler implements CharacterListener {
  socket: Socket;

  characterID: string | undefined;

  constructor(
    socket:Socket,
    gameInterface:GameModel,
    onDisconnect:(disconnector:Socket) => void,
  ) {
    this.socket = socket;
    this.characterID = undefined;
    socket.on('disconnect', () => onDisconnect(socket));
    socket.on('move_right', () => {
      if (this.characterID) {
        gameInterface.moveCharacterRight(this.characterID);
      }
    });
    socket.on('move_left', () => {
      if (this.characterID) {
        gameInterface.moveCharacterLeft(this.characterID);
      }
    });
  }

  setCharacterID(characterID: string): void {
    this.characterID = characterID;
  }

  handleCharacterUpdate(newState: AnimationState, newPosition: Position): void {
    this.socket.emit('update_character', {
      id: '0',
      position: newPosition,
      state: newState.id,
      health: 100,
    });
  }
}
