import "./Board.css";
import Tile from "../Tile/Tile";
import Border from "../Border/Border";
import React, {useRef, useState} from "react";

interface Piece {
  image: string;
  x_pos: number;
  y_pos: number;
}

interface LegalMovements {
  piece: string;
  movements: string[];
}

function mock_legal_movements(){
  legalMovements.push({piece: 'a2', movements: ['a3','a4']});
  legalMovements.push({piece: 'b2', movements: ['b3','b4']});
  legalMovements.push({piece: 'c2', movements: ['c3','c4']});
  legalMovements.push({piece: 'd2', movements: ['d3','d4']});
  legalMovements.push({piece: 'e2', movements: ['e3','e4']});
  legalMovements.push({piece: 'f2', movements: ['f3','f4']});
  legalMovements.push({piece: 'g2', movements: ['g3','g4']});
  legalMovements.push({piece: 'h2', movements: ['h3','h4']});
  legalMovements.push({piece: 'b1', movements: ['a3','c3']});
  legalMovements.push({piece: 'g1', movements: ['f3','h3']});
}

const initialBoardState: Piece[] = [];
const legalMovements: LegalMovements[] = [];

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

      const id = horizontalAxis[i].toString()+verticalAxis[j].toString();
      board.push(<Tile key={`${id}, ${j}, ${i}`} id={id} image={image} color={number} />);
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

function get_legal_movements(
    AllLegalMovements: LegalMovements[] | null,
    tile: HTMLElement
) {
  const movements: LegalMovements[] = [];
  if (AllLegalMovements){
    AllLegalMovements.forEach( function (p){
      if (p.piece === tile.id){
        p.movements.forEach(function (m) {
          let tile = document.getElementById(m);
          highlight_legal_movements(tile);
          movements.push(p);
        });
      }
    });
  }
  return movements;
}

function highlight_legal_movements(tile: HTMLElement | null)
{
    if (tile && tile.classList.contains('dark-tile')){
      tile.classList.add('legal-moviments-dark-tile');
    }
    else if (tile && tile.classList.contains('light-tile')){
      tile.classList.add('legal-moviments-light-tile');
    }
}

function unhighlight_legal_movements(){
  const dark_tiles = Array.from(document.getElementsByClassName('legal-moviments-dark-tile'));
  const light_tiles = Array.from(document.getElementsByClassName('legal-moviments-light-tile'));
  dark_tiles.forEach(function (t){t.classList.remove('legal-moviments-dark-tile');})
  light_tiles.forEach(function (t){t.classList.remove('legal-moviments-light-tile');})
}


mock_legal_movements()

export default function Board() {
  const [activeTile, setActiveTile] = useState<HTMLElement | null>(null)
  const [ActiveLegalMovements, setActiveLegalMovements] = useState<LegalMovements[] | null>(null)
  const [AllLegalMovements, setAllLegalMovements] = useState<LegalMovements[] | null>(legalMovements)
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const boardRef = useRef<HTMLDivElement>(null);

  let board = render_board(pieces,true);

  function selectPiece(e: React.MouseEvent) {
    const piece = e.target as HTMLElement;

    if (piece.classList.contains("piece")){
      // Se clicou numa peça, pega a casa em que a peça está
      const tile = piece.parentElement;

      // Se ainda não tem uma casa ativa
      if (!activeTile && piece.classList.contains("piece")) {
        if (tile && !tile.classList.contains('selected-tile')) {
          tile!.classList.add('selected-tile');
          setActiveTile(tile);
          const active: LegalMovements[] = get_legal_movements(AllLegalMovements,tile)
          setActiveLegalMovements(active);
        }
      }

      // Se já tem casa ativa
      else if (activeTile){
        // Se a casa selecionada for a ativa desseleciona
        if (activeTile === tile){
          tile!.classList.remove('selected-tile');
          unhighlight_legal_movements();
          setActiveTile(null);
          setActiveLegalMovements(null);
        }
        // Se a casa selecionada não é a ativa troca
        else{
          activeTile.classList.remove('selected-tile');
          if (tile){
            tile!.classList.add('selected-tile');
            unhighlight_legal_movements();
            setActiveTile(tile);
            setActiveLegalMovements(null);
            const active: LegalMovements[] = get_legal_movements(AllLegalMovements,tile)
            setActiveLegalMovements(active);
          }
        }
      }
    }

    // Se não clicou numa peça mas tem uma ativa desseleciona
    else if (!piece.classList.contains("piece") && activeTile){
      activeTile.classList.remove('selected-tile');
      unhighlight_legal_movements();
      setActiveLegalMovements(null);
      setActiveTile(null);
      console.log(ActiveLegalMovements)
    }
  }

  return (
    <div>
      <div
        onClick={(e) => selectPiece(e)}

        id="board"
        ref={boardRef}
      >
        {board}
      </div>
    </div>
  );
}
