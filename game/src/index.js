import React from 'react';
import ReactDOM from 'react-dom';
import Game from './Game';
import './index.css';

//Generate the game by the dom API.
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
