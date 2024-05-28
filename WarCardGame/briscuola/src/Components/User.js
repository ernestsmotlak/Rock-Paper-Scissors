import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import "bootstrap-icons/font/bootstrap-icons.css"

const socket = io('http://84.247.184.37:3020/', {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 10000,
  randomizationFactor: 0.5,
  pingInterval: 25000, // Send a ping every 25 seconds
  pingTimeout: 60000 // Close the connection if no response is received within 60 seconds
});

const User = ({ usernameFromLogin }) => {
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [joinedRoom, setJoinedRoom] = useState(false);
  const username = usernameFromLogin; // Replace with dynamic username if needed
  const messageContainerRef = useRef(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log(`Reconnected to server after ${attemptNumber} attempts`);
      if (joinedRoom && room) {
        socket.emit('join_room', room);
      }
    });

    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Reconnection attempt ${attemptNumber}`);
    });

    socket.on('reconnect_error', (error) => {
      console.error('Reconnection error:', error);
    });

    socket.on('reconnect_failed', () => {
      console.error('Reconnection failed');
    });

    socket.on('receive_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, { ...data, isSent: false }]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('reconnect');
      socket.off('reconnect_attempt');
      socket.off('reconnect_error');
      socket.off('reconnect_failed');
      socket.off('receive_message');
    };
  }, [joinedRoom, room]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const joinRoom = () => {
    if (room !== '') {
      socket.emit('join_room', room);
      setJoinedRoom(true);
    }
  };

  const sendMessage = () => {
    if (message.trim() !== '') {
      const cleanedMessage = message
        .split('\n')
        .filter(line => line.trim() !== '')
        .join('\n');

      const data = {
        room,
        message: cleanedMessage,
        username,
        time: new Date().toISOString(),
      };
      socket.emit('send_message', data);
      setMessages((prevMessages) => [...prevMessages, { ...data, isSent: true }]);
      setMessage('');
    }
  };

  const sortedMessages = messages.sort((a, b) => new Date(a.time) - new Date(b.time));

  return (
    <div>
      {!joinedRoom ? (
        <div className='w-25 mt-5' style={{ margin: '0 auto' }}>
          <div className="card">
            <h5 className="card-header">Room</h5>
            <div className="card-body">
              <h5 className="card-title">Choose a room</h5>
              <p className="card-text">Choose the room that you prefer to join:</p>
              <input
                type="text"
                placeholder="Room ID"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className='fs-5 form-control'
              />
              <button className='ms-2 btn btn-dark mt-2' onClick={joinRoom}>Join Room</button>
            </div>
            <div className="card-footer" style={{ height: '40px' }} />
          </div>
          <div className="text-center p-3 fixed-bottom"
            style={{ backgroundColor: '#e5e5e5', borderColor: '#cdcccd', borderWidth: '1px', borderStyle: 'solid', borderRadius: '5px' }}>
            Code available at:
            &nbsp;
            <a className="text-dark" href="https://github.com/ernestsmotlak/WarCardGame">
              {/* <i className="bi bi-github" style={{ width: '20px', height: '20px' }}></i> */}
              <svg style={{ width: '20px', height: 'auto', marginBottom: '3px' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
              </svg>

            </a>
          </div>
        </div>
      ) : (
        <div className="container mt-4">
          <div className="card">
            <div className="card-header">
              <h5>Chat</h5>
            </div>
            <div className="card-body" style={{ maxHeight: '600px', overflowY: 'scroll', scrollBehavior: 'smooth' }} ref={messageContainerRef}>
              {sortedMessages.map((data, index) => (
                <div
                  key={index}
                  className={`d-flex ${data.isSent ? 'justify-content-end me-2' : 'justify-content-start'} mb-2`}
                >
                  <div>
                    <div className="row">
                      <div className="col">
                        <div className={`alert text-start ${data.isSent ? 'alert-success ms-5' : 'alert-danger'} mb-1 mt-2`} role="alert">
                          {data.message.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                              {line}
                              <br />
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <div className={`${data.isSent ? 'text-end me-3' : 'text-start ms-3'} mb-1 mt-2`}>
                          <small>{new Date(data.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - <strong>{data.username}</strong></small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="card-footer">
              <div className="input-group">
                <textarea
                  className="form-control"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="3" // You can adjust the number of rows as needed
                />
                {/* <button className="btn btn-secondary" onClick={sendMessage}>Send Message</button> */}
                <button className="btn btn-secondary" onClick={sendMessage}>
                  <svg style={{ width: '25px', height: 'auto', marginLeft: '20px', marginRight: '20px' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="text-center p-3 fixed-bottom"
            // style={{ backgroundColor: '#e5e5e5' }}
            style={{ backgroundColor: '#e5e5e5', borderColor: '#cdcccd', borderWidth: '1px', borderStyle: 'solid', borderRadius: '5px' }}>
            Code available at:

            &nbsp;
            <a className="text-dark" href="https://github.com/ernestsmotlak/WarCardGame">
              {/* <i className="bi bi-github" style={{ width: '20px', height: '20px' }}></i> */}
              <svg style={{ width: '20px', height: 'auto', marginBottom: '3px' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
              </svg>

            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
