import "./Menu.css";
import React, {useState} from "react";
import Board from "../Board/Board";

export default function Menu() {

  const [color, setColor] = useState<String | null>(null);
  const [start, setStart] = useState<boolean>(false);
  const [colorMenu, setColorMenu] = useState<boolean>(false);

  function render_color_selection(){
    document.getElementById("row")!.remove();
    setColorMenu(true);
  }

  function start_game(option: String){
    setColorMenu(false);
    setColor(option);
    setStart(true);
  }

  function random_color() : String {
    const random:number = Math.floor(Math.random() * 2)
    return random === 0 ? 'w' : 'b';
  }

  if (!start){
    return(
      <div id='menu'>
        <div id ='row'>
          <img id='main-logo' src='images/logo.png' alt="XadrUFF"/>
          <button id='button' className={'text'}
                  onClick={() => render_color_selection()}>
            JOGAR
          </button>
        </div>

        { colorMenu &&
            <div id='color-menu'>
                <h2 className={'text'}>COM QUAIS PEÇAS VOCÊ QUER JOGAR?</h2>
                <div className={'color-option'}>
                    <div className={'color-button'}
                         onClick={() => start_game("b")}>
                        <img  className={'piece'} src='images/pieces/b_knight.png' alt="Cavalo Preto"/>
                    </div>
                    <h3 className={'text'}>PRETAS</h3>
                </div>
                <div className={'color-option'}>
                    <div className={'color-button'}
                         onClick={() => start_game("w")}>
                        <img  className={'piece'} src='images/pieces/w_rook.png' alt="Torre Branca"/>
                    </div>
                    <h3 className={'text'}>BRANCAS</h3>
                </div>
                <div className={'color-option'}>
                    <div className={'color-button'}
                         onClick={() => start_game(random_color())}>
                        <img  className={'piece'} src='images/dado.png' alt="Dado de Sorteio"/>
                    </div>
                    <h3 className={'text'}>SORTEAR</h3>
                </div>
            </div>
        }
      </div>
    );
  }
  else {
    // UFF-046.2 - Implemntar props para que o board recebe a cor escolhida
    return <Board/>
  }

}