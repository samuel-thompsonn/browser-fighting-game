import { CollisionEntity } from "./CollisionEntity";

export interface CharacterDimensions {
  width: number;
  height: number;
}

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
  collisions?: CollisionEntity[];
  // Should also have a hitbox and hurtbox set
}

export interface CollisionProperty {
  propertyName: string;
  valueType?: string;
  propertyValue: string;
}

export interface FileCollisionItem {
  entityType: string;
  properties?: CollisionProperty[];
  rectangles: CollisionRectangle[];
}

export interface ControlsTransition {
  control: string;
  destination: string;
}

export interface FileAnimationState {
  id: string;
  transitions: {
    default: string;
    controls?: ControlsTransition[]
    // Should have other transitions based on inputs
  };
  collisions?: FileCollisionItem[];
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
      default: {
        destination: string;
        transitionType: string;
      };
      controls?: ControlsTransition[]
    }
    effects?: {
      move?: { // x and y movement are proportional to movementSpeed stat
        x: number;
        y: number;
      }
    }
    collisions?: FileCollisionItem[];
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
