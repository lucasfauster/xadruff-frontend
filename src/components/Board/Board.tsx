import "./Board.css";
import Tile from "../Tile/Tile";
import Border from "../Border/Border";
import React, {useEffect, useRef, useState} from "react";
import {makeMovement, startNewGame} from "../../services/ChessService";

interface Piece {
  color: string;
  image: string;
  tile_pos: string;
}

interface ActiveLegalMovements {
  piece: string;
  movements: string[];
}

interface LegalMovements {
  [piece: string]: string[];
}

interface Board {
  positions: string[][];
}

export interface ChessResponse {
  board_id: string;
  board: Board;
  legal_movements: LegalMovements;
  ai_movement: string;
}

let initialBoardState: Piece[] = [];

function render_pieces_by_type(pieces: Piece[], type: string, tile_pos: number) {
  pieces.push({ image: `images/pieces/${type}_rook.png`, color:type, tile_pos: "a" + tile_pos });
  pieces.push({ image: `images/pieces/${type}_rook.png`, color:type, tile_pos: "h" + tile_pos });
  pieces.push({ image: `images/pieces/${type}_knight.png`, color:type, tile_pos: "b" + tile_pos });
  pieces.push({ image: `images/pieces/${type}_knight.png`, color:type, tile_pos: "g" + tile_pos });
  pieces.push({ image: `images/pieces/${type}_bishop.png`, color:type, tile_pos: "c" + tile_pos });
  pieces.push({ image: `images/pieces/${type}_bishop.png`, color:type, tile_pos: "f" + tile_pos });
  pieces.push({ image: `images/pieces/${type}_queen.png`, color:type, tile_pos: "d" + tile_pos });
  pieces.push({ image: `images/pieces/${type}_king.png`, color:type, tile_pos: "e" + tile_pos });
}

function render_pawns_by_type(pieces: Piece[], type: string, tile_pos: number) {
  const letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
  for (const index in letters) {
    pieces.push({ image: `images/pieces/${type}_pawn.png`, color:type, tile_pos: letters[index] + tile_pos});
  }
}

