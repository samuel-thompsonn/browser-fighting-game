import { Socket } from 'socket.io';
import { ControlsChange, Position } from './AnimationUtil';
import { CharacterStatus } from './CharacterDataInterfaces';
import { AnimationState } from './CharacterFileInterface';
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
    socket.on('controlsChange', (controlsChange: ControlsChange) => {
      if (this.characterID) {
        gameInterface.updateCharacterControls(this.characterID, controlsChange);
      }
    });
  }

  setCharacterID(characterID: string): void {
    this.characterID = characterID;
  }

  handleCharacterUpdate({
    animationState,
    position,
    healthInfo,
    collisionInfo,
  }: CharacterStatus): void {
    this.socket.emit('updateCharacter', {
      id: '0',
      position,
      state: animationState.id,
      healthInfo,
      collisionInfo,
    });
  }
}
