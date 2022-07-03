import {cleanup, fireEvent, getByRole, render, screen} from "@testing-library/react";
import Board from "../Board"
import React from "react";
import {Piece, renderPieceByBoard} from "../BoardRenderer";
import {handleBoardState} from "../BoardStates";
import userEvent from "@testing-library/user-event";

afterEach(cleanup);

const initialPieces : Piece[] = []
const boardRequest = handleBoardState('DEFAULT')
renderPieceByBoard(initialPieces, boardRequest);

describe('Board', ()=> {
  it('renders white board initial state', () => {
    const view = render(<Board starter={true} boardRequest={boardRequest} initialPieces={initialPieces}/>);
    expect(view).toMatchSnapshot();
  });
  it('renders black board initial state', () => {
    const view = render(<Board starter={false} boardRequest={boardRequest} initialPieces={initialPieces}/>);
    expect(view).toMatchSnapshot();
  });
});

describe('Pieces', ()=> {
  it('selects piece',async () => {
    render(<Board starter={true} boardRequest={boardRequest} initialPieces={initialPieces}/>);
    const currentTile = screen.getByTestId('test-light-tile-a2')
    const pawn = screen.getByTestId('a2')

    expect(currentTile).not.toHaveClass('selected-tile');
    expect(pawn).toHaveClass('piece');
    expect(currentTile.childNodes[0]).toEqual(pawn);

    await userEvent.click(pawn);

    expect(currentTile).toHaveClass('selected-tile');
  })
});