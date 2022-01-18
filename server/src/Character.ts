import {
  AnimationState,
  CharacterFileData,
  Position,
  TransitionInfo,
} from './AnimationUtil';
import CharacterListener from './CharacterListener';

function getAnimationGraph(characterData: CharacterFileData): Map<string, AnimationState> {
  const animationStates = new Map<string, AnimationState>();
  characterData.animations.forEach((animation) => {
    animation.states.forEach((state) => {
      animationStates.set(state.id, state);
    });
  });
  return animationStates;
}

export default class Character {
  animationStates: Map<string, AnimationState>;

  currentState: AnimationState;

  listeners: CharacterListener[];

  position: Position;

  constructor(characterData: CharacterFileData, startPosition: Position) {
    this.position = startPosition;
    this.animationStates = getAnimationGraph(characterData);
    const initialState = this.animationStates.get(characterData.initialState);
    if (!initialState) {
      throw new Error("The initial state's ID isn't in the state graph.");
    }
    this.currentState = initialState;
    this.listeners = [];
  }

  getPosition(): Position {
    return this.position;
  }

  setPosition(newPosition: Position): void {
    this.position = newPosition;
    this.listeners.forEach((listener) => {
      listener.handleCharacterUpdate(this.currentState, this.getPosition());
    });
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
  updateSelf(relevantInfo: TransitionInfo): void {
    const nextStateID = this.currentState.transitions.default;
    if (!nextStateID) { return; }
    this.setState(nextStateID);
  }

  subscribe(listener: CharacterListener) {
    this.listeners.push(listener);
    listener.handleCharacterUpdate(this.currentState, this.getPosition());
  }

  setState(newStateID:string) {
    const nextState = this.animationStates.get(newStateID);
    if (!nextState) { return; }
    this.currentState = nextState;
    this.listeners.forEach((listener) => {
      listener.handleCharacterUpdate(this.currentState, this.getPosition());
    });
  }
}
