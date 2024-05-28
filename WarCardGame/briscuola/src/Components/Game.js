import React from 'react'
import { useState } from 'react'

const Game = (props) => {
    const [gameHistory, setgameHistory] = useState([]);

    const game = (me, opponent) => {
        if (me === opponent) {
            return 'tie, play again!';
        }

        if (me === 'Rock' && opponent === 'Scissors') {
            return 'won';
            // send 'lost';
        }

        if (me === 'Rock' && opponent === 'Paper') {
            return 'lost';
            // send 'won';
        }

        if (me === 'Scissors' && opponent === 'Paper') {
            return 'won';
            // send 'lost';
        }

        if (me === 'Scissors' && opponent === 'Rock') {
            return 'lost';
            // send 'won';
        }

        if (me === 'Paper' && opponent === 'Rock') {
            return 'won';
            // send 'lost';
        }

        if (me === 'Paper' && opponent === 'Scissors') {
            return 'lost';
            // send 'won';
        }
    };

    return (
        <div>
            <h4>Your Choice: {props.choice}</h4>
            <h4>Opponent's Choice: {props.opponentChoice}</h4>
            <br />
            Results: {game(props.choice, props.opponentChoice)}
        </div>
    )
}

export default Game