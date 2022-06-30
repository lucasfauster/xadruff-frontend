import "./Board.css";
import Tile from "../Tile/Tile";
import Border from "../Border/Border";
import React, {useEffect, useRef, useState} from "react";
import {makeMovement, startNewGame} from "../../services/ChessService";

interface Props{
  starter: boolean;
}

interface Piece {
  color: string;
  image: string;
  tilePos: string;
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

function renderPiecesByType(pieces: Piece[], type: string, tilePos: number) {
  pieces.push({ image: `images/pieces/${type}_rook.png`, color:type, tilePos: "a" + tilePos });
  pieces.push({ image: `images/pieces/${type}_rook.png`, color:type, tilePos: "h" + tilePos });
  pieces.push({ image: `images/pieces/${type}_knight.png`, color:type, tilePos: "b" + tilePos });
  pieces.push({ image: `images/pieces/${type}_knight.png`, color:type, tilePos: "g" + tilePos });
  pieces.push({ image: `images/pieces/${type}_bishop.png`, color:type, tilePos: "c" + tilePos });
  pieces.push({ image: `images/pieces/${type}_bishop.png`, color:type, tilePos: "f" + tilePos });
  pieces.push({ image: `images/pieces/${type}_queen.png`, color:type, tilePos: "d" + tilePos });
  pieces.push({ image: `images/pieces/${type}_king.png`, color:type, tilePos: "e" + tilePos });
}

function renderPawnsByType(pieces: Piece[], type: string, tilePos: number) {
  const letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
  for (const index in letters) {
    pieces.push({ image: `images/pieces/${type}_pawn.png`, color:type, tilePos: letters[index] + tilePos});
  }
}

function renderPieces(pieces: Piece[]){
  renderPiecesByType(pieces, 'b', 8)
  renderPiecesByType(pieces, 'w', 1)
  renderPawnsByType(pieces, 'b', 7)
  renderPawnsByType(pieces, 'w', 2)
}

function renderHorizontalBorder(
  horizontalAxis: string[],
  board: JSX.Element[]
) {
  board.push(<Border text={""} axis="C" />);
  for (let i = 0; i < horizontalAxis.length; i++) {
    board.push(<Border text={horizontalAxis[i]} axis="H" />);
  }
  board.push(<Border text={""} axis="C" />);
}

function renderBoardVerticalBorder(
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
      let pieceColor = "";

      pieces.forEach((p) => {
        if (p.tilePos === horizontalAxis[i]+verticalAxis[j]) {
          image = p.image;
          pieceColor = p.color;
        }
      });

      const id = horizontalAxis[i].toString()+verticalAxis[j].toString();
      board.push(<Tile key={`${id}, ${pieceColor}`} id={id} image={image} color={number} pieceColor={pieceColor} />);
    }
    board.push(<Border text={verticalAxis[j]} axis="V" />);
  }
}

function renderBoard(
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

  renderHorizontalBorder(horizontalAxis, board);
  renderBoardVerticalBorder(pieces, horizontalAxis, verticalAxis, board);
  renderHorizontalBorder(horizontalAxis, board);
  return board;
}

renderPieces(initialBoardState);

