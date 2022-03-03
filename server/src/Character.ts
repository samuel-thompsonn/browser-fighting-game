import {
  ControlsChange,
  Position,
  TransitionInfo,
} from './AnimationUtil';
import {
  CharacterFileData,
  AnimationState,
  FileAnimationState,
  FileCollisionData,
  CollisionData,
} from './CharacterFileInterface';
import CharacterListener from './CharacterListener';
import controlsLabels from './controls/ControlsLabels.json';
import GameInternal from './GameInternal';

function loadCollisionData(
  collisionData: FileCollisionData | undefined,
): CollisionData | undefined {
  return collisionData;
}

function loadAnimationState(stateData: FileAnimationState): AnimationState {
  const controlsMap = new Map<string, string>();
  if (stateData.transitions.controls) {
    stateData.transitions.controls.forEach(({ control, destination }) => {
      controlsMap.set(control, destination);
    });
  }
  return {
    id: stateData.id,
    transitions: {
      default: stateData.transitions.default,
      controls: controlsMap,
    },
    effects: stateData.effects,
    collisions: loadCollisionData(stateData.collisions),
  };
}

function getAnimationGraph(characterData: CharacterFileData): Map<string, AnimationState> {
  const animationStates = new Map<string, AnimationState>();
  characterData.animations.forEach((animation) => {
    animation.states.forEach((state) => {
      animationStates.set(state.id, loadAnimationState(state));
    });
  });
  return animationStates;
}

export default class Character {
  #animationStates: Map<string, AnimationState>;

  #currentState: AnimationState;

  #listeners: CharacterListener[];

  #position: Position;

  #movementSpeed: number;

  #controlsMap: Map<string, boolean>;

  #characterID: string;

  #healthInfo: {
    health: number;
    maxHealth: number;
  };

  constructor(characterData: CharacterFileData, startPosition: Position, characterID: string) {
    this.#characterID = characterID;
    this.#healthInfo = {
      health: characterData.stats.maxHealth,
      maxHealth: characterData.stats.maxHealth,
    };
    this.#controlsMap = new Map<string, boolean>();
    this.#position = startPosition;
    this.#movementSpeed = characterData.stats.movementSpeed;
    this.#animationStates = getAnimationGraph(characterData);
    const initialState = this.#animationStates.get(characterData.initialState);
    if (!initialState) {
      throw new Error("The initial state's ID isn't in the state graph.");
    }
    this.#currentState = initialState;
    this.#listeners = [];
  }

  getPosition(): Position {
    return this.#position;
  }

  setPosition(newPosition: Position): void {
    this.#position = newPosition;
    this.#notifyListeners();
  }

  changePosition(deltaPosition: Position): void {
    this.#position = {
      x: this.#position.x + deltaPosition.x,
      y: this.#position.y + deltaPosition.y,
    };
  }

  updateControls({ control, status }: ControlsChange): void {
    this.#controlsMap.set(control, status === 'pressed');
  }

  // perform the appropriate state transition given the relevant info
  // examples of relevant info:
  //   - colliding
  //     - with the ground
  //     - with the wall
  //     - with a hitbox
  //   - control inputs
  //     - jumping
  //     - moving left or right
  //     - attacking
  updateSelf(
    gameInterface: GameInternal,
    relevantInfo: TransitionInfo,
    elapsedSeconds: number,
  ): void {
    if (this.#currentState.effects) {
      if (this.#currentState.effects.move) {
        const movementAmount = this.#currentState.effects.move;
        const deltaPosition = {
          x: movementAmount.x * this.#movementSpeed * elapsedSeconds,
          y: movementAmount.y * this.#movementSpeed * elapsedSeconds,
        };
        gameInterface.moveCharacter(this, deltaPosition);
      }
    }
    let nextStateID = this.#currentState.transitions.default;
    controlsLabels.forEach((controlID) => {
      if (this.#controlsMap.get(controlID) === true) {
        const controlTransitions = this.#currentState.transitions.controls;
        const destination = controlTransitions.get(controlID);
        if (destination) {
          nextStateID = destination;
        }
      }
    });
    if (!nextStateID) { return; }
    this.setState(nextStateID);
  }

  subscribe(listener: CharacterListener) {
    this.#listeners.push(listener);
    this.#notifyListener(listener);
  }

  setState(newStateID:string) {
    const nextState = this.#animationStates.get(newStateID);
    if (!nextState) { return; }
    this.#currentState = nextState;
    this.#notifyListeners();
  }

  getCollisionData() {
    return this.#currentState.collisions;
  }

  /**
   * Notifies all listeners of the up-to-date current state
   */
  #notifyListeners(): void {
    this.#listeners.forEach((listener) => this.#notifyListener(listener));
  }

  /**
   * Notifies a listener of the current state
   * @param listener The listener to notify of the current state
   */
  #notifyListener(listener: CharacterListener): void {
    listener.handleCharacterUpdate({
      characterID: this.#characterID,
      animationState: this.#currentState,
      position: this.getPosition(),
      healthInfo: this.#healthInfo,
      collisionInfo: this.#currentState.collisions,
    });
  }
}
