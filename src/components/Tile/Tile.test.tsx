import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import Tile from './Tile';

afterEach(cleanup);

describe('Tile', ()=>{
  it('renders empty dark tile', () => {
    render(<Tile id='a1' image={''} color={0} pieceColor={'b'} lastMovement={""} kingInCheckPosition={""} />);
    const tile = screen.getByTestId('test-dark-tile-a1')

    expect(tile).toBeTruthy()
    expect(tile).toHaveClass('dark-tile');
    expect(tile.childNodes.length).toEqual(0);
  });

  it('renders empty light tile', () => {
    render(<Tile id='a1' image={''} color={1} pieceColor={'w'} lastMovement={""} kingInCheckPosition={""} />);
    const tile = screen.getByTestId('test-light-tile-a1')

    expect(tile).toBeTruthy()
    expect(tile).toHaveClass('light-tile');
    expect(tile.childNodes.length).toEqual(0);
  });

  it('render dark tile with piece', () => {
    render(<Tile id='a1' image={'images/pieces/b_pawn.png'} color={0} pieceColor={'b'} lastMovement={""} kingInCheckPosition={""} />);
    const tile = screen.getByTestId('test-dark-tile-a1')

    expect(tile).toBeTruthy()
    expect(tile).toHaveClass('dark-tile');

    expect(tile.childNodes.length).toEqual(1);
    expect(tile.childNodes[0]).toHaveClass('b piece')
  });

  it('renders light tile with piece', () => {
    render(<Tile id='a1' image={'images/pieces/w_pawn.png'} color={1} pieceColor={'w'} lastMovement={""} kingInCheckPosition={""} />);
    const tile = screen.getByTestId('test-light-tile-a1')

    expect(tile).toBeTruthy()
    expect(tile).toHaveClass('light-tile');

    expect(tile.childNodes.length).toEqual(1);
    expect(tile.childNodes[0]).toHaveClass('w piece')
  });

  it('renders king in check', () => {
    render(<Tile id='a1' image={'images/pieces/w_pawn.png'} color={1} pieceColor={'w'} lastMovement={""} kingInCheckPosition={"a1"} />);
    const tile = screen.getByTestId('test-light-tile-a1')

    expect(tile).toBeTruthy()
    expect(tile).toHaveClass('king-in-check');
  });

  it('renders light last movement', () => {
    render(<Tile id='a1' image={'images/pieces/w_pawn.png'} color={1} pieceColor={'w'} lastMovement={"a1"} kingInCheckPosition={""} />);
    const tile = screen.getByTestId('test-light-tile-a1')

    expect(tile).toBeTruthy()
    expect(tile).toHaveClass('movement-light-tile');
  });

  it('renders dark last movement', () => {
    render(<Tile id='a1' image={'images/pieces/w_pawn.png'} color={0} pieceColor={'w'} lastMovement={"a1"} kingInCheckPosition={""} />);
    const tile = screen.getByTestId('test-dark-tile-a1')

    expect(tile).toBeTruthy()
    expect(tile).toHaveClass('movement-dark-tile');
  });
});