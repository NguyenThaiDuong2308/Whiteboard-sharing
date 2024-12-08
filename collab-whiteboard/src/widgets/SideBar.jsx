// src/components/SideBar.js
import React, { useContext, useEffect, useState } from 'react';
import '../widgets_css/SideBar.css';
import { WebSocketContext } from '../WebSocketContext';

function SideBar() {
    const { message, sendMessage } = useContext(WebSocketContext);
    const [userList, setUserList] = useState([]); // Khởi tạo `userList` như một mảng rỗng
   const[roomId, setRoomId] =useState();
    useEffect(() => {
        if (message) {
            try {
                const parsedMessage = JSON.parse(message);
                // Kiểm tra nếu `parsedMessage` có chứa `data` là `userList`
                if (parsedMessage.tag === 'updateUserList' && parsedMessage.data) {
                    setUserList(parsedMessage.data.userList || []); 
                    setRoomId(parsedMessage.data.userList[0].roomId);// Cập nhật `userList` từ tin nhắn
                    console.log(`Number of users in the room: ${parsedMessage.data.userList.length}`);
                    console.log(roomId);
                }
            } catch (error) {
                console.error("Error parsing message:", error);
            }
        }
    }, [message]); // Chạy khi `message` thay đổi
    const copyToClipboard = () => {
        navigator.clipboard.writeText(roomId)
            .then(() => {
                alert('Room ID copied to clipboard');
            })
            .catch((error) => {
                console.error('Failed to copy: ', error);
            });
    };
    return (
        <div className="sidebar">
            <div className="room-info">
                <h2>Whiteboard Sharing</h2>
                <p>Room ID: {roomId}</p>
                <button onClick={copyToClipboard} className="copy-button">
                        Copy
                    </button>
            </div>
            <div className="user-list">
                <h3>Users</h3>
                <p>Number of Users: {userList.length}</p> {/* Hiển thị số lượng người dùng */}
                <ul>
                    {userList.map((user) => (
                        <li key={user.id}>{user.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default SideBar;
