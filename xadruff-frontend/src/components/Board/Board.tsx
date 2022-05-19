
import "./Board.css";
import Tile from "../Tile/Tile"

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];


interface Piece {
  image: string
  x_pos: number
  y_pos: number
}

const pieces: Piece[] =[ ]

for (let i = 0; i < 8; i++){
  pieces.push({image: 'images/pieces/w_pawn.png', x_pos:i, y_pos:1})
}
for (let i = 0; i < 8; i++){
  pieces.push({image: 'images/pieces/b_pawn.png', x_pos:i, y_pos:6})
}

export default function Board() {
  let board = [];

  for (let j = verticalAxis.length - 1; j >= 0; j--) {
    for (let i = 0; i < horizontalAxis.length; i++) {
        const number = j + i + 2;
        let image = "";

        pieces.forEach(p => {
          if(p.x_pos == i && p.y_pos == j){
            image=p.image
          }
        })

        board.push(<Tile image={image} color={number}/>)
    }
  }

  return <div id="board">{board}</div>;
}