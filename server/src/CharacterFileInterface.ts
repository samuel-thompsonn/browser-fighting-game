export interface AnimationState {
  id: string;
  transitions: {
    default: string;
    controls: Map<string, string>;
    // Should have other transitions based on inputs
  }
  effects?: {
    move?: { // x and y movement are proportional to movementSpeed stat
      x: number;
      y: number;
    }
  }
  // Should also have a hitbox and hurtbox set
}

export interface FileAnimationState {
  id: string;
  transitions: {
    default: string;
    controls?: {
      control: string;
      destination: string;
    }[]
    // Should have other transitions based on inputs
  }
  effects?: {
    move?: { // x and y movement are proportional to movementSpeed stat
      x: number;
      y: number;
    }
  }
  // Should also have a hitbox and hurtbox set
}

export interface CharacterFileData {
  name: string;
  initialState: string;
  stats: {
    movementSpeed: number; // Units per second
  }
  animations: {
      name: string;
      states: FileAnimationState[];
  }[]
}
