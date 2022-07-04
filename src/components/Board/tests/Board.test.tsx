/* eslint no-use-before-define: 0 */
/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-render-in-setup */
/* eslint-disable testing-library/no-await-sync-query */

import {act, cleanup, fireEvent, render, screen} from "@testing-library/react";
import Board from "../Board"
import React from "react";
import {Piece, renderPieceByBoard} from "../BoardRenderer";
import {handleBoardState} from "../BoardStates";

afterEach(cleanup);

const initialPieces : Piece[] = []
const boardRequest = handleBoardState('DEFAULT')
renderPieceByBoard(initialPieces, boardRequest);

function getCreateGameFetchMock() {
  return jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(
            {
              board_id: "49270B66-713D-4C39-8401-6574E244A802",
              legal_movements: {
                "a2": [
                  "a3",
                  "a4",
                  "a7C",
                  "a8C"
                ]
              },
              ai_movement: "b7b8Ke1"
            }),
      }),
  ) as jest.Mock;
}


describe('Board', ()=> {
  it('renders white board initial state', () => {
    const view = render(<Board level={"INTERMEDIATE"} starter={true} boardRequest={boardRequest} initialPieces={initialPieces} setCurrentMenu={function a() {
    console.log("Ok")}
    }/>);
    expect(view).toMatchSnapshot();
  });
  it('renders black board initial state', () => {
    const view = render(<Board level={"INTERMEDIATE"} starter={false} boardRequest={boardRequest} initialPieces={initialPieces} setCurrentMenu={function a() {
      console.log("Ok")}
    }/>);
    expect(view).toMatchSnapshot();
  });
});

describe('Highlights', ()=> {
  it('should have legal-movements and capture movements highlights', async () => {
    global.fetch = getCreateGameFetchMock()
    const initialPieces: Piece[] = []
    const boardRequest = handleBoardState('DEFAULT')
    renderPieceByBoard(initialPieces, boardRequest);
    await act(async () => {
      render(<Board level={"INTERMEDIATE"}
          starter={true}
          boardRequest={boardRequest}
          initialPieces={initialPieces}
          setCurrentMenu={
            function a() {
              console.log("ignore")
            }
          }/>)
    })
    const currentTile = await screen.findByTestId('test-light-tile-a2')
    const piece = await screen.findByTestId('a2')
    expect(currentTile).not.toHaveClass('selected-tile');
    expect(piece).toHaveClass('piece');
    expect((currentTile).childNodes[0]).toEqual(piece);
    fireEvent.click(piece);
    expect(currentTile).toHaveClass('selected-tile');

    const highlightDarkTile = await screen.findByTestId('test-dark-tile-a3')
    const highlightLightTile = await screen.findByTestId('test-light-tile-a4')
    const highlightCaptureDarkTile = await screen.findByTestId('test-dark-tile-a7')
    const highlightCaptureLightTile = await screen.findByTestId('test-light-tile-a8')
    const highlightLastMovementLightTile = await screen.findByTestId('test-light-tile-b7')
    const highlightLastMovementDarkTile = await screen.findByTestId('test-dark-tile-b8')
    const highlightKingInCheckTile = await screen.findByTestId('test-dark-tile-e1')

    expect(highlightCaptureLightTile).toHaveClass('attack-movements-light-tile');
    expect(highlightCaptureDarkTile).toHaveClass('attack-movements-dark-tile');
    expect(highlightLightTile).toHaveClass('legal-movements-light-tile');
    expect(highlightDarkTile).toHaveClass('legal-movements-dark-tile');
    expect(highlightLastMovementDarkTile).toHaveClass('movement-dark-tile');
    expect(highlightLastMovementLightTile).toHaveClass('movement-light-tile');
    expect(highlightKingInCheckTile).toHaveClass('king-in-check');
  })
})

