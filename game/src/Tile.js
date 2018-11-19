import React, {Component} from 'react';
import './Tile.css'

const Tile_Width = 100;
const Tile_Gap = 10;

class Tile extends Component {
    render() {
        let{cell, col, row} = this.props;
        //the defination of the tile classes
        let classMap = {
            tile: true,
            [`tile-${cell.number}`]: true,
            //Mark the new tile
            'tile-new': cell.newGenerated,
            //Mark the new tile which is merged
            'tile-merged': !!cell.newMerged
        };
        let classNames = Object.keys(classMap).filter(cls => !!classMap[cls]).join(' ');
        let x = col * (Tile_Width + Tile_Gap) + 'px';
        let y = row * (Tile_Width + Tile_Gap) + 'px';
        let style = {
            transform: `translate3d(${x}, ${y}, 0)`
        };
        return (
            <div className={classNames} style={style}>
                <div className = "tile-inner">{cell.number}</div>
            </div>
        );
    }
}

export default Tile;