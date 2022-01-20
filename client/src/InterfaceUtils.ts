export interface CharacterUpdate {
  id: string;
  position: Position;
  state: string;
  health: number;
};

export interface Position {
  x: number;
  y: number;
};

export interface ControlsEventHandler {
  key: string;
  onPress?: () => void;
  onRelease?: () => void;
}