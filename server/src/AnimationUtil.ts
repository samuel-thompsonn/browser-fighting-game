export interface AnimationState {
  id: string;
  transitions: {
    default: string;
    // Should have other transitions based on inputs
  }
  // Should also have a hitbox and hurtbox set
}

export interface TransitionInfo {
  default: string;
}

export interface AnimationGraph {
  name: string;
  states: AnimationState[];
}

export interface CharacterFileData {
  name: string;
  initialState: string;
  animations: {
      name: string;
      states: AnimationState[];
  }[]
}

export interface Position {
  x: number;
  y: number;
}

export interface PlayerInputs {
  right: boolean;
  left: boolean;
  lightAttack: boolean;
  heavyAttack: boolean;
}
