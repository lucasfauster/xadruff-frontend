import React from "react";
import "./PromotionMenu.css";
import {imagePiecesName, Piece} from "../Board/BoardRenderer";

export function handlePromotion(piece: string, movement: string, pieces: Piece[]) {
    const tilePos = movement!.slice(0, 2)
    let color = 'w'
    if (piece === piece.toLowerCase()) {
        color = 'b'
    }
    pieces.find(
        piece => piece.tilePos === tilePos
    )!.image = `images/pieces/${color}_${imagePiecesName[piece.toLowerCase()]}.png`
    return movement;
}

export function renderPromotionMenu(starter: boolean, choosePromotionPiece: Function){
    const type = starter ? 'w': 'b';
    const queen = starter ?  'Q':'q';
    const bishop = starter ? 'B': 'b';
    const rook = starter ? 'R': 'r';
    const knight = starter ? 'N': 'n';
    return (
        <div id="promotion">
            <h3 className={'text'}>POR QUAL PEÇA VOCÊ QUER TROCAR SEU PEÃO?</h3>
            <div id="grid">
                <div className={'piece-button'}>
                    <img className={'piece-image'} onClick= {()=> choosePromotionPiece(queen)} src={`images/pieces/${type}_queen.png`} alt="Rainha"/>
                </div>
                <div className={'piece-button'}>
                    <img className={'piece-image'} onClick={()=> choosePromotionPiece(bishop)} src={`images/pieces/${type}_bishop.png`} alt="Bispo"/>
                </div>
                <div className={'piece-button'}>
                    <img className={'piece-image'} onClick={()=> choosePromotionPiece(rook)} src={`images/pieces/${type}_rook.png`} alt="Torre"/>
                </div >
                <div className={'piece-button'}>
                    <img className={'piece-image'} onClick={()=> choosePromotionPiece(knight)} src={`images/pieces/${type}_knight.png`} alt="Cavalo"/>
                </div>
            </div>
        </div>
    );
}