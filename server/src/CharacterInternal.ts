import { Position } from "./AnimationUtil";

export default interface CharacterInternal {
  getCurrentHealth: () => number;
  setCurrentHealth: (newValue: number) => void;
  getPosition: () => Position;
  setPosition: (newPosition: Position) => void;
  changePosition: (deltaPosition: Position) => void;
  setNextState: (stateID: string) => void;
  getKnockbackStrength: () => number;
};