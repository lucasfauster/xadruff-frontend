import React from "react";

function startGame(
  currentColor: boolean, setCurrentColor: Function,
  gameState: string, setGameState: Function,
  setCurrentMenu: Function, startGameMenu: number)
{
  setGameState(gameState);
  setCurrentColor(currentColor);
  setCurrentMenu(startGameMenu);
}

export function renderCustomStatesMenu(
  currentMenu: number, setCurrentMenu: Function,
  currentColor: boolean, setCurrentColor: Function,
  setGameState: Function, startGameMenu: number)
{
  return (
    <div id='color-menu' data-testid="test-custom-states" >
      <h2 className={'text'}>QUAL OPÇÃO DE JOGO?</h2>
      <div className={'color-option'}>
        <div className={'color-button'} data-testid="test-en-passant"
             onClick={() =>
               startGame(currentColor!, setCurrentColor,
                 "EN_PASSANT", setGameState,
                 setCurrentMenu, startGameMenu
               )}>
          <img  className={'menu-piece'} src='images/pieces/w_pawn.png' alt="Peão branco"/>
        </div>
        <h3 className={'text'}>EN PASSANT</h3>
      </div>
      <div className={'color-option'}>
        <div className={'color-button'} data-testid="test-castle"
             onClick={() =>  startGame(currentColor!, setCurrentColor,
               "CASTLE", setGameState,
               setCurrentMenu, startGameMenu
             )}>
          <img  className={'menu-piece'} src='images/pieces/w_rook.png' alt="Torre BRANCA"/>
        </div>
        <h3 className={'text'}>ROQUE</h3>
      </div>
      <div className={'color-option'}>
        <div className={'color-button'} data-testid="test-check-mate"
             onClick={() =>  startGame(currentColor!, setCurrentColor,
               "CHECK_MATE", setGameState,
               setCurrentMenu, startGameMenu
             )}>
          <img  className={'menu-piece'} src='images/pieces/w_king.png' alt="Rei Branco"/>
        </div>
        <h3 className={'text'}>CHEQUE MATE</h3>
      </div>
      <div className={'color-option'}>
        <div className={'color-button'} data-testid="test-stale-mate"
             onClick={() =>  startGame(currentColor!, setCurrentColor,
               "STALE_MATE", setGameState,
               setCurrentMenu, startGameMenu
             )}>
          <img  className={'menu-piece'} src='images/pieces/b_king.png' alt="Rei Preto"/>
        </div>
        <h3 className={'text'}>STALEMATE</h3>
      </div>
      <div className={'color-option'}>
        <div className={'color-button'} data-testid="test-promotion"
             onClick={() =>  startGame(currentColor!, setCurrentColor,
               "PROMOTION", setGameState,
               setCurrentMenu, startGameMenu
             )}>
          <img  className={'menu-piece'} src='images/pieces/b_pawn.png' alt="Peão Preto"/>
        </div>
        <h3 className={'text'}>PROMOÇÃO</h3>
      </div>
      <div className={'color-option'}>
        <div className={'color-button'} data-testid="test-queen-madness"
             onClick={() =>  startGame(currentColor!, setCurrentColor,
               "QUEEN_MADNESS", setGameState,
               setCurrentMenu, startGameMenu
             )}>
          <img  className={'menu-piece'} src='images/pieces/b_queen.png' alt="Rainha preta"/>
        </div>
        <h3 className={'text'}>RINHA DE RAINHA</h3>
      </div>
      <button className={'return text'} onClick={() => {
        setCurrentMenu(currentMenu-1)
      }}>Voltar</button>
    </div>
  );
}