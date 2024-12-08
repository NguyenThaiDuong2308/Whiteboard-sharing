import React, { useContext } from 'react';
import { WebSocketContext } from '../WebSocketContext'; // Import the WebSocket context
import CreateRoomForm from "./CreateForm";
import '../widgets_css/Form.css';
import JoinRoomForm from "./JoinForm";

const Form = ({ setUser }) => {
  const socket = useContext(WebSocketContext); //? Access the WebSocket instance from context
  return (
    <div className="row h-100 pt-5">
      <div className="col-md-4 mt-5 form-box p-5 border border-primary rounded-2 mx-auto d-flex flex-column align-items-center">
        <h1 className="text-primary fw-bold">Create Room</h1>
        <CreateRoomForm setUser={setUser}></CreateRoomForm> {/* remove socket={socket} */}
      </div>
      <div className="col-md-4 mt-5 form-box p-5 border border-primary rounded-2 mx-auto d-flex flex-column align-items-center">
        <h1 className="text-primary fw-bold">Join Room</h1>
        <JoinRoomForm setUser={setUser} ></JoinRoomForm> {/* remove socket={socket} */}
      </div>
    </div>
  );
};
export default Form;