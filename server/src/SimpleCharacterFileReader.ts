import { Position } from './AnimationUtil';
import BasicCollisionTransition from './BasicCollisionTransition';
import Character from './Character';
import {
  AnimationState,
  FileAnimationDescription,
  SimpleCharacterFileData,
  CharacterFileData,
  FileAnimationState,
  ControlsTransition,
  FileCollisionItem,
  CollisionTransitionDescription,
} from './CharacterFileInterface';
import { CollisionEntity } from './CollisionEntity';
import CollisionTransition from './CollisionTransition';

function getAnimationStateID(animationName: string, orderIndex: number) {
  return `${animationName}${orderIndex+1}`;
}

function defaultNextStateInterrupt(
  currentStateID: string,
  currentStateIndex: number,
  currentStateNumFrames: number,
  destinationState: string,
): string {
  if (currentStateIndex === currentStateNumFrames - 1) {
    return getAnimationStateID(destinationState, 0);
  }
  if (currentStateID === destinationState) {
    return getAnimationStateID(currentStateID, currentStateIndex + 1);
  }
  return getAnimationStateID(destinationState, 0);
}

function defaultNextStateAfterEnd(
  currentStateID: string,
  currentStateIndex: number,
  currentStateNumFrames: number,
  destinationState: string,
): string {
  if (currentStateIndex === currentStateNumFrames - 1) {
    return getAnimationStateID(destinationState, 0);
  }
  return getAnimationStateID(currentStateID, currentStateIndex + 1);
}

function resolveDefaultNextAnimation(
  currentStateID: string,
  currentStateIndex: number,
  currentStateNumFrames: number,
  defaultNextStateInfo: {
    destination: string;
    transitionType: string;
  }
): string {
  if (defaultNextStateInfo.transitionType === 'interrupt') {
    return defaultNextStateInterrupt(
      currentStateID,
      currentStateIndex,
      currentStateNumFrames,
      defaultNextStateInfo.destination,
    );
  }
  else if (defaultNextStateInfo.transitionType === 'afterEnd') {
    return defaultNextStateAfterEnd(
      currentStateID,
      currentStateIndex,
      currentStateNumFrames,
      defaultNextStateInfo.destination,
    )
  }
  return getAnimationStateID(defaultNextStateInfo.destination, 0);
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

function loadCollisionEntities(collisionData: FileCollisionItem[]): CollisionEntity[] {
  const collisionEntities:CollisionEntity[] = [];
  collisionData.forEach((collisionEntityData) => {
    const collisionProperties = new Map<string, string>();
    collisionEntityData.properties?.forEach((collisionProperty) => {
      collisionProperties.set(collisionProperty.propertyName, collisionProperty.propertyValue);
    });
    collisionEntities.push(new CollisionEntity(
      collisionEntityData.entityType,
      collisionProperties,
      collisionEntityData.rectangles,
    ))
  });
  return collisionEntities;
}

function getStateCollisionTransitions(collisionTransitionData: CollisionTransitionDescription[]): CollisionTransition[] {
  const collisionTransitions: CollisionTransition[] = [];
  collisionTransitionData.forEach((transitionDescription) => {
    collisionTransitions.push(new BasicCollisionTransition(transitionDescription))
  })
  return collisionTransitions;
}

function getAnimationStates(animationDescription: FileAnimationDescription): AnimationState[] {
  const generatedStates:AnimationState[] = [];
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

    let stateCollisions = undefined;
    if (animationDescription.state.collisions) {
      stateCollisions = loadCollisionEntities(animationDescription.state.collisions);
    }

    const stateCollisionDescriptions = animationDescription.state.transitions.collisions;
    let stateCollisionTransitions:CollisionTransition[] = [];
    if (stateCollisionDescriptions) {
      stateCollisionTransitions = getStateCollisionTransitions(stateCollisionDescriptions);
    }
    
    generatedStates.push({
      id,
      transitions: {
        default: defaultNextState,
        controls: controlsTransitions,
        collisions: stateCollisionTransitions,
      },
      effects: animationDescription.state.effects,
      collisions: stateCollisions,
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
      characterData.stats.knockbackStrength,
      animationGraph,
      getAnimationStateID(characterData.initialState, 0),
    );
  }
}
