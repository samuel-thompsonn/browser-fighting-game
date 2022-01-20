import { ControlsEventHandler } from "./InterfaceUtils";

/**
 * Keeps track of which keys are currently being pressed, and generates
 * events for key press and release events in a way that ignores repeated
 * key events when you hold down a key.
 */
export default class ControlsHandler {

  keyMap: Map<string, boolean>;
  
  controlsHandlers: Map<string, ControlsEventHandler>;

  constructor(...handlers:ControlsEventHandler[]) {
    this.keyMap = new Map<string, boolean>();
    this.controlsHandlers = new Map<string, ControlsEventHandler>();
    handlers.forEach((handler) => {
      this.controlsHandlers.set(handler.key, handler);
    });
  }

  keyPressed(key: string): void {
    const testKeyValue = this.keyMap.get(key);
    if (testKeyValue === true) { return; }
    this.keyMap.set(key, true);
    const handler = this.controlsHandlers.get(key);
    if (handler) {
      handler.onPress && handler.onPress();
    }
  }

  keyReleased(key: string): void {
    const testKeyValue = this.keyMap.get(key);
    if (testKeyValue === false) { return; }
    this.keyMap.set(key, false);
    const handler = this.controlsHandlers.get(key);
    if (handler) {
      handler.onRelease && handler.onRelease();
    }
  }

}