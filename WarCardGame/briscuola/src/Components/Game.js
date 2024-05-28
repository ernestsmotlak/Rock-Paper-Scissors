import React, { useState, useEffect } from 'react';

const Game = (props) => {
    const [gameHistory, setGameHistory] = useState([]);
    const results = ['tie!', 'won', 'lost'];
    const [wins, setWins] = useState(0);

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

        if (props.choice && props.opponentChoice) {
            playGame(props.choice, props.opponentChoice);
        }
    }, [props.choice, props.opponentChoice]);

    useEffect(() => {
        const numberOfWins = (arr) => {
            let count = 0;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === 'won') {
                    count += 1;
                }
            }
            return count;
        };
        setWins(numberOfWins(gameHistory));
    }, [gameHistory]);

    return (
        <div>
            <h4>Your Choice: {props.choice}</h4>
            <h4>Opponent's Choice: {props.opponentChoice}</h4>
            <br />
            {gameHistory.length > 0 && (
                <>
                    <div className='w-25 mx-auto'>
                        <div>Current game: {gameHistory[gameHistory.length - 1]}</div>
                        <div>Results: {gameHistory.join(', ')}</div>
                    </div>

                    <br />

                    <div className="container text-center w-25">
                        <div className="row">
                            <div className="col">
                                Me:
                                <br />
                                <div className='fs-2 text-primary bg-secondary-subtle'>
                                    {wins}
                                </div>
                            </div>
                            <div className="col">
                                <br />
                                <p className='fs-2'>:</p>
                            </div>
                            <div className="col w-25">
                                Opponent:
                                <br />
                                <div className='fs-2 text-danger bg-secondary-subtle'>
                                    {gameHistory.length - wins}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Game;
