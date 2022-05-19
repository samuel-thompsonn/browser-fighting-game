import { Position } from './AnimationUtil';
import Character from './Character';
import {
  AnimationState,
  FileAnimationDescription,
  SimpleCharacterFileData,
  CharacterFileData,
  FileAnimationState,
  ControlsTransition,
} from './CharacterFileInterface';

function getAnimationStateID(animationName: string, orderIndex: number) {
  return `${animationName}${orderIndex+1}`;
}

function resolveDefaultNextAnimation(
  currentStateID: string,
  currentStateIndex: number,
  currentStateNumFrames: number,
  defaultNextStateID: string
) {
  if (currentStateIndex === currentStateNumFrames - 1) {
    return getAnimationStateID(defaultNextStateID, 0);
  }
  if (currentStateID === defaultNextStateID) {
    return getAnimationStateID(currentStateID, currentStateIndex + 1);
  }
  return getAnimationStateID(defaultNextStateID, 0);
}

function resolveDestinationStateID(
  currentStateID: string,
  currentStateIndex: number,
  currentStateNumFrames: number,
  destinationStateID: string
): string {
  if (currentStateID === destinationStateID) {
    return getAnimationStateID(currentStateID, (currentStateIndex + 1) % currentStateNumFrames);
  }
  return getAnimationStateID(destinationStateID, 0)
}

function getStateControlsTransitions(
  animationDescription: FileAnimationDescription,
  stateIndex: number
): Map<string, string> {
  const fileDescription = animationDescription.state.transitions.controls;
  if (!fileDescription) {
    return new Map<string, string>();
  }
  const returnedTransitions = new Map<string, string>();
  fileDescription.forEach((controlsTransition: ControlsTransition) => {
    returnedTransitions.set(
      controlsTransition.control,
      resolveDestinationStateID(
        animationDescription.id,
        stateIndex, animationDescription.numFrames,
        controlsTransition.destination
      )
    );
  });
  return returnedTransitions;
}

function getAnimationStates(animationDescription: FileAnimationDescription): AnimationState[] {
  const generatedStates = [];
  for (let i = 0; i < animationDescription.numFrames; i += 1) {
    const id = getAnimationStateID(animationDescription.id, i);
    const defaultNextState = resolveDefaultNextAnimation(
      animationDescription.id,
      i,
      animationDescription.numFrames,
      animationDescription.state.transitions.default,
    );
    const controlsTransitions = getStateControlsTransitions(
      animationDescription,
      i,
    );
    
    generatedStates.push({
      id,
      transitions: {
        default: defaultNextState,
        controls: controlsTransitions,
      },
      effects: animationDescription.state.effects,
      collisions: animationDescription.state.collisions,
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

    const startPositon:Position = {
      x: 50,
      y: 0,
    };

    return new Character(
      characterID,
      startPositon,
      characterData.stats.movementSpeed,
      characterData.stats.movementSpeed,
      animationGraph,
      getAnimationStateID(characterData.initialState, 0),
    );
  }
}
