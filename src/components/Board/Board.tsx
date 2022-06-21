import "./Board.css";
import Tile from "../Tile/Tile";
import Border from "../Border/Border";
import React, {useRef, useState} from "react";

interface Piece {
  color: string;
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
    pieces.push({ image: `images/pieces/${type}_rook.png`, x_pos: 0, y_pos, color:type });
    pieces.push({ image: `images/pieces/${type}_rook.png`, x_pos: 7, y_pos, color:type });
    pieces.push({ image: `images/pieces/${type}_knight.png`, x_pos: 1, y_pos, color:type });
    pieces.push({ image: `images/pieces/${type}_knight.png`, x_pos: 6, y_pos, color:type });
    pieces.push({ image: `images/pieces/${type}_bishop.png`, x_pos: 2, y_pos, color:type });
    pieces.push({ image: `images/pieces/${type}_bishop.png`, x_pos: 5, y_pos, color:type });
    pieces.push({ image: `images/pieces/${type}_queen.png`, x_pos: 3, y_pos, color:type });
    pieces.push({ image: `images/pieces/${type}_king.png`, x_pos: 4, y_pos, color:type });
    for (let i = 0; i < 7; i++) { // Mudar dps para 8
      pieces.push({ image: `images/pieces/${type}_pawn.png`, x_pos: i, y_pos: pawns_y, color:type});
    }
  }
  pieces.push({ image: `images/pieces/w_pawn.png`, x_pos: 2, y_pos: 5, color:'w'});
  pieces.push({ image: `images/pieces/b_pawn.png`, x_pos: 0, y_pos: 2, color:'b'});
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
) {
  for (let j = verticalAxis.length - 1; j >= 0; j--) {
    board.push(<Border text={verticalAxis[j]} axis="V" />);
    for (let i = 0; i < horizontalAxis.length; i++) {
      const number = j + i + 2;
      let image = "";
      let piece_color = "";

      pieces.forEach((p) => {
        if (p.x_pos === i && p.y_pos === j) {
          image = p.image;
          piece_color = p.color;
        }
      });

      const id = horizontalAxis[i].toString()+verticalAxis[j].toString();
      board.push(<Tile key={`${id}, ${j}, ${i} ${piece_color}`} id={id} image={image} color={number} piece_color={piece_color} />);
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
  render_board_vertical_border(pieces, horizontalAxis, verticalAxis, board);
  render_horizontal_border(horizontalAxis, board);
  render_pieces(initialBoardState,starter);
  return board;
}

mock_legal_movements()

export default function Board() {
  const starter = true;

  const player_color = starter ? 'w':'b';
  const [activeTile, setActiveTile] = useState<HTMLElement | null>(null)
  const [ActiveLegalMovements, setActiveLegalMovements] = useState<LegalMovements[] | null>(null)
  const [AllLegalMovements, setAllLegalMovements] = useState<LegalMovements[] | null>(legalMovements)

  const [gridX, setGridX] = useState(0);
  const [gridY, setGridY] = useState(0);

  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const boardRef = useRef<HTMLDivElement>(null);

  let board = render_board(pieces,starter);

  function selectPiece(e: React.MouseEvent) {
    const clicked = e.target as HTMLElement;
    const board = boardRef.current;

    // Se clicou numa peça
    if (clicked.classList.contains("piece") && board){
      const tile = clicked.parentElement;

      // Se não tem nenhuma casa ativa
      if (!activeTile &&  tile && !tile.classList.contains('selected-tile')) {
          selects_piece(tile,board,e);
          updates_active_legal_movements(tile);
      }

      // Se já tem casa ativa
      else if (activeTile && tile){
        // Se a casa selecionada for a própria ativa desseleciona
        if (activeTile === tile){
          unselect_all();
        }
        // Se a casa está nos legal movements, come
        else if (tile.classList.contains('attack-movements-dark-tile') || tile.classList.contains('attack-movements-dark-tile')){
          kills_piece(e);
        }
        // Se a casa selecionada não é a ativa, troca
        else{
          change_selected_piece(tile, board, e);
        }
      }
    }

    // Se clicou numa casa legal movements
    else if (clicked.classList.contains("legal-movements-dark-tile") || clicked.classList.contains("legal-movements-light-tile")){
      movePiece(e);
    }

    // Se clicou fora e tem casa ativa, desseleciona tudo
    else if (!clicked.classList.contains("piece") && activeTile){
      unselect_all();
    }
  }

  function get_piece_position(board: HTMLDivElement, e: React.MouseEvent){
    const x = Math.floor((e.clientX - board.offsetLeft)/75);
    const y = Math.abs(Math.ceil((e.clientY - board.offsetTop-600)/75));
    setGridX(x);
    setGridY(y);
  }

  function selects_piece(tile: HTMLElement, board: HTMLDivElement, e: React.MouseEvent){
    get_piece_position(board,e);
    tile!.classList.add('selected-tile');
    setActiveTile(tile);
  }

  function change_selected_piece(tile: HTMLElement, board: HTMLDivElement, e: React.MouseEvent){
    activeTile!.classList.remove('selected-tile');
    if (tile){
      selects_piece(tile,board,e);
      updates_active_legal_movements(tile);
    }
  }

  function movePiece(e: React.MouseEvent) {
    const board = boardRef.current;
    if (activeTile && board) {
      const x = Math.floor((e.clientX - board.offsetLeft)/75);
      const y = Math.abs(Math.ceil((e.clientY - board.offsetTop-600)/75));
      setPieces(value=> {
        const ps = value.map(p => {
          if(p.x_pos === gridX && p.y_pos === gridY) {
            p.x_pos = x;
            p.y_pos = y;
          }
          return p;
        })
        return ps;
      });

      // Aqui deverá passar a casa escolhida para o endpoint
      unselect_all()
    }
  }

  function kills_piece(e: React.MouseEvent){
    // const target = e.target as HTMLElement;
    // console.log(target);
    // const board = boardRef.current;
    // if (activeTile && board) {
    //   const x = Math.floor((e.clientX - board.offsetLeft)/75);
    //   const y = Math.abs(Math.ceil((e.clientY - board.offsetTop-600)/75));
    //   setPieces(value=> {
    //     console.log(value)
    //     const ps = value.map(p => {
    //       if(p.x_pos === gridX && p.y_pos === gridY) {
    //         p.x_pos = x;
    //         p.y_pos = y;
    //       }
    //       return p;
    //     })
    //     return ps;
    //   });
    //
    //   // Aqui deverá passar a casa escolhida para o endpoint
    //   unselect_all()
    // }
  }

  function unselect_all(){
    activeTile!.classList.remove('selected-tile');
    unhighlight_movements();
    setActiveLegalMovements(null);
    setActiveTile(null);
  }

  function get_legal_movements(tile: HTMLElement) {
    const movements: LegalMovements[] = [];
    if (AllLegalMovements){
      AllLegalMovements.forEach( function (p){
        if (p.piece === tile.id){
          p.movements.forEach(function (m) {
            let tile = document.getElementById(m);
            if (tile){
              if (tile.childNodes.length > 0) {
                const piece = tile.firstElementChild;
                if (piece && !piece.classList.contains(player_color)){
                  highlight_attack_movement(tile);
                  movements.push(p);
                }
              }
              else{
                highlight_legal_movement(tile);
                movements.push(p);
              }
            }
          });
        }
      });
    }
    return movements;
  }

  function updates_active_legal_movements(tile: HTMLElement){
    unhighlight_movements();
    setActiveLegalMovements(null);
    const active: LegalMovements[] = get_legal_movements(tile);
    setActiveLegalMovements(active);
  }

  function highlight_legal_movement(tile: HTMLElement) {
    if (tile && tile.classList.contains('dark-tile')){
      tile.classList.add('legal-movements-dark-tile');
    }
    else if (tile && tile.classList.contains('light-tile')){
      tile.classList.add('legal-movements-light-tile');
    }
  }
  function highlight_attack_movement(tile: HTMLElement) {
    if (tile && tile.classList.contains('dark-tile')){
      tile.classList.add('attack-movements-dark-tile');
    }
    else if (tile && tile.classList.contains('light-tile')){
      tile.classList.add('attack-movements-light-tile');
    }
  }

  function unhighlight_movements(){
    const dark_tiles = Array.from(document.getElementsByClassName('legal-movements-dark-tile'));
    const light_tiles = Array.from(document.getElementsByClassName('legal-movements-light-tile'));
    const dark_attack_tiles = Array.from(document.getElementsByClassName('attack-movements-dark-tile'));
    const light_attack_tiles = Array.from(document.getElementsByClassName('attack-movements-light-tile'));
    dark_tiles.forEach(function (t){t.classList.remove('legal-movements-dark-tile');})
    light_tiles.forEach(function (t){t.classList.remove('legal-movements-light-tile');})
    dark_attack_tiles.forEach(function (t){t.classList.remove('attack-movements-dark-tile');})
    light_attack_tiles.forEach(function (t){t.classList.remove('attack-movements-light-tile');})
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
