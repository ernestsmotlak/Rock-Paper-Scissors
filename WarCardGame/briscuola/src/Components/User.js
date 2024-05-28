import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Game from './Game';

const socket = io('http://localhost:3023/', {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 10000,
  randomizationFactor: 0.5,
  pingInterval: 25000,
  pingTimeout: 60000
});

const User = ({ usernameFromLogin }) => {
  const [room, setRoom] = useState('');
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [choice, setChoice] = useState('');
  const [opponentChoice, setOpponentChoice] = useState('');
  const username = usernameFromLogin;

  const [roundHistory, setroundHistory] = useState([]);

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

    socket.on('receive_choice', (data) => {
      setOpponentChoice(data.choice);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('reconnect');
      socket.off('receive_choice');
    };
  }, [joinedRoom, room]);

  const joinRoom = () => {
    if (room !== '') {
      socket.emit('join_room', room);
      setJoinedRoom(true);
    }
  };

  const sendChoice = (userChoice) => {
    setChoice(userChoice);
    socket.emit('send_choice', { room, choice: userChoice });
  };

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
        </div>
      ) : (


        <div className="container mt-4">
          <div className="text-center">
            <h2>Choose Rock, Paper, or Scissors</h2>
            <h3 className='bg-secondary-subtle w-50' style={{ margin: '0 auto' }}>My username: {username}</h3>
            <div className="btn-group mt-3">
              <button className="btn btn-primary" onClick={() => sendChoice('Rock')}>Rock</button>
              <button className="btn btn-primary" onClick={() => sendChoice('Paper')}>Paper</button>
              <button className="btn btn-primary" onClick={() => sendChoice('Scissors')}>Scissors</button>
            </div>
            <div className="mt-4">
              {/* <h4>Your Choice: {choice}</h4>
              <h4>Opponent's Choice: {opponentChoice}</h4> */}

              <Game choice={choice} opponentChoice={opponentChoice} />

            </div>
          </div>
        </div>


      )}
    </div>
  );
};

export default User;
