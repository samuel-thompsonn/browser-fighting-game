import { Position } from './AnimationUtil';
import Character from './Character';
import {
  AnimationState,
  FileAnimationDescription,
  SimpleCharacterFileData,
  CharacterFileData,
  FileAnimationState,
} from './CharacterFileInterface';

function getAnimationStates(animationDescription: FileAnimationDescription): AnimationState[] {
  const generatedStates = [];
  for (let i = 0; i < animationDescription.numFrames; i += 1) {
    const id = `${animationDescription.name}${i + 1}`;
    generatedStates.push({
      id,
      transitions: {
        default: '',
        controls: new Map<string, string>(),
      },
      effects: {

      },
      collisions: {

      },
    });
  }
  return generatedStates;
}

/**
 * Transforms a FileAnimationDescription to a string-identified set
 * of AnimationStates.
 * @param characterData An array of FileAnimationDescriptions describing a
 * character's animations.
 * @returns A map from the ID of animation states to the animation states
 * they represent. If the description of an animation has name X, then the states
 * will be given names X1, X2, ....
 */
function getAnimationGraph(characterData: FileAnimationDescription[]): Map<string, AnimationState> {
  const animationMap = new Map<string, AnimationState>();
  characterData.forEach((animationDescription) => {
    const generatedStates = getAnimationStates(animationDescription);
    generatedStates.forEach((generatedState) => {
      animationMap.set(generatedState.id, generatedState);
    });
  });
  return animationMap;
}

/**
 * Reads a character file to create a character.
 */
export default class SimpleCharacterFileReader {
  static readCharacterFile(characterData: SimpleCharacterFileData, characterID: string): Character {
    // produces the following: from file
    // 1. max health
    // 2. movement speed
    // 3. animation states map
    // 4. initial state

    const animationGraph = getAnimationGraph(characterData.animations);
    const translatedAnimationGraph:FileAnimationState[] = [];

    const transformedData:CharacterFileData = {
      name: '',
      initialState: '',
      stats: {
        movementSpeed: 0,
        maxHealth: 0,
      },
      animations: [],
    };

    const startPositon:Position = {
      x: 0,
      y: 0,
    };

    return new Character(transformedData, startPositon, characterID);
  }
}
