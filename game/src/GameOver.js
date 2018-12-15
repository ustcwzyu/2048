import React from 'react';
import './GameOver.css';

//The definition of the component of gameover
export default function GameOver ({onNewGame}) {
    return <div className="gameOver">
        <h1 className= "title">Game Over!</h1>
        <button onClick={onNewGame}>Restart?</button>
    </div>;
}