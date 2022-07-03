import React from "react";

function randomColor() : boolean {
  return Math.floor(Math.random() * 2) === 0 ;
}

export function renderColorMenu(
   setColor: Function, currentMenu: number,
   setCurrentMenu: Function, gameOptionMenu: number,
){
  return (
    <div id='submenu' data-testid='test-color-menu'>
      <h2 className={'text'}>COM QUAIS PEÇAS VOCÊ QUER JOGAR?</h2>
        <div className='submenu-options'>
            <div className={'submenu-option'}>
                <div className={'submenu-button'} data-testid="test-pretas"
                     onClick={() => {setColor(false); setCurrentMenu(gameOptionMenu);}}>
                    <img  className={'menu-piece'} src='images/pieces/b_knight.png' alt="Cavalo Preto"/>
                </div>
                <h3 className={'text'}>PRETAS</h3>
            </div>
            <div className={'submenu-option'}>
                <div className={'submenu-button'} data-testid="test-brancas"
                     onClick={() => {setColor(true); setCurrentMenu(gameOptionMenu);}}>
                    <img  className={'menu-piece'} src='images/pieces/w_rook.png' alt="Torre Branca"/>
                </div>
                <h3 className={'text'}>BRANCAS</h3>
            </div>
            <div className={'submenu-option'}>
                <div className={'submenu-button'} data-testid="test-sortear"
                     onClick={() => { setColor(randomColor()); setCurrentMenu(gameOptionMenu) ;}}>
                    <img  className={'menu-piece'} src='images/dado.png' alt="Dado de Sorteio"/>
                </div>
                <h3 className={'text'}>SORTEAR</h3>
            </div>
        </div>
      <button className={'return text'} onClick={() => {
        setCurrentMenu(currentMenu-1);
      }}>Voltar
      </button>
    </div>
  );
}
