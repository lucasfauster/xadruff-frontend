import Border from "../Border/Border";
import Tile from "../Tile/Tile";
import React from "react";
import {BoardRequest} from "./BoardStates";

export interface Piece {
    color: string;
    image: string;
    tilePos: string;
}

export interface ActiveLegalMovements {
    piece: string;
    movements: string[];
}

export interface LegalMovements {
    [piece: string]: string[];
}

export interface Board {
    positions: string[][];
}

export interface ChessResponse {
    board_id: string;
    board: Board;
    legal_movements: LegalMovements;
    ai_movement: string;
}

export function renderPieceByBoard(pieces: Piece[], boardRequest: BoardRequest) {
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
    const imagePiecesName : { [piece: string]: string } = {
        "p": "pawn", "k": "king", "q": "queen", "b": "bishop", "r": "rook", "n": "knight"
    }
    boardRequest.positions.forEach(function (line, lineIndex) {
            line.forEach(function (position, positionIndex) {
                const piece = imagePiecesName[position.toLowerCase()]
                if(piece) {
                    let color = "w"
                    if(position === position.toLowerCase()) {
                        color = "b"
                    }
                    pieces.push({ image: `images/pieces/${color}_${piece}.png`, color:color, tilePos: letters[positionIndex]
                            + (8-lineIndex).toString()});
                }
            })
        }
    )

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
    lastMovement: string,
    kingInCheckPosition: string
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
            board.push(<Tile key={`${id}, ${pieceColor}`}
                             id={id} image={image}
                             color={number}
                             pieceColor={pieceColor}
                             lastMovement={lastMovement}
                             kingInCheckPosition={kingInCheckPosition}/>);
        }
        board.push(<Border text={verticalAxis[j]} axis="V" />);
    }
}

export function renderBoard(
    starter: boolean,
    pieces: Piece[],
    lastMovement: string,
    kingInCheckPosition: string
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
    renderBoardVerticalBorder(pieces, horizontalAxis, verticalAxis, board, lastMovement, kingInCheckPosition);
    renderHorizontalBorder(horizontalAxis, board);
    return board;
}

export function renderPromotionMenu(stater: boolean, setPromotionOption: Function){
    const type = stater ? 'w': 'b';
    const queen = stater ?  'Q':'q';
    const bishop = stater ? 'B': 'b';
    const rook = stater ? 'R': 'r';
    const knight = stater ? 'K': 'k';
    return (
      <div id="promotion">
          <h3 className={'text'}>POR QUAL PEÇA VOCÊ QUER TROCAR SEU PEÃO?</h3>
          <div id="grid">
              <div className={'piece-button'}>
                  <img onClick= {()=> setPromotionOption(queen)} src={`images/pieces/${type}_queen.png`} alt="Rainha"/>
              </div>
              <div className={'piece-button'}>
                  <img onClick={()=> setPromotionOption(bishop)} src={`images/pieces/${type}_bishop.png`} alt="Bispo"/>
              </div>
              <div className={'piece-button'}>
                  <img onClick={()=> setPromotionOption(rook)} src={`images/pieces/${type}_rook.png`} alt="Torre"/>
              </div >
              <div className={'piece-button'}>
                  <img onClick={()=> setPromotionOption(knight)} src={`images/pieces/${type}_knight.png`} alt="Cavalo"/>
              </div>
          </div>
      </div>
    );
}