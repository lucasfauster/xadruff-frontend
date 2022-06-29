import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import Tile from './Tile';

afterEach(cleanup);

describe('Tile', ()=>{
  it('renders empty dark tile', () => {
    render(<Tile id='a1' image={''} color={0} pieceColor={'b'} />);
    const tile = screen.getByTestId('test-dark-tile')

    expect(tile).toBeTruthy()
    expect(tile).toHaveClass('dark-tile');
    expect(tile.childNodes.length).toEqual(0);
  });

  it('renders empty light tile', () => {
    render(<Tile id='a1' image={''} color={1} pieceColor={'w'} />);
    const tile = screen.getByTestId('test-light-tile')

    expect(tile).toBeTruthy()
    expect(tile).toHaveClass('light-tile');
    expect(tile.childNodes.length).toEqual(0);
  });

  it('render dark tile with piece', () => {
    render(<Tile id='a1' image={'images/pieces/b_pawn.png'} color={0} pieceColor={'b'} />);
    const tile = screen.getByTestId('test-dark-tile')

    expect(tile).toBeTruthy()
    expect(tile).toHaveClass('dark-tile');

    expect(tile.childNodes.length).toEqual(1);
    expect(tile.childNodes[0]).toHaveClass('b piece')
  });

  it('renders light tile with piece', () => {
    render(<Tile id='a1' image={'images/pieces/w_pawn.png'} color={1} pieceColor={'w'} />);
    const tile = screen.getByTestId('test-light-tile')

    expect(tile).toBeTruthy()
    expect(tile).toHaveClass('light-tile');

    expect(tile.childNodes.length).toEqual(1);
    expect(tile.childNodes[0]).toHaveClass('w piece')
  });

});