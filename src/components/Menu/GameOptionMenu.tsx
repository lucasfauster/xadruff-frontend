import React from "react";

export function renderGameOptionMenu(
  currentMenu: number, setCurrentMenu: Function,
  currentColor: boolean, setCurrentColor: Function,
  setGameState: Function, startGameMenu: number, customStatesMenu: number)
{
  return (
    <div id='state-menu'>
      <h2 className={'text'}>QUAL OPÇÃO DE JOGO?</h2>
      <div className={'state-option'}>
        <div className={'state-button'} data-testid="test-default"
             onClick={() => {
               setGameState("DEFAULT");
               setCurrentColor(currentColor);
               setCurrentMenu(startGameMenu);
             }}>
          <img  className={'menu-piece'} src='images/pieces/b_king.png' alt="Rei Preto"/>
        </div>
        <h3 className={'text'}>PADRÃO</h3>
      </div>
      <div className={'state-option'}>
        <div className={'state-button'} data-testid="test-custom"
             onClick={() => setCurrentMenu(customStatesMenu)}>
          <img  className={'menu-piece'} src='images/pieces/w_queen.png' alt="Rainha Branca"/>
        </div>
        <h3 className={'text'}>PERSONALIZADO</h3>
      </div>
      <button className={'return'} onClick={() => {
        setCurrentMenu(currentMenu-1);
      }}>Voltar
      </button>
    </div>
  );
}

