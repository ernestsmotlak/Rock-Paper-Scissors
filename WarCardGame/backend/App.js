const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = 3020;

app.use(cors());
app.use(bodyParser.json());

// Connect to SQLite database
const db = new sqlite3.Database('War-database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// HTTP server setup
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to the Chat App API!');
});

app.post('/register', (req, res) => {
    const { username, password, passwordAgain } = req.body;

    const checkIfUserExists = 'SELECT * FROM User WHERE Username = ?';

    db.get(checkIfUserExists, [username], (err, user) => {
        if (err) {
            console.error('Error checking for username:' + err.message);
            return res.status(500).json({ error: 'Internal server error.', registrationReturn: false });
        }

        if (user) {
            return res.status(400).json({ error: 'Username already exists, pick another username!', registrationReturn: false });
        }

        // If username doesn't exist, proceed with registration
        if (password === passwordAgain) {
            const insertIntoUser = 'INSERT INTO User (Username, Password, Uuid) VALUES (?, ?, ?)';

            db.run(insertIntoUser, [username, password, generateUniqueUserID()], (err) => {
                if (err) {
                    console.error('Error inserting username and password: ', err.message);
                    return res.status(500).json({ error: 'Internal server error!', registrationReturn: false });
                }

                res.json({ message: 'User ' + username + ' registered successfully!', registrationReturn: true });
            });
        } else {
            res.status(400).json({ error: 'Passwords do not match!', registrationReturn: false });
        }
    });
});

function generateUniqueUserID() {
    let uniqueID = '';
    while (uniqueID.length < 64) {
        uniqueID += Math.random().toString(36).substring(2, 15);
    }
    return uniqueID.substring(0, 64); // Trim to ensure the length is exactly 64
}

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const checkCredentials = 'SELECT Username, Uuid FROM User WHERE Username = ? AND Password = ?';
    db.get(checkCredentials, [username, password], (err, user) => {
        if (err) {
            console.error('Error executing query: ' + err.message);
            return res.status(500).json({ error: 'Internal server error.', loginStatus: false });
        }

        if (!user) {
            return res.status(401).json({ error: 'No user found.', loginStatus: false });
        }

        res.json({ message: 'Login successful. User ' + username + ' logged in successfully!', loginStatus: true, uniqueUserID: user.Uuid, usernameLogin: user.Username });
    });
});

// Socket.io setup
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join_room', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });
    socket.on('send_message', (data) => {
        // io.to(room).emit('receive_message', message);
        socket.broadcast.to(data.room).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
