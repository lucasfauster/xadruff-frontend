import "./Menu.css";
import React, {useState} from "react";
import Board from "../Board/Board";
import {Piece, renderPieceByBoard} from "../Board/BoardUtils"
import {handleBoardState} from "../Board/BoardStates";

export default function Menu() {

  const [color, setColor] = useState<boolean | null>(null);
  const [gameState, setGameState] = useState<string>("DEFAULT");
  const [canRenderBoard, setCanRenderBoard] = useState<boolean>(false);
  const [canRenderColorMenu, setCanRenderColorMenu] = useState<boolean>(false);
  const [canRenderDefaultStateMenu, setCanRenderDefaultStateMenu] = useState<boolean>(false);
  const [canRenderCustomStateMenu, setCanRenderCustomStateMenu] = useState<boolean>(false);

  function renderColorSelection(){
    document.getElementById("row")!.remove();
    setCanRenderColorMenu(true);
  }

  function renderDefaultMenuSelection(option: boolean){
      setCanRenderColorMenu(false);
      setCanRenderDefaultStateMenu(true);
      setColor(option);
  }

  function renderCustomMenuSelection(){
      setCanRenderDefaultStateMenu(false);
      setCanRenderCustomStateMenu(true)
  }

  function startGame(option: boolean, gameState: string){
    setGameState(gameState)
    setColor(option);
    setCanRenderBoard(true);
  }

  function randomColor() : boolean {
    return Math.floor(Math.random() * 2) === 0 ;
  }

  function renderDefaultStatesMenu(){
    return (
        <div id='state-menu'>
          <h2 className={'text'}>QUAL OPÇÃO DE JOGO?</h2>
          <div className={'state-option'}>
            <div className={'state-button'} data-testid="test-default"
                 onClick={() => startGame(color!, "DEFAULT")}>
              <img  className={'menu-piece'} src='images/pieces/b_king.png' alt="Rei Preto"/>
            </div>
            <h3 className={'text'}>DEFAULT</h3>
          </div>
          <div className={'state-option'}>
            <div className={'state-button'} data-testid="test-custom"
                 onClick={() => renderCustomMenuSelection()}>
              <img  className={'menu-piece'} src='images/pieces/w_queen.png' alt="Rainha Branca"/>
            </div>
            <h3 className={'text'}>PERSONALIZADO</h3>
          </div>
        </div>
    );
  }

  function renderCustomStatesMenu() {
      return (
          <div id='color-menu'>
              <h2 className={'text'}>QUAL OPÇÃO DE JOGO?</h2>
              <div className={'color-option'}>
                  <div className={'color-button'} data-testid="test-pretas"
                       onClick={() => startGame(color!, "EN_PASSANT")}>
                      <img  className={'menu-piece'} src='images/pieces/w_pawn.png' alt="Peão branco"/>
                  </div>
                  <h3 className={'text'}>EN PASSANT</h3>
              </div>
              <div className={'color-option'}>
                  <div className={'color-button'} data-testid="test-brancas"
                       onClick={() => startGame(color!, "CASTLE")}>
                      <img  className={'menu-piece'} src='images/pieces/w_rook.png' alt="Torre BRANCA"/>
                  </div>
                  <h3 className={'text'}>ROQUE</h3>
              </div>
              <div className={'color-option'}>
                  <div className={'color-button'} data-testid="test-brancas"
                       onClick={() => startGame(color!, "CHECK_MATE")}>
                      <img  className={'menu-piece'} src='images/pieces/w_king.png' alt="Rei Branco"/>
                  </div>
                  <h3 className={'text'}>CHEQUE MATE</h3>
              </div>
              <div className={'color-option'}>
                  <div className={'color-button'} data-testid="test-brancas"
                       onClick={() => startGame(color!, "STALE_MATE")}>
                      <img  className={'menu-piece'} src='images/pieces/b_king.png' alt="Rei Preto"/>
                  </div>
                  <h3 className={'text'}>STALEMATE</h3>
              </div>
              <div className={'color-option'}>
                  <div className={'color-button'} data-testid="test-brancas"
                       onClick={() => startGame(color!, "PROMOTION")}>
                      <img  className={'menu-piece'} src='images/pieces/b_pawn.png' alt="Peão Preto"/>
                  </div>
                  <h3 className={'text'}>PROMOÇÃO</h3>
              </div>
              <div className={'color-option'}>
                  <div className={'color-button'} data-testid="test-brancas"
                       onClick={() => startGame(color!, "QUEEN_MADNESS")}>
                      <img  className={'menu-piece'} src='images/pieces/b_queen.png' alt="Rainha preta"/>
                  </div>
                  <h3 className={'text'}>RINHA DE RAINHA</h3>
              </div>
          </div>
      );
  }

  function renderColorMenu(){
    return (
      <div id='color-menu'>
        <h2 className={'text'}>COM QUAIS PEÇAS VOCÊ QUER JOGAR?</h2>
        <div className={'color-option'}>
          <div className={'color-button'} data-testid="test-pretas"
               onClick={() => renderDefaultMenuSelection(false)}>
            <img  className={'menu-piece'} src='images/pieces/b_knight.png' alt="Cavalo Preto"/>
          </div>
          <h3 className={'text'}>PRETAS</h3>
        </div>
        <div className={'color-option'}>
          <div className={'color-button'} data-testid="test-brancas"
               onClick={() => renderDefaultMenuSelection(true)}>
            <img  className={'menu-piece'} src='images/pieces/w_rook.png' alt="Torre Branca"/>
          </div>
          <h3 className={'text'}>BRANCAS</h3>
        </div>
        <div className={'color-option'}>
          <div className={'color-button'} data-testid="test-sortear"
               onClick={() => renderDefaultMenuSelection(randomColor())}>
            <img  className={'menu-piece'} src='images/dado.png' alt="Dado de Sorteio"/>
          </div>
          <h3 className={'text'}>SORTEAR</h3>
        </div>
      </div>
    );
  }

  function renderMainMenu(){
    return(
      <div id ='row'>
        <img id='main-logo' src='images/logo.png' alt="XadrUFF"/>
        <button id='button' className={'text'}
                onClick={() => renderColorSelection()}> JOGAR
        </button>
      </div>
    );
  }

  if (canRenderBoard){
    const initialPieces : Piece[] = []
    const boardRequest = handleBoardState(gameState)
    renderPieceByBoard(initialPieces, boardRequest)
    return (<Board starter={color!} boardRequest={boardRequest} initialPieces={initialPieces}/>);
  }
  else{
    return(
      <div id='menu'>
        { renderMainMenu() }
        { canRenderColorMenu && renderColorMenu() }
        { canRenderDefaultStateMenu && renderDefaultStatesMenu() }
        { canRenderCustomStateMenu && renderCustomStatesMenu() }
      </div>
    );
  }
}