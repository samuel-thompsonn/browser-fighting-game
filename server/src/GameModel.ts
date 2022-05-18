import { ControlsChange, Position } from './AnimationUtil';
import BasicCollisionChecker from './BasicCollisionChecker';
import Character from './Character';
import CharacterListener from './CharacterListener';
import characterA from './character_files/characterA.json';
import GameInternal from './GameInternal';

export default class GameModel implements GameInternal {
  #characters: Map<string, Character>;

  #characterCounter: number;

  pendingMovement: Map<Character, Position[]>;

  #characterListeners: Set<CharacterListener>;

  constructor() {
    this.#characters = new Map<string, Character>();
    this.pendingMovement = new Map<Character, Position[]>();
    this.#characterCounter = 0;
    this.#characterListeners = new Set<CharacterListener>();
  }

  moveCharacter(character: Character, deltaPosition: Position): void {
    if (!this.pendingMovement.get(character)) {
      this.pendingMovement.set(character, []);
    }
    this.pendingMovement.get(character)?.push(deltaPosition);
  }

  addCharacterListener(listener: CharacterListener): void {
    this.#characterListeners.add(listener);
    this.#characters.forEach((character) => {
      character.subscribe(listener);
    });
  }

  removeCharacterListener(listener: CharacterListener): void {
    this.#characterListeners.delete(listener);
  }

  createCharacter(): string {
    const characterID = `${this.#characterCounter}`;
    const newCharacter = new Character(characterA, { x: 100, y: 50 }, characterID);
    this.#characterListeners.forEach((listener) => {
      newCharacter.subscribe(listener);
    });
    this.#characters.set(characterID, newCharacter);
    this.#characterCounter += 1;
    console.log(`There are now ${this.#characters.size} characters.`);
    return characterID;
  }

  removeCharacter(characterID: string) {
    this.#characters.delete(characterID);
    this.#characterListeners.forEach((listener) => {
      listener.handleCharacterDeleted(characterID);
    });
    console.log(`There are now ${this.#characters.size} characters.`);
  }

  moveCharacterLeft(characterID: string) {
    const targetCharacter = this.#characters.get(characterID);
    if (!targetCharacter) {
      return;
    }
    const prevPosition = targetCharacter.getPosition();
    targetCharacter.setPosition({
      x: prevPosition.x - 5,
      y: prevPosition.y,
    });
  }

  moveCharacterRight(characterID: string) {
    const targetCharacter = this.#characters.get(characterID);
    if (!targetCharacter) {
      return;
    }
    const prevPosition = targetCharacter.getPosition();
    targetCharacter.setPosition({
      x: prevPosition.x + 5,
      y: prevPosition.y,
    });
  }

  updateCharacterControls(characterID: string, controlsChange: ControlsChange) {
    const targetCharacter = this.#characters.get(characterID);
    if (!targetCharacter) { return; }
    targetCharacter.updateControls(controlsChange);
  }

  updateGame(elapsedSeconds: number) {
    this.#characters.forEach((character) => {
      character.updateSelf(this, { default: 'yes' }, elapsedSeconds);
    });
    // Find out total delta position for each character
    // find out new next position for each character
    const deltaPositions = new Map<Character, Position>();
    this.#characters.forEach((character) => {
      const positionChange = { x: 0, y: 0 };
      this.pendingMovement.get(character)?.forEach((deltaPosition) => {
        positionChange.x += deltaPosition.x;
        positionChange.y += deltaPosition.y;
      });
      deltaPositions.set(character, positionChange);
      this.pendingMovement.set(character, []);
    });
    // figure out collisions based on new next position
    this.#characters.forEach((outerCharacter) => {
      const outerDeltaPosition = deltaPositions.get(outerCharacter);
      if (!outerDeltaPosition) { return; }
      this.#characters.forEach((innerCharacter) => {
        const innerDeltaPosition = deltaPositions.get(innerCharacter);
        if (!innerDeltaPosition) { return; }
        const outerCollisionData = outerCharacter.getCollisionData();
        const innerCollisionData = innerCharacter.getCollisionData();
        if (!(outerCollisionData && innerCollisionData)) { return; }
        // Check for collisions:
        const detectedCollision = BasicCollisionChecker.hasCollision(
          outerCollisionData,
          innerCollisionData,
        );
        if (detectedCollision) {
          console.log(`Collision between a ${detectedCollision.firstEntity.type} and ${detectedCollision.secondEntity.type} `);
        }
      });
    });
    deltaPositions.forEach((deltaPosition: Position, character: Character) => {
      const currentPosition = character.getPosition();
      character.setPosition({
        x: currentPosition.x + deltaPosition.x,
        y: currentPosition.y + deltaPosition.y,
      });
    });
  }
}
