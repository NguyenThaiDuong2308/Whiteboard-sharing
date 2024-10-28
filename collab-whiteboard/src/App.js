import React, { useEffect, useState, useContext } from 'react';
import Whiteboard from './widgets/Whiteboard';
import { Routes, Route } from 'react-router-dom';
import Form from "./widgets/Form";
import { WebSocketContext } from './WebSocketContext'; // Import WebSocket context

function App() {
  const socket = useContext(WebSocketContext); // Use WebSocket from context
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        console.log('Received from server:', msg);

        // Handle specific messages
        if (msg.tag === 'userJoinRoomRequestAccepted') {
          console.log('userJoinRoomRequestAccepted');
        } else if (msg.tag === 'userJoinRoomRequestRejected') {
          console.log('userJoinRoomRequestRejected');
        }
      };
    }
  }, [socket]);

  return (
    <div className='container'>
      <div className="container">
        <Routes>
          <Route path="/" element={<Form setUser={setUser} />} />
          <Route path="/:roomId" element={<Whiteboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