function render_pieces(
  pieces: Piece[],
  starter: boolean
){
  render_pieces_by_type(pieces, 'b', 8)
  render_pieces_by_type(pieces, 'w', 1)
  render_pawns_by_type(pieces, 'b', 7)
  render_pawns_by_type(pieces, 'w', 2)

  console.log(pieces)
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
        if (p.tile_pos === horizontalAxis[i]+verticalAxis[j]) {
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
  let verticalAxis;
  let horizontalAxis;

  if (starter) {
    verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
    horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
  } else {
    verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"].reverse();
    horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"].reverse();
  }

  render_horizontal_border(horizontalAxis, board);
  render_board_vertical_border(pieces, horizontalAxis, verticalAxis, board);
  render_horizontal_border(horizontalAxis, board);
  return board;
}

const starter = true;
render_pieces(initialBoardState,starter);

export default function Board() {
  const player_color = starter ? 'w':'b';
  const [activeTile, setActiveTile] = useState<HTMLElement | null>(null)
  const [allLegalMovements, setAllLegalMovements] = useState<LegalMovements | null>(null)
  const [currentBoardID, setCurrentBoardID] = useState<string | null>(null)

  let board = render_board(initialBoardState,starter);
  const boardRef = useRef<HTMLDivElement>(null);

  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const [deadPieces, setdeadPieces] = useState<Piece[]>([]);
  const [deadPiecesOpponent, setdeadPiecesOpponent] = useState<Piece[]>([]);

  useEffect(() => {
    let mounted = true;
    startNewGame()
        .then(items => {
          if(mounted) {
            console.log(items)
            setCurrentBoardID(items.board_id)
            setAllLegalMovements(items.legal_movements)
            console.log(items.legal_movements)
            console.log(items.board_id)
          }
        })
    return () => { mounted = false; }
  }, [])

  function select_piece(e: React.MouseEvent) {
    const clicked = e.target as HTMLElement;
    const board = boardRef.current;

    // Se clicou numa peça
    if (clicked.classList.contains("piece")  && board){
      const tile = clicked.parentElement;

      // Se não tem nenhuma casa ativa
      if (!activeTile &&  tile && !tile.classList.contains('selected-tile') && !is_opponents_piece(clicked)) {
        selects_piece(tile);
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
          change_selected_piece(tile);
        }
      }
    }

    // Se clicou numa casa legal movements
    else if (clicked.classList.contains("legal-movements-dark-tile") || clicked.classList.contains("legal-movements-light-tile")){
      move_piece(e);
    }

    // Se clicou fora e tem casa ativa, desseleciona tudo
    else if (!clicked.classList.contains("piece") && activeTile){
      unselect_all();
    }
  }

  function selects_piece(tile: HTMLElement){
    tile!.classList.add('selected-tile');
    setActiveTile(tile);
  }

  function change_selected_piece(tile: HTMLElement){
    activeTile!.classList.remove('selected-tile');
    if (tile){
      selects_piece(tile);
      updates_active_legal_movements(tile);
    }
  }

  function make_movement(currentTileId: string) {
    const move = activeTile?.id + currentTileId // = "a2a3"
    console.log("move = " + move)
    makeMovement(currentBoardID!, move).then(chess_response => {
        console.log(chess_response)
        setAllLegalMovements(chess_response.legal_movements)
        change_piece_position(chess_response.ai_movement)
        console.log(chess_response.legal_movements)
        console.log(chess_response.board_id)
    })
  }

  function change_piece_position(movement: string) {
    const original_pos = movement.slice(0, 2)
    console.log(original_pos)
    const future_pos = movement.slice(2, 4)
    console.log(future_pos)
    setPieces(value => {
      return value.map(piece => {
        if (piece.tile_pos === original_pos) {
          piece.tile_pos = future_pos
        }
        return piece;
      });
    });
  }

  function move_piece(e: React.MouseEvent) {
    const board = boardRef.current;
    if (activeTile && board) {
      const current_tile = e.target as HTMLElement
      const current_tile_id = current_tile.id
      change_piece_position(activeTile.id+current_tile_id);
      console.log(activeTile.id+current_tile_id)

      make_movement(current_tile.id)

      // Aqui deverá passar a casa escolhida para o endpoint
      unselect_all()
    }
  }

  function is_opponents_piece(piece: HTMLElement){
    return !piece.classList.contains(player_color);
  }

  function get_piece(tile_pos: string) {
    return  pieces.find(p=> p.tile_pos === tile_pos);
  }

  function kills_piece(e: React.MouseEvent){
    // const clicked = e.target as HTMLElement;
    // const board = boardRef.current;
    //
    // if (activeTile && clicked.classList.contains("piece") && board && is_opponents_piece(clicked)) {
    //   // const x = Math.floor((e.clientX - board.offsetLeft-20)/75);
    //   // const y = Math.abs(Math.ceil((e.clientY - board.offsetTop-590)/75));
    //   const piece = get_piece("a"); // TODO
    //   deadPieces.push(piece)
    //   // pieces.splice(pieces.indexOf(piece),1)
    //   setPieces(value=> {
    //     return value.map(p => {
    //       // if(p.x_pos === gridX && p.y_pos === gridY) {
    //       //   p.x_pos = x;
    //       //   p.y_pos = y;
    //       // }
    //       return p;
    //     });
    //   });
      // Aqui deverá passar a casa escolhida para o endpoint
      unselect_all()
    // }
  }

  function unselect_all(){
    activeTile!.classList.remove('selected-tile');
    unhighlight_movements();
    setActiveTile(null);
  }

  function getMovementsAndPieceFromLegalMovements(tile: HTMLElement) {
    const entry = Object.entries(allLegalMovements!).find(([piece, _movements]) => piece === tile.id)!
    const activeLegalMovements : ActiveLegalMovements = {piece: entry[0], movements: entry[1]}
    return activeLegalMovements
  }

  function highlight_movements(activeLegalMovements: ActiveLegalMovements) {
    if (allLegalMovements) {
      activeLegalMovements.movements.forEach(function (movement) {
        let tile = document.getElementById(movement)!;
          if (movement.includes('C')) {
            highlight_attack_movement(tile);
          } else {
            highlight_legal_movement(tile);
          }
      });
    }
  }

  function updates_active_legal_movements(tile: HTMLElement){
    unhighlight_movements();
    const activeLegalMovements: ActiveLegalMovements = getMovementsAndPieceFromLegalMovements(tile)
    highlight_movements(activeLegalMovements);
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
        onClick={(e) => select_piece(e)}

        id="board"
        ref={boardRef}
      >
        {board}
      </div>
    </div>
  );
}
