import "./Board.css";
import Tile from "../Tile/Tile"
import Border from "../Border/Border"


function render_horizontal_border (horizontalAxis: string[], board: any[]){
  board.push(<Border text={""} axis="C"/>)
  for (let i = 0; i < horizontalAxis.length; i++) {
    board.push(<Border text={horizontalAxis[i]} axis="H"/>)
  }
  board.push(<Border text={""} axis="C"/>)
}

function render_board_vertical_border(horizontalAxis: string[], verticalAxis:string[], board: any[], addition: number){
  for (let j = verticalAxis.length - 1; j >= 0; j--) {
    board.push(<Border text={verticalAxis[j]} axis="V"/>)
    for (let i = 0; i < horizontalAxis.length; i++) {
        const number = j + i + addition;
        let image = "";

        // pieces.forEach(p => {
        //   if(p.x_pos == i && p.y_pos == j){
        //     image=p.image
        //   }
        // })

        board.push(<Tile image={image} color={number}/>)
    }
    board.push(<Border text={verticalAxis[j]} axis="V"/>)
    
  }
}

function render_board(starter: boolean){
  let board: any[] = [];
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