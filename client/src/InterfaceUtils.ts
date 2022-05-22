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
  collisionData?: CollisionDataItem[];
};

export interface AnimationDescription {
  id: string;
  numFrames: number;
  filePath: string;
  offset: {
    x: number;
    y: number;
  }
  frameSize: {
    width: number;
    height: number;
  }
  stride: number;
  statesPerFrame?: number;
}

export interface CollisionRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}


export interface CollisionProperty {
  propertyName: string;
  valueType?: string;
  propertyValue: string;
}

export interface CollisionDataItem {
  entityType: string;
  properties?: CollisionProperty[];
  rectangles: CollisionRectangle[];
}

export interface CharacterUpdate {
  id: string;
  position: Position;
  state: string;
  healthInfo: {
    health: number;
    maxHealth: number;
  };
  collisionInfo: CollisionDataItem[];
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