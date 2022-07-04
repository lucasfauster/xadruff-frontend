import {cleanup, fireEvent, render, screen} from "@testing-library/react";
import Menu from "../Menu";
import React from "react";

afterEach(cleanup);

describe('Custom States Menu', ()=> {
  it('chooses en passant', () => {
    render(<Menu/>);
    fireEvent.click(screen.getByText('JOGAR'))
    fireEvent.click(screen.getByTestId('test-sortear'))
    fireEvent.click(screen.getByTestId('test-easy'))
    fireEvent.click(screen.getByTestId('test-custom'))
    fireEvent.click(screen.getByTestId('test-en-passant'))
    expect(screen.getByTestId('test-board')).toBeTruthy();
  })

  it('chooses castle', () => {
    render(<Menu/>);
    fireEvent.click(screen.getByText('JOGAR'))
    fireEvent.click(screen.getByTestId('test-sortear'))
    fireEvent.click(screen.getByTestId('test-intermediate'))
    fireEvent.click(screen.getByTestId('test-custom'))
    fireEvent.click(screen.getByTestId('test-castle'))
    expect(screen.getByTestId('test-board')).toBeTruthy();
  })

  it('chooses check-mate', () => {
    render(<Menu/>);
    fireEvent.click(screen.getByText('JOGAR'))
    fireEvent.click(screen.getByTestId('test-sortear'))
    fireEvent.click(screen.getByTestId('test-intermediate'))
    fireEvent.click(screen.getByTestId('test-custom'))
    fireEvent.click(screen.getByTestId('test-check-mate'))
    expect(screen.getByTestId('test-board')).toBeTruthy();
  })
  it('chooses stale-mate', () => {
    render(<Menu/>);
    fireEvent.click(screen.getByText('JOGAR'))
    fireEvent.click(screen.getByTestId('test-sortear'))
    fireEvent.click(screen.getByTestId('test-intermediate'))
    fireEvent.click(screen.getByTestId('test-custom'))
    fireEvent.click(screen.getByTestId('test-stale-mate'))
    expect(screen.getByTestId('test-board')).toBeTruthy();
  })

  it('chooses promotion', () => {
    render(<Menu/>);
    fireEvent.click(screen.getByText('JOGAR'))
    fireEvent.click(screen.getByTestId('test-sortear'))
    fireEvent.click(screen.getByTestId('test-intermediate'))
    fireEvent.click(screen.getByTestId('test-custom'))
    fireEvent.click(screen.getByTestId('test-promotion'))
    expect(screen.getByTestId('test-board')).toBeTruthy();
  })

  it('chooses queen madness', () => {
    render(<Menu/>);
    fireEvent.click(screen.getByText('JOGAR'))
    fireEvent.click(screen.getByTestId('test-sortear'))
    fireEvent.click(screen.getByTestId('test-intermediate'))
    fireEvent.click(screen.getByTestId('test-custom'))
    fireEvent.click(screen.getByTestId('test-queen-madness'))
    expect(screen.getByTestId('test-board')).toBeTruthy();
  })

  it('returns to game option menu',() => {
    render(<Menu/>);
    fireEvent.click(screen.getByText('JOGAR'))
    fireEvent.click(screen.getByTestId('test-sortear'))
    fireEvent.click(screen.getByTestId('test-intermediate'))
    fireEvent.click(screen.getByTestId('test-custom'))
    fireEvent.click(screen.getByText('Voltar'))
    expect(screen.getByTestId('test-option-menu')).toBeTruthy();
  });
});