import "./Board.css";
import Tile from "../Tile/Tile";
import Border from "../Border/Border";
import {useRef, useState} from "react";

interface Piece {
  image: string;
  x_pos: number;
  y_pos: number;
}

const initialBoardState: Piece[] = [];

function render_pieces(
  pieces: Piece[],
  starter: boolean
){
  const w_pawns_y = starter ? 1:6;
  const b_pawns_y = starter ? 6:1;

  const w_pieces_y = starter ? 0:7;
  const b_pieces_y = starter ? 7:0;
  for (let color = 0; color < 2; color++) {
    const type = color === 0 ? "b" : "w";
    const y_pos = color === 0 ? b_pieces_y : w_pieces_y;
    const pawns_y = color === 0 ? b_pawns_y : w_pawns_y;
    pieces.push({ image: `images/pieces/${type}_rook.png`, x_pos: 0, y_pos });
    pieces.push({ image: `images/pieces/${type}_rook.png`, x_pos: 7, y_pos });
    pieces.push({ image: `images/pieces/${type}_knight.png`, x_pos: 1, y_pos });
    pieces.push({ image: `images/pieces/${type}_knight.png`, x_pos: 6, y_pos });
    pieces.push({ image: `images/pieces/${type}_bishop.png`, x_pos: 2, y_pos });
    pieces.push({ image: `images/pieces/${type}_bishop.png`, x_pos: 5, y_pos });
    pieces.push({ image: `images/pieces/${type}_queen.png`, x_pos: 3, y_pos });
    pieces.push({ image: `images/pieces/${type}_king.png`, x_pos: 4, y_pos });
    for (let i = 0; i < 8; i++) {
      pieces.push({ image: `images/pieces/${type}_pawn.png`, x_pos: i, y_pos: pawns_y });
    }
  }
}

function render_horizontal_border(
  horizontalAxis: string[],
  board: JSX.Element[]
) {
  board.push(<Border text={""} axis="C" />);
  for (let i = 0; i < horizontalAxis.length; i++) {
    board.push(<Border text={horizontalAxis[i]} axis="H" />);
  }
  board.push(<Border text={""} axis="C" />);
}

function render_board_vertical_border(
  pieces: Piece[],
  horizontalAxis: string[],
  verticalAxis: string[],
  board: JSX.Element[],
  addition: number
) {
  for (let j = verticalAxis.length - 1; j >= 0; j--) {
    board.push(<Border text={verticalAxis[j]} axis="V" />);
    for (let i = 0; i < horizontalAxis.length; i++) {
      const number = j + i + 2;
      let image = "";

      pieces.forEach((p) => {
        if (p.x_pos === i && p.y_pos === j) {
          image = p.image;
        }
      });

      board.push(<Tile key={`${j}, ${i}`} image={image} color={number} />);
    }
    board.push(<Border text={verticalAxis[j]} axis="V" />);
  }
}

function render_board(
  pieces: Piece[],
  starter: boolean
) {
  let board: JSX.Element[] = [];
  let verticalAxis = [];
  let horizontalAxis = [];
  let addition = null;

  if (starter) {
    verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
    horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
    addition = 2;
  } else {
    verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"].reverse();;
    horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"].reverse();
    addition = 1;
  }

  render_horizontal_border(horizontalAxis, board);
  render_board_vertical_border(pieces, horizontalAxis, verticalAxis, board, addition);
  render_horizontal_border(horizontalAxis, board);
  render_pieces(initialBoardState,starter);
  return board;
}

export default function Board() {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null)
  const [gridX, setGridX] = useState(0);
  const [gridY, setGridY] = useState(0);
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const boardRef = useRef<HTMLDivElement>(null);

  let board = render_board(pieces,true);

  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const board = boardRef.current;

    if (element.classList.contains("piece") && board) {
      setGridX(Math.floor((e.clientX - board.offsetLeft)/75));
      setGridY(Math.abs(Math.ceil((e.clientY - board.offsetTop-600)/75)));

      const x_pos = e.clientX - 30;
      const y_pos = e.clientY - 30;

      element.style.position = "absolute";
      element.style.left = `${x_pos}px`;
      element.style.top = `${y_pos}px`;

      setActivePiece(element);
    }
  }

  function movePiece(e: React.MouseEvent) {
    const board = boardRef.current;

    if (activePiece && board) {
      const minX = board.offsetLeft + 15;
      const maxX = board.offsetLeft + board.offsetWidth - 75;
      const minY = board.offsetTop + 15;
      const maxY = board.offsetTop + board.offsetHeight - 80;
      const x_pos = e.clientX - 30;
      const y_pos = e.clientY - 30;

      if (minX > x_pos) {
        activePiece.style.left = `${minX}px`;
      } else if (maxX < x_pos) {
        activePiece.style.left = `${maxX}px`;
      } else {
        activePiece.style.left = `${x_pos}px`;
      }

      if (minY > y_pos) {
        activePiece.style.top = `${minY}px`;
      } else if (maxY < y_pos) {
        activePiece.style.top = `${maxY}px`;
      } else {
        activePiece.style.top = `${y_pos}px`;
      }
    }
  }

  function dropPiece(e: React.MouseEvent) {
    const board = boardRef.current;

    if (activePiece && board) {
      const x = Math.floor((e.clientX - board.offsetLeft)/75);
      const y = Math.abs(Math.ceil((e.clientY - board.offsetTop-600)/75));
      console.log(x,y)

      setPieces(value=> {
        const pieces = value.map(p => {
          if(p.x_pos === gridX && p.y_pos === gridY) {
            p.x_pos = x;
            p.y_pos = y;
          }
          return p;
        })
        return pieces;
      });
      setActivePiece(null);
    }
  }

  return (
    <div>
      <div
        onMouseDown={(e) => grabPiece(e)}
        onMouseMove={(e) => movePiece(e)}
        onMouseUp={(e) => dropPiece(e)}
        id="board"
        ref={boardRef}
      >
        {board}
      </div>
    </div>
  );
}