describe('Endgames', () => {
    it('should end by white surrender when clicking surrender button', async () => {
        global.fetch = getCreateGameFetchMock();
        const initialPieces: Piece[] = []
        const boardRequest = handleBoardState('DEFAULT')
        renderPieceByBoard(initialPieces, boardRequest);
        await act(async () => {
          render(<Board level={"INTERMEDIATE"}
              starter={true}
              boardRequest={boardRequest}
              initialPieces={initialPieces}
              setCurrentMenu={
                function a() {
                  console.log("ignore")
                }
              }/>)
        })

        global.fetch = jest.fn(() =>
            Promise.resolve({
              json: () => Promise.resolve(
                  {
                    endgame: {
                      winner: "BLACK",
                      endgame_message: "Ended by surrender."
                    }
                  }),
            }),
        ) as jest.Mock;

        const surrenderButton = await screen.getByRole('button')
        await act(async () => {
            fireEvent.click(surrenderButton)

        })
        const feedback = await screen.findByTestId('test-feedback')
        expect(feedback.childNodes[0]).toHaveTextContent("Vitória das pretas por desistência")
        const playAgain = await screen.getByRole('button')
        expect(playAgain).toHaveTextContent("JOGAR NOVAMENTE")
    })

    it('should end by black surrender when clicking surrender button', async () => {
        global.fetch = getCreateGameFetchMock();
        const initialPieces: Piece[] = []
        const boardRequest = handleBoardState('DEFAULT')
        renderPieceByBoard(initialPieces, boardRequest);
        await act(async () => {
            render(<Board level={"INTERMEDIATE"}
                starter={false}
                boardRequest={boardRequest}
                initialPieces={initialPieces}
                setCurrentMenu={
                    function a() {
                        console.log("ignore")
                    }
                }/>)
        })

        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(
                    {
                        endgame: {
                            winner: "WHITE",
                            endgame_message: "Ended by surrender."
                        }
                    }),
            }),
        ) as jest.Mock;

        const surrenderButton = await screen.getByRole('button')
        await act(async () => {
            fireEvent.click(surrenderButton)

        })
        const feedback = await screen.findByTestId('test-feedback')
        expect(feedback.childNodes[0]).toHaveTextContent("Vitória das brancas por desistência")
        const playAgain = await screen.getByRole('button')
        expect(playAgain).toHaveTextContent("JOGAR NOVAMENTE")
    })

    it('should end by black checkmate', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(
                    {
                        board_id: "49270B66-713D-4C39-8401-6574E244A802",
                        ai_movement: "b7b8Ke1",
                        endgame: {
                            winner: "BLACK",
                            endgame_message: "Ended by checkmate."
                        }
                    }),
            }),
        ) as jest.Mock;
        const initialPieces: Piece[] = []
        const boardRequest = handleBoardState('DEFAULT')
        renderPieceByBoard(initialPieces, boardRequest);
        await act(async () => {
            render(<Board level={"INTERMEDIATE"}
                starter={true}
                boardRequest={boardRequest}
                initialPieces={initialPieces}
                setCurrentMenu={
                    function a() {
                        console.log("ignore")
                    }
                }/>)
        })

        const kingTile = await screen.findByTestId('test-dark-tile-e1')
        expect(kingTile).toHaveClass('king-in-check')
        const feedback = await screen.findByTestId('test-feedback')
        expect(feedback.childNodes[0]).toHaveTextContent("Vitória das pretas por xeque-mate")
        const playAgain = await screen.getByRole('button')
        expect(playAgain).toHaveTextContent("JOGAR NOVAMENTE")
    })

    it('should end by white checkmate', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(
                    {
                        board_id: "49270B66-713D-4C39-8401-6574E244A802",
                        ai_movement: "b2b3Ke8",
                        endgame: {
                            winner: "WHITE",
                            endgame_message: "Ended by checkmate."
                        }
                    }),
            }),
        ) as jest.Mock;
        const initialPieces: Piece[] = []
        const boardRequest = handleBoardState('DEFAULT')
        renderPieceByBoard(initialPieces, boardRequest);
        await act(async () => {
            render(<Board level={"INTERMEDIATE"}
                starter={false}
                boardRequest={boardRequest}
                initialPieces={initialPieces}
                setCurrentMenu={
                    function a() {
                        console.log("ignore")
                    }
                }/>)
        })

        const kingTile = await screen.findByTestId('test-light-tile-e8')
        expect(kingTile).toHaveClass('king-in-check')
        const feedback = await screen.findByTestId('test-feedback')
        expect(feedback.childNodes[0]).toHaveTextContent("Vitória das brancas por xeque-mate")
        const playAgain = await screen.getByRole('button')
        expect(playAgain).toHaveTextContent("JOGAR NOVAMENTE")
    })

    it('should end by draw with stalemate', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(
                    {
                        board_id: "49270B66-713D-4C39-8401-6574E244A802",
                        ai_movement: "b7b8",
                        endgame: {
                            winner: "DRAW",
                            endgame_message: "Draw by stalemate."
                        }
                    }),
            }),
        ) as jest.Mock;
        const initialPieces: Piece[] = []
        const boardRequest = handleBoardState('DEFAULT')
        renderPieceByBoard(initialPieces, boardRequest);
        await act(async () => {
            render(<Board level={"INTERMEDIATE"}
                starter={true}
                boardRequest={boardRequest}
                initialPieces={initialPieces}
                setCurrentMenu={
                    function a() {
                        console.log("ignore")
                    }
                }/>)
        })

        const feedback = await screen.findByTestId('test-feedback')
        expect(feedback.childNodes[0]).toHaveTextContent("Empate por afogamento do rei")
        const playAgain = await screen.getByRole('button')
        expect(playAgain).toHaveTextContent("JOGAR NOVAMENTE")
    })

    it('should end by draw with 50 movements rule', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(
                    {
                        board_id: "49270B66-713D-4C39-8401-6574E244A802",
                        ai_movement: "b2b3",
                        endgame: {
                            winner: "DRAW",
                            endgame_message: "Draw by 50 movements rule."
                        }
                    }),
            }),
        ) as jest.Mock;
        const initialPieces: Piece[] = []
        const boardRequest = handleBoardState('DEFAULT')
        renderPieceByBoard(initialPieces, boardRequest);
        await act(async () => {
            render(<Board level={"INTERMEDIATE"}
                starter={false}
                boardRequest={boardRequest}
                initialPieces={initialPieces}
                setCurrentMenu={
                    function a() {
                        console.log("ignore")
                    }
                }/>)
        })

        const feedback = await screen.findByTestId('test-feedback')
        expect(feedback.childNodes[0]).toHaveTextContent("Empate por regra de 50 movimentos")
        const playAgain = await screen.getByRole('button')
        expect(playAgain).toHaveTextContent("JOGAR NOVAMENTE")
    })
    }
)

