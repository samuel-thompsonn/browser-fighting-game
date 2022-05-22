import {
  ControlsChange,
  Position,
  TransitionInfo,
} from './AnimationUtil';
import {
  CharacterFileData,
  AnimationState,
  FileAnimationState,
  FileCollisionItem,
  CharacterDimensions,
} from './CharacterFileInterface';
import CharacterListener from './CharacterListener';
import controlsLabels from './controls/ControlsLabels.json';
import { CollisionEvent } from './GameInterfaces';
import GameInternal from './GameInternal';

const CHARACTER_SIZE = 64;

export default class Character {
  #animationStates: Map<string, AnimationState>;

  #currentState: AnimationState;

  #listeners: CharacterListener[];

  #position: Position;

  #dimensions: CharacterDimensions;

  #movementSpeed: number;

  #controlsMap: Map<string, boolean>;

  #characterID: string;

  #healthInfo: {
    health: number;
    maxHealth: number;
  };

  #currentCollision: {
    thisEntity: {
      type: string;
    },
    otherEntity: {
      type: string;
    }
  } | undefined;

  constructor(
    characterID: string,
    startPosition: Position,
    movementSpeed: number,
    maxHealth: number,
    animationStates: Map<string, AnimationState>,
    initialStateID: string,
  ) {
    this.#dimensions = {
      width: CHARACTER_SIZE,
      height: CHARACTER_SIZE,
    }
    this.#controlsMap = new Map<string, boolean>();
    this.#listeners = [];
    this.#characterID = characterID;
    this.#healthInfo = {
      health: maxHealth,
      maxHealth: maxHealth,
    };
    this.#position = startPosition;
    this.#movementSpeed = movementSpeed;
    this.#animationStates = animationStates;
    const initialState = this.#animationStates.get(initialStateID);
    if (!initialState) {
      throw new Error(`Initial state ${initialStateID} not found in states map!`);
    }
    this.#currentState = initialState;
  }

  getCharacterID(): string {
    return this.#characterID;
  }

  getPosition(): Position {
    return this.#position;
  }

  getDimensions(): CharacterDimensions {
    return this.#dimensions;
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
    if (this.#currentCollision) {
      // TODO: Make this depend on the 'controls' property of the current
      // animation state.
      nextStateID = "knockback1"
      this.#currentCollision = undefined;
    }
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

  registerCollision(collisionEvent:CollisionEvent): void {
    let selfEntity = collisionEvent.firstEntity;
    let otherEntity = collisionEvent.secondEntity;
    if (collisionEvent.secondEntity.characterID === this.#characterID) {
      selfEntity = collisionEvent.secondEntity;
      otherEntity = collisionEvent.firstEntity;
    }
    if (selfEntity.collisionEntity.getEntityType() === 'hurtbox' 
        && otherEntity.collisionEntity.getEntityType() === 'hitbox') {
      this.#currentCollision = {
        thisEntity: {
          type: 'hurtbox'
        },
        otherEntity: {
          type: 'hitbox'
        }
      }
    }
  }

  /**
   * Notifies all listeners of the up-to-date current state
   */
  #notifyListeners(): void {
    this.#listeners.forEach((listener) => this.#notifyListener(listener));
  }

  #serializeCollisions(): FileCollisionItem[] {
    const serializedCollisions:FileCollisionItem[] = [];
    this.#currentState.collisions?.forEach((collisionEntity) => {
      serializedCollisions.push(collisionEntity.getJSONSerialized());
    });
    return serializedCollisions;
  }

  /**
   * Notifies a listener of the current state
   * @param listener The listener to notify of the current state
   */
  #notifyListener(listener: CharacterListener): void {
    // TODO: Turn the collision entities back into something that is JSON
    // serializeable. Or make a serializer either inside the CollisionEntity
    // class or without. Probably inside right?
    listener.handleCharacterUpdate({
      characterID: this.#characterID,
      animationState: this.#currentState,
      position: this.getPosition(),
      healthInfo: this.#healthInfo,
      collisionInfo: this.#serializeCollisions(),
    });
  }
}
