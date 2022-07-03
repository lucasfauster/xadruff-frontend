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
    const view = render(<Board starter={true} boardRequest={boardRequest} initialPieces={initialPieces} setCurrentMenu={function a() {
    console.log("Ok")}
    }/>);
    expect(view).toMatchSnapshot();
  });
  it('renders black board initial state', () => {
    const view = render(<Board starter={false} boardRequest={boardRequest} initialPieces={initialPieces} setCurrentMenu={function a() {
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
      render(<Board
          starter={true}
          boardRequest={boardRequest}
          initialPieces={initialPieces}
          setCurrentMenu={
            function a() {
              console.log("ignora essa merda")
            }
          }/>)
    })
    const currentTile = await screen.findByTestId('test-light-tile-a2')
    const pawn = await screen.findByTestId('a2')
    expect(currentTile).not.toHaveClass('selected-tile');
    expect(pawn).toHaveClass('piece');
    expect((currentTile).childNodes[0]).toEqual(pawn);
    fireEvent.click(pawn);
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
          render(<Board
              starter={true}
              boardRequest={boardRequest}
              initialPieces={initialPieces}
              setCurrentMenu={
                function a() {
                  console.log("ignora essa merda")
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
            render(<Board
                starter={false}
                boardRequest={boardRequest}
                initialPieces={initialPieces}
                setCurrentMenu={
                    function a() {
                        console.log("ignora essa merda")
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
            render(<Board
                starter={true}
                boardRequest={boardRequest}
                initialPieces={initialPieces}
                setCurrentMenu={
                    function a() {
                        console.log("ignora essa merda")
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
            render(<Board
                starter={false}
                boardRequest={boardRequest}
                initialPieces={initialPieces}
                setCurrentMenu={
                    function a() {
                        console.log("ignora essa merda")
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
            render(<Board
                starter={true}
                boardRequest={boardRequest}
                initialPieces={initialPieces}
                setCurrentMenu={
                    function a() {
                        console.log("ignora essa merda")
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
            render(<Board
                starter={false}
                boardRequest={boardRequest}
                initialPieces={initialPieces}
                setCurrentMenu={
                    function a() {
                        console.log("ignora essa merda")
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