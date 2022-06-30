import "./Board.css";
import React, {useEffect, useState} from "react";
import {makeMovement, startNewGame} from "../../services/ChessService";
import {ActiveLegalMovements, LegalMovements, Piece,
        renderBoard, renderPromotionMenu} from "./BoardUtils"
import {BoardRequest} from "./BoardStates";

interface Props{
  starter: boolean;
  initialPieces: Piece[];
  boardRequest: BoardRequest;
}

export default function Board({starter, boardRequest, initialPieces}: Props) {

  const playerColor = starter ? 'w':'b';
  const [activeTile, setActiveTile] = useState<HTMLElement | null>(null)
  const [allLegalMovements, setAllLegalMovements] = useState<LegalMovements | null>(null)
  const [currentBoardID, setCurrentBoardID] = useState<string | null>(null)
  const [pieces, setPieces] = useState<Piece[]>(initialPieces);
  const [lastMovement, setLastMovement] = useState<string>("")
  const [kingInCheckPosition, setKingInCheckPosition] = useState<string>("")
  const [promotionPosition, setPromotionPosition] = useState<string>("")
  const [deadPieces, setdeadPieces] = useState<Piece[]>([]);
  const [deadPiecesOpponent, setdeadPiecesOpponent] = useState<Piece[]>([]);

  const board = renderBoard(starter, pieces, lastMovement, kingInCheckPosition);

  useEffect(() => {

    let mounted = true;
    const startBy = starter ? "PLAYER": "AI"
    startNewGame(startBy, boardRequest)
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

  function handleCheckHighlight(movement: string){
    if(movement.includes("K")){
      const kingPosition = movement.split("K")[1]
      setKingInCheckPosition(kingPosition)
      document.getElementById(kingPosition)!.classList.add('king-in-check')
    } else {
      setKingInCheckPosition("")
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

  function handlePromotion(position: string){
    // filtrar a posição escolhida
  }

  function changePiecePosition(movement: string) {
    setLastMovement(movement.slice(0,4))
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

    if(movement.includes("P")){
      renderPromotionMenu(starter,setPromotionPosition)
      if (promotionPosition){
        handlePromotion(promotionPosition)
      }
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
    handleCheckHighlight(movement)
    setPieces(newPieces)
  }

  function movePiece(currentTile: HTMLElement) {
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
    unhighlightLegalMovements();
    setActiveTile(null);
  }

  function getActiveLegalMovements(tile: HTMLElement): ActiveLegalMovements {
    const entry = allLegalMovements![tile.id]
    return {piece: tile.id, movements: entry ? entry : []}
  }

  function highlightLegalMovements(activeLegalMovements: ActiveLegalMovements) {
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

  function updatesActiveLegalMovements(tile: HTMLElement) {
    unhighlightLegalMovements();
    const activeLegalMovements: ActiveLegalMovements = getActiveLegalMovements(tile)
    highlightLegalMovements(activeLegalMovements);
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

  function unhighlightKingInCheck() {
    const kingInCheck = Array.from(document.getElementsByClassName('king-in-check'));
    kingInCheck.forEach(function (t){t.classList.remove('king-in-check');})
  }

  function unhighlightLegalMovements(){
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
           id="board" data-testid="test-board">
        {board}
      </div>
    </div>
  );
}
