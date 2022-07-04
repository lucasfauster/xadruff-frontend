import {act, cleanup, fireEvent, render, screen} from "@testing-library/react";
import {Piece, renderPieceByBoard} from "../Board/BoardRenderer";
import {handleBoardState} from "../Board/BoardStates";
import Board from "../Board/Board";
import React from "react";

afterEach(cleanup);
const initialPieces : Piece[] = []
const boardRequest = handleBoardState('DEFAULT')
renderPieceByBoard(initialPieces, boardRequest);

describe('Move to Capture Area', ()=> {

    it('should capture white rook and send to capture area tile', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(
                    {
                        board_id: "49270B66-713D-4C39-8401-6574E244A802",
                        legal_movements: {
                            "a2": [
                                "a3"
                            ]
                        },
                        ai_movement: "b7a1C"
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
                        console.log("ignore")
                    }
                }/>)
        })

        const rook = await screen.findByTestId('w-death-0')
        expect(rook).toHaveClass('piece');
        const tile = await screen.findByTestId('test-dark-tile-w-death-0')
        expect((tile).childNodes[0]).toEqual(rook);
    })

    it('should capture black rook and send to capture area tile', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(
                    {
                        board_id: "49270B66-713D-4C39-8401-6574E244A802",
                        legal_movements: {
                            "a2": [
                                "a3"
                            ]
                        },
                        ai_movement: "b1a8C"
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
                        console.log("ignore")
                    }
                }/>)
        })

        const rook = await screen.findByTestId('b-death-0')
        expect(rook).toHaveClass('piece');
        const tile = await screen.findByTestId('test-dark-tile-b-death-0')
        expect((tile).childNodes[0]).toEqual(rook);
    })
})