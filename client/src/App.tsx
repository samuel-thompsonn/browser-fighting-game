import Canvas from "./Canvas";
import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import Visualizer from "./Visualizer";

interface CharacterUpdate {
  id: string;
  position: {
    x: number;
    y: number;
  },
  state: string;
  health: number;
};

function App() {

  const [visualizers] = useState<Map<string, Visualizer>>(
    new Map([["0", new Visualizer()]])
  );
  
  const initSocket = () => {
    console.log("Actually instantiating the scoket...");
    return io('http://localhost:3001');
  }

  const socket = useRef<Socket>(initSocket());

  const initSocketIo = (newSocket:Socket) => {
    newSocket.on('accepted_connection', () => {
      console.log("Received 'accepted_connection' signal!");
      console.log("Requesting character creation...");
      newSocket.emit('create_character');
    });
    newSocket.on('update_character', (update:CharacterUpdate) => {
      console.log("Received an update!")
      console.log(update);
      const targetVisualizer = visualizers.get(update.id);
      if (!targetVisualizer) {
        console.log(`No visualizer with id ${update.id}`);
        return;
      }
      targetVisualizer.setAnimationState(update.state);
    });
  }

  const handleKeyDown = (event:KeyboardEvent) => {
    console.log(event.key);
    if (event.key === 'a') {
      socket.current.emit('move_left');
    }
    else if (event.key === 'd') {
      socket.current.emit('move_right');
    }
  }

  useEffect(() => {
    console.log("Initializing socket...");
    initSocketIo(socket.current);
    document.addEventListener('keydown', handleKeyDown);
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
