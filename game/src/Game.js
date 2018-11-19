import React, {Component} from 'react';
import GameBoard from './GameBoard';
import GameOver from './GameOver';
import Promise from 'promise';

//the direction of moving
const Move_Dir = {
    up:[0,-1],
    down:[0,1],
    left:[-1,0],
    right:[1,0]
};

let tileUUID = 0;

export default class Game extends Component {
    constructor (props) {
        super(props);
        this.state = this.getInitialState();
    }

    componentDidMount() {
        this.newTile();
        this.newTile();
        this.handleKeyPress = this.handleKeyPress.bind(this);
        window.addEventListener('keydown', this.handleKeyPress);
    }

    componentWillMount() {
        window.removeEventListener('keydown', this.handleKeyPress);
    }

    handleKeyPress (event) {
        let {key} = event;
        if (!this.state.gameStarted) return;
        let match = key.toLowerCase().match(/arrow(up|right|down|left)/);
        if (match) {
            this.move(match[1]);
            event.preventDefault();
        }
    }

    getInitialState() {
        let size = this.props.size || 4;
        let cells = [];
        for (let i = 0; i < size; i++) {
            let row = cells[i] = [];
            for (let j = 0; j < size; j++) {
                row[j] = null;
            }
        }
        return {
            size, cells,
            gameStarted: true,
            additionScores: [],
            score: 0,
            bestScore: +localStorage.getItem('bestScore')
        };
    }
    
    eachCell (state, fn) {
        return state.cells.forEach((row, i) =>
            row.forEach((cell, j) => fn(cell, i, j))
        );
    }

    newTile() {
        this.setState(state => {
            let cells = this.state.cells;
            let emptyCells = [];
            this.eachCell(state, (cell, i, j) => {
                if (!cell) {
                    emptyCells.push([i, j]);
                } else if (cell.mergedItem) {
                    cell.number += cell.mergedItem.number;
                    cell.newMerged = true;
                }
            });
            if (emptyCells.length) {
                let index = Math.floor(Math.random() * emptyCells.length);
                let [row, cell] = emptyCells[index];
                cells[row][cell] = {
                    number: Math.random() > 0.9 ? 4 : 2,
                    newGenerated:true,
                    newMerged:true,
                    mergedItem:null,
                    uuid:tileUUID++
                };
            }
            return {cells};
        });
    }

    isMovable() {
        let movable = false;
        let cells = this.state.cells;
        let size = this.state.size;
        this.eachCell(this.state,(cell, i, j) => {
            if (movable) return;
            if (!cell) {
                movable = true;
                return;
            }
            if (i < size-1) {
                let bottomCell = cells[i+1][j];
                if (bottomCell && bottomCell.number === cell.number) {
                    movable =true;
                    return;
                }
            }
            if (j < size-1) {
                let rightCell = cells[i][j+1];
                if (rightCell && rightCell.number === cell.number) {
                    movable = true;
                    return;
                }
            }
        });
        return movable;
    }

    sleep (ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    move (dir) {
        if (this.isMoving) return;
        let size = this.state.size;
        let cells = this.state.cells;
        let dirOffset = Move_Dir[dir];
        let hasMovingTile = false;
        let score = 0;

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                let row = i, col = j;
                if (dir === 'right') {
                    col = size - j - 1;
                }
                if (dir === 'down') {
                    row = size - i - 1;
                }

                let cell = cells[row][col];
                if (!cell) continue;

                cell.newGenerated = false;
                cell.newMerged = false;
                cell.mergedItem = null;

                let nextCol = col + dirOffset[0];
                let nextRow = row + dirOffset[1];
                let nextCell;

                while(nextCol >= 0 && nextCol < size && nextRow >= 0 && nextRow < size) {
                    nextCell = cells[nextRow][nextCol];
                    if (nextCell) {
                        break;
                    }
                    nextCol += dirOffset[0];
                    nextRow += dirOffset[1];
                }
                
                if (nextCell && !nextCell.mergedItem && nextCell.number === cell.number) {
                    cell.mergedItem =nextCell;
                    cells[nextRow][nextCol] = cell;
                    cells[row][col] = null;
                    hasMovingTile = true;
                    score += nextCell.number + cell.number;
                } else {
                    nextCol -= dirOffset[0];
                    nextRow -= dirOffset[1];

                    if (nextCol !== col || nextRow !== row) {
                        cells[nextRow][nextCol] = cell;
                        cells[row][col] = null;
                        hasMovingTile = true;
                    }
                }
            }
        }

        if (hasMovingTile) {
            this.isMoving = true;

            this.setState(state => {
                let nextState = {
                    cells,
                    score:state.score + score
                };
                if (score) {
                    nextState.additionScores = [...state.additionScores, {score, key: 'score' + Date.now()}];
                }
                return nextState;
            });


            this.sleep(80)
                .then(()=> {
                    this.newTile();
                    this.checkGameStatus();
                    this.isMoving = false;
                });
        }
    }

    checkGameStatus() {
        let movable = this.isMovable();
        if(!movable) {
            let bestScore = this.state.bestScore;
            if (bestScore < this.state.score) {
                bestScore = this.state.score;
                localStorage.setItem('bestScore', bestScore);
            }
            this.setState({gameStarted:false, bestScore});
        }
    }

    render() {
        return (
            <div>
                <GameBoard
                {...this.state}
                onAdditionScoreAnimationEnd = {this.handleAdditionScoreAnimationEnd.bind(this)}
                onNewGame={this.startNewGame.bind(this)}
                onSwipe={this.move.bind(this)}
                >
                {!this.state.gameStarted &&
                    <GameOver onNewGame={this.startNewGame.bind(this)}></GameOver>
                }
                </GameBoard>
            </div>
        );
    }

    handleAdditionScoreAnimationEnd(event, scoreItem, index) {
        this.setState(state => {
            let additionScores = state.additionScores;
            return {additionScores:[...additionScores.slice(0,index), ...additionScores.slice(index+1)]};
        });
    }

    startNewGame() {
        setTimeout(() => {
            tileUUID = 0;
            this.setState(this.getInitialState());
            this.newTile();
            this.newTile();
        }, 0);
    }
}