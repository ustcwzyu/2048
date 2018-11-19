import React, { Component } from "react";
import './ScoreBoard.css';

class ScoreBox extends Component {
    shouldComponentUpdate (nextProps) {
        return this.props.score !== nextProps.score || this.props.children !== nextProps.children;
    }

    render() {
        let {label, score, children} = this.props;
        return (
            <div className="scorebox">
                <div className="scorelabel">{label}</div>
                <div className="score">{score}</div>
                {children}
            </div>
        );
    }
}

class ScoreBoard extends Component {
    shouldComponentUpdate({score, bestScore, additionScores}) {
        let props = this.props;
        return props.score !== score ||
            props.bestScore !== bestScore ||
            props.additionScores !== additionScores;
    }

    render() {
        let props = this.props;
        return(
            <div className="scoreBoard">
                <h1 className="title">2048</h1>
                <ScoreBox score={props.score} label="Score">
                    {
                        props.additionScores.map((score, i) => 
                        <div className = "additionScore" key={score.key}
                        onAnimationEnd={(e) => props.onAdditionScoreAnimationEnd(e, score, i)}
                        >+{score.score}</div>)
                    }
                </ScoreBox>
                <ScoreBox score = {props.bestScore} label="Best"></ScoreBox>
                <div className="text">
                    <span className="bold">Move and Get the Highest Score</span>
                </div>
                <button className="newGame" onClick={props.onNewGame}>Restart</button>
            </div>
        );
    }
}

export default ScoreBoard;