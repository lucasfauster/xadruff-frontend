import "./Menu.css";
import React, {useState} from "react";
import Board from "../Board/Board";

export default function Menu() {

  const [color, setColor] = useState<boolean | null>(null);
  const [canRenderBoard, setCanRenderBoard] = useState<boolean>(false);
  const [canRenderColorMenu, setCanRenderColorMenu] = useState<boolean>(false);

  function renderColorSelection(){
    document.getElementById("row")!.remove();
    setCanRenderColorMenu(true);
  }

  function startGame(option: boolean){
    setCanRenderColorMenu(false);
    setColor(option);
    setCanRenderBoard(true);
  }

  function randomColor() : boolean {
    return Math.floor(Math.random() * 2) === 0 ;
  }

  function renderColorMenu(){
    return (
      <div id='color-menu'>
        <h2 className={'text'}>COM QUAIS PEÇAS VOCÊ QUER JOGAR?</h2>
        <div className={'color-option'}>
          <div className={'color-button'} data-testid="test-pretas"
               onClick={() => startGame(false)}>
            <img  className={'menu-piece'} src='images/pieces/b_knight.png' alt="Cavalo Preto"/>
          </div>
          <h3 className={'text'}>PRETAS</h3>
        </div>
        <div className={'color-option'}>
          <div className={'color-button'} data-testid="test-brancas"
               onClick={() => startGame(true)}>
            <img  className={'menu-piece'} src='images/pieces/w_rook.png' alt="Torre Branca"/>
          </div>
          <h3 className={'text'}>BRANCAS</h3>
        </div>
        <div className={'color-option'}>
          <div className={'color-button'} data-testid="test-sortear"
               onClick={() => startGame(randomColor())}>
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
    return (<Board starter={color!}/>);
  }
  else{
    return(
      <div id='menu'>
        { renderMainMenu() }
        { canRenderColorMenu && renderColorMenu() }
      </div>
    );
  }
}