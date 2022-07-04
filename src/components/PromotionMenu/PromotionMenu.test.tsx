/* eslint no-use-before-define: 0 */
/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-render-in-setup */

import {act, cleanup, fireEvent, render, screen} from "@testing-library/react";
import Board from "../Board/Board"
import React from "react";
import {Piece, renderPieceByBoard} from "../Board/BoardRenderer";
import {handleBoardState} from "../Board/BoardStates";

afterEach(cleanup);

const initialPieces : Piece[] = []
const boardRequest = handleBoardState('PROMOTION')
renderPieceByBoard(initialPieces, boardRequest);

function getWhitePromotionFetchMock() {
  return jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(
        {
          board_id: "49270B66-713D-4C39-8401-6574E244A802",
          legal_movements: {"a7": ["a8PQ","a8PB","a8PR","a8PN"]},
          ai_movement: "b7b8Ke1"
        }),
    }),
  ) as jest.Mock;
}

function getBlackPromotionFetchMock() {
  return jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(
        {
          board_id: "49270B66-713D-4C39-8401-6574E244A802",
          legal_movements: {"h2": ["h1Pq","h1Pb","h1Pr","h1Pn"]},
          ai_movement: "b7b8Ke1"
        }),
    }),
  ) as jest.Mock;
}

describe('Promotion Menu', ()=> {
  it('should promotion menu', async () => {
    global.fetch = getWhitePromotionFetchMock()
    const initialPieces: Piece[] = []
    const boardRequest = handleBoardState('PROMOTION')
    renderPieceByBoard(initialPieces, boardRequest);
    await act(async () => {
      render(<Board level={"INTERMEDIATE"}
        starter={true}
        boardRequest={boardRequest}
        initialPieces={initialPieces}
        setCurrentMenu={ () => {console.log("ignore")}
        }/>)
    })
    const piece = await screen.findByTestId("a7");
    const futureTile =  await  screen.findByTestId("test-light-tile-a8");
    fireEvent.click(piece);
    fireEvent.click(futureTile);
    expect(await screen.findByTestId("test-promotion")).toBeTruthy();
  })
  
  describe('handle promotion white pieces', ()=>{
    it('chooses queen',  async() => {
      global.fetch = getWhitePromotionFetchMock()
      const initialPieces: Piece[] = []
      const boardRequest = handleBoardState('PROMOTION')
      renderPieceByBoard(initialPieces, boardRequest);
      await act(async () => {
        render(<Board level={"INTERMEDIATE"}
          starter={true}
          boardRequest={boardRequest}
          initialPieces={initialPieces}
          setCurrentMenu={() => {console.log("ignore")}
          }/>)
      })

      const piece = await screen.findByTestId("a7");
      const futureTile =  await  screen.findByTestId("test-light-tile-a8");
      fireEvent.click(piece);
      fireEvent.click(futureTile);
      expect(await screen.findByTestId("test-promotion")).toBeTruthy();

      await act(async () => {
        fireEvent.click(await screen.findByTestId('test-promotion-queen'))
      })
      expect(await screen.findByTestId("a8")).toHaveStyle(`background-image: url(images/pieces/w_queen.png)`)

    });
    it('chooses bishop',  async() => {
      global.fetch = getWhitePromotionFetchMock()
      const initialPieces: Piece[] = []
      const boardRequest = handleBoardState('PROMOTION')
      renderPieceByBoard(initialPieces, boardRequest);
      await act(async () => {
        render(<Board level={"INTERMEDIATE"}
          starter={true}
          boardRequest={boardRequest}
          initialPieces={initialPieces}
          setCurrentMenu={() => {console.log("ignore")}
          }/>)
      })

      const piece = await screen.findByTestId("a7");
      const futureTile =  await  screen.findByTestId("test-light-tile-a8");
      fireEvent.click(piece);
      fireEvent.click(futureTile);
      expect(await screen.findByTestId("test-promotion")).toBeTruthy();

      await act(async () => {
        fireEvent.click(await screen.findByTestId('test-promotion-bishop'))
      })
      expect(await screen.findByTestId("a8")).toHaveStyle(`background-image: url(images/pieces/w_bishop.png)`)

    });
    it('chooses rook',  async() => {
      global.fetch = getWhitePromotionFetchMock()
      const initialPieces: Piece[] = []
      const boardRequest = handleBoardState('PROMOTION')
      renderPieceByBoard(initialPieces, boardRequest);
      await act(async () => {
        render(<Board level={"INTERMEDIATE"}
          starter={true}
          boardRequest={boardRequest}
          initialPieces={initialPieces}
          setCurrentMenu={() => {console.log("ignore")}
          }/>)
      })

      const piece = await screen.findByTestId("a7");
      const futureTile =  await  screen.findByTestId("test-light-tile-a8");
      fireEvent.click(piece);
      fireEvent.click(futureTile);

      expect(await screen.findByTestId("test-promotion")).toBeTruthy();

      await act(async () => { fireEvent.click(await screen.findByTestId('test-promotion-rook'))})

      expect(await screen.findByTestId("a8")).toHaveStyle(`background-image: url(images/pieces/w_rook.png)`)

    });
    it('chooses knight',  async() => {
      global.fetch = getWhitePromotionFetchMock()
      const initialPieces: Piece[] = []
      const boardRequest = handleBoardState('PROMOTION')
      renderPieceByBoard(initialPieces, boardRequest);
      await act(async () => {
        render(<Board level={"INTERMEDIATE"}
          starter={true}
          boardRequest={boardRequest}
          initialPieces={initialPieces}
          setCurrentMenu={() => {console.log("ignore")}
          }/>)
      })

      const piece = await screen.findByTestId("a7");
      const futureTile =  await  screen.findByTestId("test-light-tile-a8");
      fireEvent.click(piece);
      fireEvent.click(futureTile);
      expect(await screen.findByTestId("test-promotion")).toBeTruthy();

      await act(async () => {
        fireEvent.click(await screen.findByTestId('test-promotion-knight'))
      })
      expect(await screen.findByTestId("a8")).toHaveStyle(`background-image: url(images/pieces/w_knight.png)`)

    });
  });

  describe('handle promotion black pieces', ()=>{
    it('chooses queen',  async() => {
      global.fetch = getBlackPromotionFetchMock()
      const initialPieces: Piece[] = []
      const boardRequest = handleBoardState('PROMOTION')
      renderPieceByBoard(initialPieces, boardRequest);
      await act(async () => {
        render(<Board level={"INTERMEDIATE"}
          starter={false}
          boardRequest={boardRequest}
          initialPieces={initialPieces}
          setCurrentMenu={() => {console.log("ignore")}
          }/>)
      })

      const piece = await screen.findByTestId("h2");
      const futureTile =  await  screen.findByTestId("test-light-tile-h1");
      fireEvent.click(piece);
      fireEvent.click(futureTile);
      expect(await screen.findByTestId("test-promotion")).toBeTruthy();

      await act(async () => {
        fireEvent.click(await screen.findByTestId('test-promotion-queen'))
      })
      expect(await screen.findByTestId("h1")).toHaveStyle(`background-image: url(images/pieces/b_queen.png)`)

    });
  });

  describe('handle ia promotion', ()=>{
    it('chooses queen',  async() => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(
            {
              board_id: "49270B66-713D-4C39-8401-6574E244A802",
              legal_movements: {"h2": ["h1Pq","h1Pb","h1Pr","h1Pn"]},
              ai_movement: "g7g8PQ"
            }),
        }),
      ) as jest.Mock;
      const initialPieces: Piece[] = []
      const boardRequest = handleBoardState('PROMOTION')
      renderPieceByBoard(initialPieces, boardRequest);
      await act(async () => {
        render(<Board level={"INTERMEDIATE"}
          starter={false}
          boardRequest={boardRequest}
          initialPieces={initialPieces}
          setCurrentMenu={() => {console.log("ignore")}
          }/>)
      })

      await act(async () => {
        expect(await screen.findByTestId("g8")).toHaveStyle(`background-image: url(images/pieces/w_queen.png)`)
      })

    });
  });
});
