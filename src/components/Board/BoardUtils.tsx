import Border from "../Border/Border";
import Tile from "../Tile/Tile";
import React from "react";

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

export function renderPieces(pieces: Piece[]){
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

