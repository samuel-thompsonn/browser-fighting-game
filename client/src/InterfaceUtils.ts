export interface AnimationState {
  id: string;
  image: HTMLImageElement;
  imageOffset: {
    x: number;
    y: number;
  };
  imageSize: {
    width: number;
    height: number;
  }
  collisionData?: CollisionData;
};

export interface CollisionRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CollisionData {
  hitbox?: {
    rectangles: CollisionRectangle[];
  }
  hurtbox?: {
    rectangles: CollisionRectangle[];
  }
}


export interface CharacterUpdate {
  id: string;
  position: Position;
  state: string;
  healthInfo: {
    health: number;
    maxHealth: number;
  };
  collisionInfo: CollisionData;
}

export interface Position {
  x: number;
  y: number;
};

export interface ControlsEventHandler {
  key: string;
  onPress?: () => void;
  onRelease?: () => void;
}