describe('movements', ()=>{
  it('selects piece then unselects',  async () => {
    global.fetch = getCreateGameFetchMock()
    const initialPieces: Piece[] = []
    const boardRequest = handleBoardState('DEFAULT')
    renderPieceByBoard(initialPieces, boardRequest);
    await act(async () => {
      render(<Board level={"INTERMEDIATE"}
        starter={true}
        boardRequest={boardRequest}
        initialPieces={initialPieces}
        setCurrentMenu={ () => {console.log("ignore") }
        }/>)
    })

    const currentTile = await screen.findByTestId('test-light-tile-a2')
    const piece = await screen.findByTestId('a2')
    expect(currentTile).not.toHaveClass('selected-tile');
    fireEvent.click(piece);
    expect(currentTile).toHaveClass('selected-tile');
    fireEvent.click(piece);
    expect(currentTile).not.toHaveClass('selected-tile');

  });

  it('moves piece',  async () => {
    global.fetch = getCreateGameFetchMock()
    const initialPieces: Piece[] = []
    const boardRequest = handleBoardState('DEFAULT')
    renderPieceByBoard(initialPieces, boardRequest);
    await act(async () => {
      render(<Board level={"INTERMEDIATE"}
        starter={true}
        boardRequest={boardRequest}
        initialPieces={initialPieces}
        setCurrentMenu={ () => {console.log("ignore") }
        }/>)
    })

    let piece = await screen.findByTestId('a2')
    let futureTile = await screen.findByTestId('test-light-tile-a4')
    expect((futureTile).childNodes.length).toEqual(0);

    fireEvent.click(piece);

    await act(async () => {
      fireEvent.click(futureTile);
    });

    piece = await screen.findByTestId('a4')
    futureTile = await screen.findByTestId('test-light-tile-a4')
    expect((futureTile).childNodes.length).toEqual(1);
    expect(await (futureTile).childNodes[0]).toEqual(piece);
  });

  it('changes piece',  async () => {
    global.fetch = getCreateGameFetchMock()
    const initialPieces: Piece[] = []
    const boardRequest = handleBoardState('DEFAULT')
    renderPieceByBoard(initialPieces, boardRequest);
    await act(async () => {
      render(<Board level={"INTERMEDIATE"}
        starter={true}
        boardRequest={boardRequest}
        initialPieces={initialPieces}
        setCurrentMenu={ () => {console.log("ignore") }
        }/>)
    })

    const currentTile = await screen.findByTestId('test-light-tile-a2')
    const nextTile = await screen.findByTestId('test-dark-tile-b2')
    const piece = await screen.findByTestId('a2')
    const nextPiece = await screen.findByTestId('b2')

    fireEvent.click(piece);
    expect(currentTile).toHaveClass('selected-tile');
    expect(nextTile).not.toHaveClass('selected-tile');

    fireEvent.click(nextPiece);
    expect(currentTile).not.toHaveClass('selected-tile');
    expect(nextTile).toHaveClass('selected-tile');

  });


  it('castle',  async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(
          {
            board_id: "49270B66-713D-4C39-8401-6574E244A802",
            legal_movements: {"e1": ["c1Oa1d1'"]},
            ai_movement: "b7b8Ke1"
          }),
      }),
    ) as jest.Mock;
    const initialPieces: Piece[] = []
    const boardRequest = handleBoardState('CASTLE')
    renderPieceByBoard(initialPieces, boardRequest);
    await act(async () => {
      render(<Board level={"INTERMEDIATE"}
        starter={true}
        boardRequest={boardRequest}
        initialPieces={initialPieces}
        setCurrentMenu={ () => {console.log("ignore") }
        }/>)
    })

    let king = await screen.findByTestId('e1')
    let rook = await screen.findByTestId('a1')

    fireEvent.click(king);
    fireEvent.click(rook);
    await act(async () => {
      expect(await screen.findByTestId("c1")).toHaveStyle(`background-image: url(images/pieces/w_king.png)`)
      expect(await screen.findByTestId("d1")).toHaveStyle(`background-image: url(images/pieces/w_rook.png)`)
    })
  });

  it('selects piece clicks outside',  async () => {
    global.fetch = getCreateGameFetchMock()
    const initialPieces: Piece[] = []
    const boardRequest = handleBoardState('DEFAULT')
    renderPieceByBoard(initialPieces, boardRequest);
    await act(async () => {
      render(<Board level={"INTERMEDIATE"}
        starter={true}
        boardRequest={boardRequest}
        initialPieces={initialPieces}
        setCurrentMenu={ () => {console.log("ignore") }
        }/>)
    })

    const currentTile = await screen.findByTestId('test-light-tile-a2')
    const nextTile = await screen.findByTestId('test-light-tile-b3')
    const piece = await screen.findByTestId('a2')

    fireEvent.click(piece);
    expect(currentTile).toHaveClass('selected-tile');
    expect(nextTile).not.toHaveClass('selected-tile');
    await act(async () => {
      fireEvent.click(nextTile);
    })
    expect(currentTile).not.toHaveClass('selected-tile');
    expect(nextTile).not.toHaveClass('selected-tile');

  });

  it('en passant',  async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(
          {
            board_id: "49270B66-713D-4C39-8401-6574E244A802",
            legal_movements: {"d4": ["e3CEe4Kb1"]},
            ai_movement: "e2e4"
          }),
      }),
    ) as jest.Mock;
    const initialPieces: Piece[] = []
    const boardRequest = handleBoardState('EN_PASSANT')
    renderPieceByBoard(initialPieces, boardRequest);
    await act(async () => {
      render(<Board level={"INTERMEDIATE"}
        starter={false}
        boardRequest={boardRequest}
        initialPieces={initialPieces}
        setCurrentMenu={ () => {console.log("ignore") }
        }/>)
    })

    let pawn= await screen.findByTestId('d4')
    let tile = await screen.findByTestId('test-dark-tile-e3')
    fireEvent.click(pawn);

    await act(async () => {
      fireEvent.click(tile);
    });

    await act(async () => {
      expect(await screen.findByTestId("e3")).toHaveStyle(`background-image: url(images/pieces/b_pawn.png)`)
      expect(await screen.findByTestId("e3")).not.toHaveStyle(`background-image: url(images/pieces/w_pawn.png)`)
    })
  });


})