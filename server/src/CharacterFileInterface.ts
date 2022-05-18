export interface CollisionRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface HitboxRectangle {
  collisionBox: CollisionRectangle;
  damage: number;
  knockback: number;
}

export interface CollisionData {
  hurtbox?: {
    rectangles: CollisionRectangle[];
  };
  hitbox?: {
    rectangles: HitboxRectangle[];
  };
}

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
  collisions?: CollisionData;
  // Should also have a hitbox and hurtbox set
}

export interface FileCollisionData {
  hurtbox?: {
    rectangles: CollisionRectangle[];
  }
  hitbox?: {
    rectangles: HitboxRectangle[];
  }
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
  };
  collisions?: FileCollisionData;
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
    maxHealth: number;
  }
  animations: {
      name: string;
      states: FileAnimationState[];
  }[]
}

export interface FileAnimationDescription {
  name: string;
  id: string;
  numFrames: number;
  state: {
    transitions: {
      default: string;
      controls?: {
        control: string;
        destination: string;
      }[]
    }
    collisions?: FileCollisionData;
  }
}

export interface SimpleCharacterFileData {
  name: string;
  initialState: string;
  stats: {
    movementSpeed: number; // Units per second
    maxHealth: number;
  }
  animations: FileAnimationDescription[];
}
