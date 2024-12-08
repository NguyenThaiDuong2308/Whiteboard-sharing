import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WebSocketContext } from '../WebSocketContext'; // Import the WebSocket context

const CreateRoomForm = ({ setUser }) => {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  // const socket = useContext(WebSocketContext); // Access WebSocket from context
  const { message, sendMessage } = useContext(WebSocketContext)
  
  let roomCreateAcceptance = 'pending';
  let roomJoinAcceptance = 'pending';
  let roomCode = '';
  
  const handleCreateRoom = (e) => {
    e.preventDefault();
    const requestData = {
      userName,
      roomId
    };
    setUser(requestData);
    console.log(requestData);
    /*
    * flow:
    - send a create room request
    - server try to resolve it
    - after the request is accepted, it send acceptance
    - server try to put user in that room
    - if succeed, it send acceptance
    */
    // socket.send(JSON.stringify({ tag: 'createRoomRequest', data: requestData }))
    sendMessage('createRoomRequest', requestData)
  }
  useEffect(() => {
    if (!message) {
      console.log('no message')
      return
    }
    
    console.log(`Received message =>_${message}_<=`);
    const parseMessage = JSON.parse(message)
    
    console.log(message)
    console.log(parseMessage.tag)
    
    switch (parseMessage.tag) {
      case 'createRoomAndJoinRequestAccepted':
      roomCreateAcceptance = 'accepted';
      roomJoinAcceptance = 'accepted';
      roomCode = parseMessage.data.roomId;
      
      break;
      default:
      // Optional: Handle unexpected tags
      console.log('Unknown message tag:', message.tag);
      break;
    }
    
    console.log({
      roomCreateAcceptance: roomCreateAcceptance,
      roomJoinAcceptance: roomJoinAcceptance,
      roomCode: roomCode
    })
    
    if (roomCreateAcceptance === 'rejected') {
      alert(`Cannot create room`)
    } else if (roomJoinAcceptance === 'rejected') {
      alert(`Join Request Not Accepted`)
    } else if (roomCreateAcceptance === 'accepted' && roomJoinAcceptance === 'accepted') {
      navigate(`/${roomCode}`);
    }
  }, [message])
  
  
  return (
    <form className="form col-md-12 mt-5">
    <div className="form-group">
    <input type="text"
    className="form-control my-2"
    placeholder="Enter you name"
    value={userName}
    onChange={(e) => setUserName(e.target.value)}
    />
    </div>
    <div className="form-group border">
    
    {/* <div className="input-group d-flex gap-1 align-items-center justify-content-center">
      <input id="roomId"
      type="text"
      value={roomId}
      className="form-control my-2 border-0"
      disabled
      placeholder="Generate room code"
      />
      <div className="input-group-append">
      <button className="btn btn-primary btn-sm me-1"
      onClick={() => setRoomId(uuid)}
      type="button">
      generate
      </button>
      <button className="btn btn-outline-danger btn-sm me-2"
      onClick={copyText}
      type="button">
      copy
      </button>
      </div>
      </div> */}
      </div>
      <button type="submit"
      className="mt-4 btn btn-primary btn-block form-control"
      onClick={handleCreateRoom}>
      Generate Room
      </button>
      </form>
    );
  };
  export default CreateRoomForm;