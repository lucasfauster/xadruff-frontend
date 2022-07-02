import "./Menu.css";
import React, {useState} from "react";
import Board from "../Board/Board";
import {Piece, renderPieceByBoard} from "../Board/BoardRenderer"
import {handleBoardState} from "../Board/BoardStates";
import {renderColorMenu} from "./ColorMenu";
import {renderGameOptionMenu} from "./GameOptionMenu";
import {renderCustomStatesMenu} from "./CustomStatesMenu";

const mainMenu : number = 0;
const colorMenu : number = 1;
const gameOptionMenu : number = 2;
const customStatesMenu : number = 3;
const startGameMenu : number = 4;


export default function Menu() {
  const [currentColor, setCurrentColor] = useState<boolean | null>(null);
  const [gameState, setGameState] = useState<string>("DEFAULT");
  const [currentMenu, setCurrentMenu] = useState<number>(0);

  function renderMainMenu(){
    return(
      <div id ='row'>
        <img id='main-logo' src='images/logo.png' alt="XadrUFF"/>
        <button id='button' className={'text'}
                onClick={() => setCurrentMenu(colorMenu)}> JOGAR
        </button>
      </div>
    );
  }

  switch (currentMenu)
  {
    case mainMenu:
      return (<div id='menu'>{ renderMainMenu() }</div>);
    case colorMenu:
      return (<div id='menu'>
                { renderColorMenu(setCurrentColor, currentMenu,
                  setCurrentMenu, gameOptionMenu) }
              </div>);

    case gameOptionMenu:
      return (<div id='menu'>
                { renderGameOptionMenu(currentMenu,setCurrentMenu,
                  currentColor!, setCurrentColor, setGameState,
                  startGameMenu, customStatesMenu) }
              </div>);

    case customStatesMenu:
      return (<div id='menu'>
                { renderCustomStatesMenu(currentMenu, setCurrentMenu,
                  currentColor!, setCurrentColor, setGameState, startGameMenu) }
              </div>);

    case startGameMenu:
      const initialPieces : Piece[] = []
      const boardRequest = handleBoardState(gameState)
      renderPieceByBoard(initialPieces, boardRequest)
      return (<Board starter={currentColor!} boardRequest={boardRequest} initialPieces={initialPieces}/>);

    default:
      return (<div id='menu'>{ renderMainMenu() }</div>);
  }
}

