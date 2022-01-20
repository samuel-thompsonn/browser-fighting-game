import animationData from "./animation/idle1/characterA.json";
import { Position } from './InterfaceUtils';

interface AnimationState {
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
};

class Visualizer {
  images: Map<string, HTMLImageElement>;
  currentState: AnimationState|undefined;
  animationStates: Map<string, AnimationState>;
  currentPosition: Position;

  constructor() {
    this.currentPosition = {
      x: 0,
      y: 0
    };
    this.animationStates = new Map<string, AnimationState>();
    const loadedImages = new Map<string, HTMLImageElement>();
    this.images = new Map();
    for (let animationState of animationData.character1_idle) {
      let image = loadedImages.get(animationState.sprite.file);
      if (!image) {
        image = new Image();
        image.src = `../sprites/${animationState.sprite.file}`;
        image.onerror = (event) => {
          console.log(event);
          console.log("FAILED TO LOAD AN IMAGE")
        }
        loadedImages.set(animationState.sprite.file, image);
      }
      this.animationStates.set(animationState.id, {
        id: animationState.id,
        image: image,
        imageOffset: animationState.sprite.offset,
        imageSize: animationState.sprite.size
      });
      this.currentState = this.animationStates.get(animationData.character1_idle[0].id);
    }
  }

  setAnimationState(newState: string) {
    if (this.animationStates.has(newState)) {
      this.currentState = this.animationStates.get(newState);
    }
    else {
      console.log(`Visualizer doesn't have state ${newState}. Aborting...`);
    }
  }

  setPosition(newPosition: Position) {
    this.currentPosition = newPosition;
  }

  drawSelf(
    canvas: CanvasRenderingContext2D,
  ):void {;
    if (!this.currentState) { return; }
    canvas.drawImage(
      this.currentState.image,
      this.currentState.imageOffset.x,
      this.currentState.imageOffset.y,
      this.currentState.imageSize.width,
      this.currentState.imageSize.height,
      this.currentPosition.x, 
      this.currentPosition.y,
      this.currentState.imageSize.width,
      this.currentState.imageSize.height
    );
  }
}

export default Visualizer;