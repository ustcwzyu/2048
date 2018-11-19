import React, { Component } from 'react';
import ScoreBoard from './ScoreBoard';
import Tile from './Tile';
import './GameBoard.css';

class TileContainer extends Component {
    getTiles () {
        return this.props.cells.reduce((tiles, row, i) =>
            row.reduce((tiles, cell, j) => {
                if (cell) {
                    tiles.push({cell, row: i, col :j});
                    if (cell.mergediTem) {
                        tiles.push({cell: cell.mergediTem, row : i , col : j});
                    }
                }
                return tiles;
            }, tiles)
        ,[])
        .sort((a, b) => a.cell.uuid - b.cell.uuid)
        .map(tile => <Tile key={'tile'+tile.cell.uuid} cell={tile.cell} col={tile.col} row={tile.row}></Tile>);
    }

    render() {
        return (
            <div className="tileContainer">
                {this.getTiles()}
            </div>
        );
    }
}

class GridContainer extends Component {
    shouldComponentUpdate({nextSize}) {
        let {size} = this.props;
        return size !== nextSize;
    }

    getGrids() {
        let {size} = this.props;
        let row = i =>
            new Array(size).fill().map((_, j) =>
                <div className = "gridCell" key={`gridCell${i * size + j}`}></div>
        );
        return new Array(size).fill().map((_, i) => row(i));
    }

    render() {
        return (
            <div className="gridContainer">{this.getGrids()}</div>
        );
    }
}

export default function GameBoard (props) {
    return (
        <div className="gameBoard">
            <ScoreBoard {...props}/>
            <div className="gameBox">
                <GridContainer size={props.size}/>
                <TileContainer cells={props.cells}/>
                {props.children}
            </div>
        </div>
    );
}