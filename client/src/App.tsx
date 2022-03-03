import Canvas from "./Canvas";
import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import Visualizer from "./Visualizer";
import { CharacterUpdate } from "./InterfaceUtils";
import ControlsHandler from "./ControlsHandler";
import controlsMap from './ControlsMap.json'
import { ControlsEventHandler } from "./InterfaceUtils";

function App() {

  const [visualizers] = useState<Map<string, Visualizer>>(
    new Map()
  );

  const [controlsHandler] = useState<ControlsHandler>(initControlsHandler());

  const socket = useRef<Socket>(initSocket());
  
  function initControlsHandler(): ControlsHandler {
    let controlsHandlers: ControlsEventHandler[] = Object.entries(controlsMap).map(([controlLabel, controlKey]) => ({
      key: controlKey,
      onPress: () => {
        console.log(`Pressed ${controlLabel}`)
        socket.current.emit('controlsChange', {
          'control': controlLabel,
          'status': 'pressed'
        })
      },
      onRelease: () => {
        console.log(`Released ${controlLabel}`)
        socket.current.emit('controlsChange', {
          'control': controlLabel,
          'status': 'released'
        })
      }
    }));
    console.log(controlsHandlers);
    return new ControlsHandler(...controlsHandlers);
  }

  function initSocket() {
    console.log("Actually instantiating the scoket...");
    return io('http://localhost:3001');
  }


  const initSocketIo = (newSocket:Socket) => {
    newSocket.on('accepted_connection', () => {
      console.log("Received 'accepted_connection' signal!");
      console.log("Requesting character creation...");
      newSocket.emit('createCharacter');
    });
    newSocket.on('updateCharacter', (update:CharacterUpdate) => {
      console.log("Received an update!")
      console.log(update);
      let targetVisualizer = visualizers.get(update.id);
      if (!targetVisualizer) {
        console.log(`No visualizer with id ${update.id} -- creating one!`);
        targetVisualizer = new Visualizer();
        visualizers.set(update.id, targetVisualizer);
      }
      targetVisualizer.setAnimationState(update.state, update.collisionInfo);
      targetVisualizer.setPosition(update.position);
    });

    newSocket.on('removeCharacter', (removedCharacterIndex:string) => {
      visualizers.delete(removedCharacterIndex);
    });
  }

  const handleKeyDown = (event:KeyboardEvent) => {
    controlsHandler.keyPressed(event.key);
  }

  const handleKeyUp = (event:KeyboardEvent) => {
    controlsHandler.keyReleased(event.key);
  }

  useEffect(() => {
    console.log("Initializing socket...");
    initSocketIo(socket.current);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
  }, []);


  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Canvas visualizers={visualizers}/>
      </header>
    </div>
  );
}

export default App;
