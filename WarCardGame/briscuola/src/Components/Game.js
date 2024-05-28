import React, { useState, useEffect } from 'react';

const Game = (props) => {
    const [gameHistory, setGameHistory] = useState([]);
    const results = ['tie, play again!', 'won', 'lost'];

    useEffect(() => {
        const playGame = (me, opponent) => {
            let result;
            if (me === opponent) {
                result = results[0];
            } else if (
                (me === 'Rock' && opponent === 'Scissors') ||
                (me === 'Scissors' && opponent === 'Paper') ||
                (me === 'Paper' && opponent === 'Rock')
            ) {
                result = results[1];
            } else {
                result = results[2];
            }
            setGameHistory(prevHistory => [...prevHistory, result]);
        };

        playGame(props.choice, props.opponentChoice);
    }, [props.choice, props.opponentChoice]);

    return (
        <div>
            <h4>Your Choice: {props.choice}</h4>
            <h4>Opponent's Choice: {props.opponentChoice}</h4>
            <br />
            Current game: 
            {gameHistory[gameHistory.length - 1]}
            <br />
            Results: {gameHistory}
            <br />
        </div>
    )
}

export default Game;
