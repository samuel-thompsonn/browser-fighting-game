import Character from './Character';
import CharacterListener from './CharacterListener';
import characterA from './character_files/characterA.json';

export default class GameModel {
  characters: Map<string, Character>;

  characterCounter: number;

  constructor() {
    this.characters = new Map<string, Character>();
    this.characterCounter = 0;
  }

  createCharacter(listener: CharacterListener): string {
    const newCharacter = new Character(characterA, { x: 100, y: 120 });
    newCharacter.subscribe(listener);
    const characterID = `${this.characterCounter}`;
    this.characters.set(characterID, newCharacter);
    this.characterCounter += 1;
    return characterID;
  }

  moveCharacterLeft(characterID: string) {
    const targetCharacter = this.characters.get(characterID);
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
    const targetCharacter = this.characters.get(characterID);
    if (!targetCharacter) {
      return;
    }
    const prevPosition = targetCharacter.getPosition();
    targetCharacter.setPosition({
      x: prevPosition.x + 5,
      y: prevPosition.y,
    });
  }

  updateGame(elapsedSeconds: number) {
    this.characters.forEach((character) => {
      character.updateSelf({ default: 'yes' });
    });
  }
}
