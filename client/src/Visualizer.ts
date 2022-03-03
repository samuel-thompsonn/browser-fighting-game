import animationData from "./animation/idle1/characterA.json";
import { Position, AnimationState, CollisionData, CollisionRectangle } from './InterfaceUtils';

const CHARACTER_SIZE = 64;

function drawCollisionRectangle(
  canvas: CanvasRenderingContext2D,
  rectangle: CollisionRectangle,
  color: string
  ) {
    canvas.strokeStyle = color;
    canvas.globalAlpha = 0.5;
    canvas.strokeRect(
      rectangle.x,
      rectangle.y,
      rectangle.width,
      rectangle.height
    );
    canvas.fillStyle = color;
    canvas.globalAlpha = 0.25;
    canvas.fillRect(
      rectangle.x,
      rectangle.y,
      rectangle.width,
      rectangle.height
    );
    canvas.globalAlpha = 1.0;
}


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

  setAnimationState(newState: string, collisionInfo: CollisionData|undefined) {
    const nextState = this.animationStates.get(newState);
    if (nextState) {
      this.currentState = nextState;
      this.currentState.collisionData = collisionInfo;
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
    if (this.currentState.collisionData) {
      const drawHitbox = (
        color: string,
        hitbox: CollisionRectangle
      ) => {
        drawCollisionRectangle(canvas,
          {
            x: this.currentPosition.x + (hitbox.x * CHARACTER_SIZE),
            y: this.currentPosition.y + (hitbox.y * CHARACTER_SIZE),
            width: hitbox.width * CHARACTER_SIZE,
            height: hitbox.height * CHARACTER_SIZE,
          },
          color
        );
      };
      this.currentState.collisionData.hitbox?.rectangles.forEach((hitbox) => {
        canvas.strokeStyle = "#FFAA00";
        drawHitbox("#AA0000", hitbox.collisionBox);
      });
      this.currentState.collisionData.hurtbox?.rectangles.forEach((hurtbox) => {
        drawHitbox("#00FF55", hurtbox);
      });
    }
  }
}

export default Visualizer;