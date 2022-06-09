import "./Board.css";
import Tile from "../Tile/Tile";
import Border from "../Border/Border";

interface Piece {
  image: string;
  x_pos: number;
  y_pos: number;
}

const pieces: Piece[] = [];

for (let p = 0; p < 2; p++) {
  const type = p === 0 ? "b" : "w";
  const y_pos = p === 0 ? 7 : 0;

  pieces.push({ image: `images/pieces/${type}_rook.png`, x_pos: 0, y_pos });
  pieces.push({ image: `images/pieces/${type}_rook.png`, x_pos: 7, y_pos });
  pieces.push({ image: `images/pieces/${type}_knight.png`, x_pos: 1, y_pos });
  pieces.push({ image: `images/pieces/${type}_knight.png`, x_pos: 6, y_pos });
  pieces.push({ image: `images/pieces/${type}_bishop.png`, x_pos: 2, y_pos });
  pieces.push({ image: `images/pieces/${type}_bishop.png`, x_pos: 5, y_pos });
  pieces.push({ image: `images/pieces/${type}_queen.png`, x_pos: 3, y_pos });
  pieces.push({ image: `images/pieces/${type}_king.png`, x_pos: 4, y_pos });
}

for (let i = 0; i < 8; i++) {
  pieces.push({ image: "images/pieces/w_pawn.png", x_pos: i, y_pos: 1 });
}
for (let i = 0; i < 8; i++) {
  pieces.push({ image: "images/pieces/b_pawn.png", x_pos: i, y_pos: 6 });
}


function render_horizontal_border (horizontalAxis: string[], board: JSX.Element[]){
  board.push(<Border text={""} axis="C"/>)
  for (let i = 0; i < horizontalAxis.length; i++) {
    board.push(<Border text={horizontalAxis[i]} axis="H"/>)
  }
  board.push(<Border text={""} axis="C"/>)
}

function render_board_vertical_border(horizontalAxis: string[], verticalAxis:string[], board: JSX.Element[], addition: number){
  for (let j = verticalAxis.length - 1; j >= 0; j--) {
    board.push(<Border text={verticalAxis[j]} axis="V"/>)
    for (let i = 0; i < horizontalAxis.length; i++) {
        const number = j + i + addition;
        let image = "";

        pieces.forEach(p => {
          if(p.x_pos == i && p.y_pos == j){
            image=p.image
          }
        })

      board.push(<Tile image={image} color={number} />);
    }
    board.push(<Border text={verticalAxis[j]} axis="V"/>)
    
  }
}

function render_board(starter: boolean){
  let board: JSX.Element[] = [];
  let verticalAxis = [];
  let horizontalAxis = [];
  let addition = null
  
  if (starter){
    verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
    horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
    addition = 2
  }
  else{
    verticalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
    horizontalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"].reverse();
    addition = 1
  }

  render_horizontal_border(horizontalAxis, board)
  render_board_vertical_border(horizontalAxis, verticalAxis, board, addition)
  render_horizontal_border(horizontalAxis, board)

  return board;
}


export default function Board() {
  let board = render_board(true);
  return  <div>
            <div id="board">
              {board}
            </div>
          </div>
}