export default function Board({starter}: Props) {
  const playerColor = starter ? 'w':'b';
  const [activeTile, setActiveTile] = useState<HTMLElement | null>(null)
  const [allLegalMovements, setAllLegalMovements] = useState<LegalMovements | null>(null)
  const [currentBoardID, setCurrentBoardID] = useState<string | null>(null)

  let board = renderBoard(initialBoardState, starter);
  const boardRef = useRef<HTMLDivElement>(null);

  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const [deadPieces, setdeadPieces] = useState<Piece[]>([]);
  const [deadPiecesOpponent, setdeadPiecesOpponent] = useState<Piece[]>([]);

  useEffect(() => {
    let mounted = true;
    const startBy = starter ? "PLAYER": "AI"
    startNewGame(startBy)
        .then(chessResponse => {
          if(mounted) {
            setCurrentBoardID(chessResponse.board_id)
            setAllLegalMovements(chessResponse.legal_movements)
            if(!starter) {
              changePiecePosition(chessResponse.ai_movement)
            }
          }
        })
    return () => { mounted = false; }
  }, [])


  function handleNoActiveTile(clicked: HTMLElement, tile: HTMLElement) {
    if (!isOpponentsPiece(clicked)) {
      selectsPiece(tile);
      updatesActiveLegalMovements(tile);
    }
  }

  function handleActiveTile(tile: HTMLElement) {
    if (activeTile === tile){
      unselectAll();
    }
    else if (isInActiveLegalMovements(tile.id)){
      movePiece(tile);
    }
    else{
      changeSelectedPiece(tile);
    }
  }

  function handleClickedPiece(clicked: HTMLElement) {
    const tile = clicked.parentElement!;
    if (!activeTile) {
      handleNoActiveTile(clicked, tile);
    }
    else if (activeTile){
      handleActiveTile(tile)
    }
  }

  function selectPiece(e: React.MouseEvent) {
    const clicked = e.target as HTMLElement;
    const board = boardRef.current;
    if (clicked.classList.contains("piece") && board){
      handleClickedPiece(clicked)
    }
    else if (activeTile){
      if (clicked.classList.contains("tile") && isInActiveLegalMovements(clicked.id)){
        movePiece(clicked);
      } else {
        unselectAll();
      }
    }
  }

  function isInActiveLegalMovements(tileId: string): boolean {
    const activeLegalMovements = getActiveLegalMovements(activeTile!)
    const movements = activeLegalMovements.movements.find(movement => movement.includes(tileId))
    if (!movements) {
      return false
    }
    return movements.length >= 1
  }

  function selectsPiece(tile: HTMLElement){
    tile!.classList.add('selected-tile');
    setActiveTile(tile);
  }

  function changeSelectedPiece(tile: HTMLElement){
    activeTile!.classList.remove('selected-tile');
    if (tile){
      selectsPiece(tile);
      updatesActiveLegalMovements(tile);
    }
  }

  function callMakeMovement(currentTileId: string) {
    const futurePositionAndAction = allLegalMovements![activeTile!.id].find(position =>
        position.includes(currentTileId))!

    const move = activeTile?.id + futurePositionAndAction
    makeMovement(currentBoardID!, move).then(chessResponse => {
        setAllLegalMovements(chessResponse.legal_movements)
        changePiecePosition(chessResponse.ai_movement)
    })
  }

  function handleCheck(movement: string){
    if(movement.includes("K")){
      const kingPosition = movement.split("K")[1]
      const tile = document.getElementById(kingPosition)!
      highlightKingInCheck(tile)
    }
  }

  function handleCapture(futurePos: string, movement: string) {
    let enemyPos = futurePos
    if(movement.includes("E")) {
      enemyPos = movement.split("E")[1].slice(0, 2)
    }
    const enemyPiece = pieces.find(piece => piece.tilePos === enemyPos)
    if (enemyPiece) {
      return pieces.map(piece => {
            if (piece.tilePos === enemyPos) {
              piece.tilePos = "death"
            }
            return piece
          }
      )
    }
    return pieces
  }

  function changePiecePosition(movement: string) {
    const originalPos = movement.slice(0, 2)
    const futurePos = movement.slice(2, 4)

    let hasCastle = false
    let castleOriginalPos = ""
    let castleFuturePos = ""

    if(movement.includes("O")) {
      hasCastle = true
      const castle = movement.split("O")[1]
      castleOriginalPos = castle.slice(0, 2)
      castleFuturePos = castle.slice(2, 4)
    }

    const newPieces = handleCapture(futurePos, movement).map(
        piece => {
          if (hasCastle && piece.tilePos === castleOriginalPos) {
            piece.tilePos = castleFuturePos
          } else if (piece.tilePos === originalPos) {
            piece.tilePos = futurePos
          }

          return piece
        }
    )
    unhighlightKingInCheck()
    handleCheck(movement)
    setPieces(newPieces)
  }

  function movePiece(currentTile: HTMLElement) {
    const board = boardRef.current;
    if (activeTile && board) {
      const currentTileId = currentTile.id
      const movement = getActiveLegalMovements(activeTile).movements.find(legalMovement =>
          legalMovement.includes(currentTileId))
      changePiecePosition(activeTile.id + movement!);
      callMakeMovement(currentTile.id)
      unselectAll()
    }
  }

  function isOpponentsPiece(piece: HTMLElement){
    return !piece.classList.contains(playerColor);
  }

  function unselectAll(){
    activeTile!.classList.remove('selected-tile');
    unhighlightMovements();
    setActiveTile(null);
  }

  function getActiveLegalMovements(tile: HTMLElement): ActiveLegalMovements {
    const entry = allLegalMovements![tile.id]
    return {piece: tile.id, movements: entry ? entry : []}
  }

  function highlightMovements(activeLegalMovements: ActiveLegalMovements) {
    if (allLegalMovements) {
      activeLegalMovements.movements.forEach(function (movement) {
        let tile = document.getElementById(movement.slice(0, 2))!;
        if (movement.includes('C')) {
          highlightAttackMovement(tile);
        } else {
          highlightLegalMovement(tile);
        }
      });
    }
  }

  function updatesActiveLegalMovements(tile: HTMLElement){
    unhighlightMovements();
    const activeLegalMovements: ActiveLegalMovements = getActiveLegalMovements(tile)
    highlightMovements(activeLegalMovements);
  }

  function highlightKingInCheck(tile: HTMLElement) {
    tile.classList.add('king-in-check');
  }

  function unhighlightKingInCheck() {
    const kingInCheck = Array.from(document.getElementsByClassName('king-in-check'));
    kingInCheck.forEach(function (t){t.classList.remove('king-in-check');})
  }

  function highlightLegalMovement(tile: HTMLElement) {
    if (tile && tile.classList.contains('dark-tile')){
      tile.classList.add('legal-movements-dark-tile');
    }
    else if (tile && tile.classList.contains('light-tile')){
      tile.classList.add('legal-movements-light-tile');
    }
  }
  function highlightAttackMovement(tile: HTMLElement) {
    if (tile && tile.classList.contains('dark-tile')){
      tile.classList.add('attack-movements-dark-tile');
    }
    else if (tile && tile.classList.contains('light-tile')){
      tile.classList.add('attack-movements-light-tile');
    }
  }

  function unhighlightMovements(){
    const darkTiles = Array.from(document.getElementsByClassName('legal-movements-dark-tile'));
    const lightTiles = Array.from(document.getElementsByClassName('legal-movements-light-tile'));
    const darkAttackTiles = Array.from(document.getElementsByClassName('attack-movements-dark-tile'));
    const lightAttackTiles = Array.from(document.getElementsByClassName('attack-movements-light-tile'));
    darkTiles.forEach(function (t){t.classList.remove('legal-movements-dark-tile');})
    lightTiles.forEach(function (t){t.classList.remove('legal-movements-light-tile');})
    darkAttackTiles.forEach(function (t){t.classList.remove('attack-movements-dark-tile');})
    lightAttackTiles.forEach(function (t){t.classList.remove('attack-movements-light-tile');})
  }


  return (
    <div id='view'>
      <div onClick={(e) => selectPiece(e)}
           id="board" data-testid="test-board"  ref={boardRef}>
        {board}
      </div>
    </div>
  );
}
