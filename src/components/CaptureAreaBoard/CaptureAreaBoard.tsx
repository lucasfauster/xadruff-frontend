import "./CaptureAreaBoard.css";

import {Piece} from "../Board/BoardRenderer";
import Tile from "../Tile/Tile";
import React from "react";

export function renderCaptureAreaBoard(
    pieces: Piece[],
    color: string,
    direction: string
) {
    const captureAreaBoardLeft: JSX.Element[] = [];
    const captureAreaBoardRight: JSX.Element[] = [];

    renderBoardVerticalBorder(captureAreaBoardLeft, pieces, color, 0);
    renderBoardVerticalBorder(captureAreaBoardRight, pieces, color, 1);
    return <div id="capture-area" className={`capture-area-${direction}`}>
        <div>
            {captureAreaBoardLeft}
        </div>
        <div>
            {captureAreaBoardRight}
        </div>
    </div>;
}

function renderBoardVerticalBorder(
    board: JSX.Element[],
    pieces: Piece[],
    color: string,
    initialId: number
){
    for(let i = initialId; i < 16; i+=2) {
        let image = "";
        let pieceColor = "";
        const id = `${color}-death-${i}`
        pieces.forEach((p) => {
            if (p.tilePos === id) {
                image = p.image;
                pieceColor = p.color;
            }
        });

        board.push(
            <Tile key={id}
                  id={id} image={image}
                  color={2}
                  pieceColor={pieceColor}
                  lastMovement={""}
                  kingInCheckPosition={""}/>
        );
    }
}

interface DeadPiecesCount {
    blackDeadPiecesCount: number,
    setBlackDeadPiecesCount: Function,
    whiteDeadPiecesCount: number,
    setWhiteDeadPiecesCount: Function
}

export function changeToCaptureBoard(piece: Piece, deadPieces: DeadPiecesCount) {
    const defaultTotalPieces = 16
    if (piece.color === 'b') {
        piece.tilePos = `b-death-${deadPieces.blackDeadPiecesCount}`
        const blackDeadCount = deadPieces.blackDeadPiecesCount + 1
        /* istanbul ignore next */
        if (blackDeadCount === defaultTotalPieces-1) {
            deadPieces.setBlackDeadPiecesCount(0)
        } else {
            deadPieces.setBlackDeadPiecesCount(blackDeadCount)
        }
    } else {
        piece.tilePos = `w-death-${deadPieces.whiteDeadPiecesCount}`
        const whiteDeadCount = deadPieces.whiteDeadPiecesCount + 1
        /* istanbul ignore next */
        if (whiteDeadCount === defaultTotalPieces-1) {
            deadPieces.setWhiteDeadPiecesCount(0)
        } else {
            deadPieces.setWhiteDeadPiecesCount(whiteDeadCount)
        }
    }
}