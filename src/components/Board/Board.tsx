import "./Board.css";
import React, {useEffect, useState} from "react";
import {makeMovement, startNewGame} from "../../services/ChessService";
import {handlePromotion, renderPromotionMenu} from "../PromotionMenu/PromotionMenu"
import {BoardRequest} from "./BoardStates";
import {changeToCaptureBoard, renderCaptureAreaBoard} from "../CaptureAreaBoard/CaptureAreaBoard";
import {adversaryTurn, setWinner, setWinnerMotive, yourTurn} from "./EndgameHandler";
import {
  handleCheckHighlight,highlightLegalMovements, unHighlightKingInCheck,unHighlightLegalMovements
} from "./HighlightHandler";
import {
  ActiveLegalMovements, ChessResponse, LegalMovements, Piece,
  renderBoard, renderPlayAgainButton, renderSurrenderButton
} from "./BoardRenderer"

interface Props{
  level: string;
  starter: boolean;
  initialPieces: Piece[];
  boardRequest: BoardRequest;
  setCurrentMenu: Function;
}
export default function Board({level, starter, boardRequest, initialPieces, setCurrentMenu}: Props) {

  const playerColor = starter ? 'w':'b';
  const [activeTile, setActiveTile] = useState<HTMLElement | null>(null)
  const [allLegalMovements, setAllLegalMovements] = useState<LegalMovements | null>(null)
  const [currentBoardID, setCurrentBoardID] = useState<string | null>(null)
  const [pieces, setPieces] = useState<Piece[]>(initialPieces);
  const [lastMovement, setLastMovement] = useState<string>("")
  const [kingInCheckPosition, setKingInCheckPosition] = useState<string>("")
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(starter)
  const [whiteDeadPiecesCount, setWhiteDeadPiecesCount] = useState<number>(0);
  const [blackDeadPiecesCount, setBlackDeadPiecesCount] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("Iniciando...");
  const [endgameFeedback, setEndgameFeedback] = useState<string>("");
  const [isPromotion, setIsPromotion] = useState<boolean>(false)
  const [promotionOptions, setPromotionOptions] = useState<string[]>([])
  const [isGameOver, setIsGameOver] = useState<boolean>(false)


  const board = renderBoard(starter, pieces, lastMovement, kingInCheckPosition);
  const whiteCaptureArea = renderCaptureAreaBoard(pieces, 'w', 'left');
  const blackCaptureArea = renderCaptureAreaBoard(pieces, 'b', 'right');

  useEffect(() => {
    let mounted = true;
    const startBy = starter ? "PLAYER": "AI"
    startNewGame(startBy, boardRequest, level)
        .then(chessResponse => {
          if(mounted) {
            setCurrentBoardID(chessResponse.board_id)
            gameLoop(chessResponse);
          }
        })
    return () => { mounted = false; }
  }, [])

  function handleAITurn(chessResponse: ChessResponse) {
    if (chessResponse.ai_movement.includes('P')) {
      const promotionIndex = chessResponse.ai_movement.indexOf("P")
      handlePromotion(
          chessResponse.ai_movement[promotionIndex+1],
          chessResponse.ai_movement,
          pieces
      )
    }
    unHighlightKingInCheck()
    handleCheckHighlight(chessResponse.ai_movement, setKingInCheckPosition)
    changePiecePosition(chessResponse.ai_movement)
    setIsPlayerTurn(true)
  }

  function handleEndgame(chessResponse: ChessResponse) {
    const winner = setWinner(chessResponse.endgame.winner)
    const winnerMotive = setWinnerMotive(chessResponse.endgame.endgame_message)
    setIsPlayerTurn(false)
    setEndgameFeedback(winner + " " + winnerMotive)
    setIsGameOver(true);
  }

  function gameLoop(chessResponse: ChessResponse) {
    if(!isGameOver) {
      setAllLegalMovements(chessResponse.legal_movements)
      if (chessResponse.ai_movement) {
        handleAITurn(chessResponse);
      }
      if (chessResponse.endgame) {
        handleEndgame(chessResponse);
      } else {
        setFeedback(yourTurn)
      }
    }
  }

  function callMakeMovement(futurePositionAndAction: string) {
    setIsPlayerTurn(false)
    const move = activeTile?.id + futurePositionAndAction
    makeMovement(currentBoardID!, move).then(chessResponse => {
      gameLoop(chessResponse)
    })
  }

  function handleNoActiveTile(clicked: HTMLElement, tile: HTMLElement) {
    if (!isOpponentsPiece(clicked)) {
      selectsPiece(tile);
      updatesActiveLegalMovements(tile);
    }
  }

  function handleActiveTile(clickedPiece: HTMLElement, tile: HTMLElement) {
    if (activeTile === tile){
      unselectAll();
    }
    else if (isInActiveLegalMovements(tile.id)){
      movePiece(tile);
    }
    else if (!isOpponentsPiece(clickedPiece)){
      changeSelectedPiece(tile);
    }
  }

  function handleClickedPiece(clickedPiece: HTMLElement) {
    const tile = clickedPiece.parentElement!;
    if (!activeTile) {
      handleNoActiveTile(clickedPiece, tile);
    }
    else if (activeTile){
      handleActiveTile(clickedPiece, tile)
    }
  }

  function selectPiece(e: React.MouseEvent) {
    if(isPlayerTurn && !isGameOver) {
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
  }

  function isInActiveLegalMovements(tileId: string): boolean {
    const activeLegalMovements = getActiveLegalMovements(activeTile!)
    const movement = activeLegalMovements.movements.find(movement => movement.includes(tileId))
    if (!movement || isInKAction(movement, tileId)) {
      return false
    }
    return movement.length >= 1
  }

  function isInKAction(movement: string, tileId: string) {
    return movement.includes('K') && movement.slice(movement.indexOf('K')).slice(1, 3).includes(tileId);

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

  function handleCapture(futurePos: string, movement: string) {
    let enemyPos = futurePos
    if(movement.includes("E")) {
      enemyPos = movement.split("E")[1].slice(0, 2)
    }
    const enemyPiece = pieces.find(piece => piece.tilePos === enemyPos)
    if (enemyPiece) {
      return pieces.map(piece => {
            if (piece.tilePos === enemyPos) {
              const deadPieces = {
                blackDeadPiecesCount,
                setBlackDeadPiecesCount,
                whiteDeadPiecesCount,
                setWhiteDeadPiecesCount
              }
              changeToCaptureBoard(piece, deadPieces);
            }
            return piece
          }
      )
    }
    return pieces
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
    setPieces(newPieces)
  }

  function initializePromotion(currentTileId: string) {
    const promotionMovements = getActiveLegalMovements(activeTile!).movements.filter(legalMovement =>
        legalMovement.includes(currentTileId))
    setPromotionOptions(promotionMovements)
    setIsPromotion(true)
    setIsPlayerTurn(false)
  }

  function handleMovePiece(movement: string, currentTileId: string) {
    unHighlightKingInCheck()
    handleCheckHighlight(movement!, setKingInCheckPosition)
    const futurePositionAndAction = allLegalMovements![activeTile!.id].find(position =>
        position.includes(currentTileId))!
    callMakeMovement(futurePositionAndAction)
    unselectAll()
  }

  function movePiece(currentTile: HTMLElement) {
    if (activeTile && board) {
      const currentTileId = currentTile.id
      let movement = getActiveLegalMovements(activeTile).movements.find(legalMovement =>
            legalMovement.includes(currentTileId))
      changePiecePosition(activeTile.id + movement!);
      if(movement!.includes('P') && !isPromotion) {
        initializePromotion(currentTileId);
      } else {
        setFeedback(adversaryTurn)
        handleMovePiece(movement!, currentTileId);
      }
    }
  }

  function isOpponentsPiece(piece: HTMLElement){
    return !piece.classList.contains(playerColor);
  }

  function unselectAll(){
    activeTile!.classList.remove('selected-tile');
    unHighlightLegalMovements();
    setActiveTile(null);
  }

  function getActiveLegalMovements(tile: HTMLElement): ActiveLegalMovements {
    const entry = allLegalMovements![tile.id]
    return {piece: tile.id, movements: entry ? entry : []}
  }

  function updatesActiveLegalMovements(tile: HTMLElement) {
    unHighlightLegalMovements();
    const activeLegalMovements: ActiveLegalMovements = getActiveLegalMovements(tile)
    highlightLegalMovements(activeLegalMovements, allLegalMovements);
  }

  function choosePromotionPiece(piece: string){
    setIsPromotion(false)
    const movement = promotionOptions.find(legalMovement =>
        legalMovement.includes(piece)
    )
    handlePromotion(piece, movement!, pieces);
    unHighlightKingInCheck()
    handleCheckHighlight(movement!, setKingInCheckPosition)
    callMakeMovement(movement!)
  }

  return (
    <div id='container'>
      <div id='view'>
        <div id='feedback' data-testid="test-feedback">
          {isGameOver ? endgameFeedback : feedback}
          {isGameOver ? renderPlayAgainButton(setCurrentMenu) : renderSurrenderButton(currentBoardID!, handleEndgame)}
        </div>
        {whiteCaptureArea}
        <div onClick={(e) => selectPiece(e)}
             id="board" data-testid="test-board">
          {board}
        </div>
        {isPromotion && renderPromotionMenu(starter, choosePromotionPiece)}
        {blackCaptureArea}
      </div>
    </div>
  );
}
