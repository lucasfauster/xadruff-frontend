import "./CaptureAreaBoard.css";

import {Piece} from "../Board/BoardUtils";
import Tile from "../Tile/Tile";
import React from "react";

export function renderCaptureAreaBoard(
    pieces: Piece[],
    color: string
) {
    const captureAreaBoardLeft: JSX.Element[] = [];
    const captureAreaBoardRight: JSX.Element[] = [];

    renderBoardVerticalBorder(captureAreaBoardLeft, pieces, color, 0);
    renderBoardVerticalBorder(captureAreaBoardRight, pieces, color, 1);
    return <div id="capture-area">
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