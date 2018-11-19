import React from 'react';
import './GameOver.css';

export default function GameOver ({onNewGame}) {
    return <div className="gameOver">
        <h1 className= "title">Game Over!</h1>
        <button onClick={onNewGame}>Restart?</button>
    </div>;
}