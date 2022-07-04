import React from "react";

export function renderLevelMenu(
    currentMenu: number, setCurrentMenu: Function,
    setCurrentLevel: Function, gameOptionMenu: number)
{
    return (
        <div id='submenu' data-testid="test-level-menu">
            <h2 className={'text'}>SELECIONE A DIFICULDADE</h2>
            <div className='submenu-options'>
                <div className={'submenu-option'}>
                    <div className={'submenu-button'} data-testid="test-easy"
                         onClick={() => {setCurrentLevel("BEGINNER"); setCurrentMenu(gameOptionMenu);}}>
                        <img  className={'menu-piece'} src='images/pieces/b_pawn.png' alt="Peão Preto"/>
                    </div>
                    <h3 className={'text'}>FÁCIL</h3>
                </div>
                <div className={'submenu-option'}>
                    <div className={'submenu-button'} data-testid="test-intermediate"
                         onClick={() => {setCurrentLevel("INTERMEDIATE"); setCurrentMenu(gameOptionMenu);}}>
                        <img  className={'menu-piece'} src='images/pieces/w_king.png' alt="Rei Branco"/>
                    </div>
                    <h3 className={'text'}>INTERMEDIÁRIO</h3>
                </div>
            </div>
            <button className={'return text'} onClick={() => {
                setCurrentMenu(currentMenu-1);
            }}>Voltar
            </button>
        </div>
    );
}
