import {cleanup, fireEvent, render, screen} from "@testing-library/react";
import Menu from "../Menu";
import React from "react";

afterEach(cleanup);

describe('Game Option Menu', ()=> {
  it('renders game option menu', () => {
    render(<Menu/>);
    fireEvent.click(screen.getByText('JOGAR'))
    fireEvent.click(screen.getByTestId('test-sortear'))
    fireEvent.click(screen.getByTestId('test-intermediate'))
    expect(screen.getByTestId('test-option-menu')).toBeTruthy();
  })

  it('chooses default', () => {
    render(<Menu/>);
    fireEvent.click(screen.getByText('JOGAR'))
    fireEvent.click(screen.getByTestId('test-sortear'))
    fireEvent.click(screen.getByTestId('test-intermediate'))
    fireEvent.click(screen.getByTestId('test-default'))
    expect(screen.getByTestId('test-board')).toBeTruthy();
  })

  it('chooses custom states', () => {
    render(<Menu/>);
    fireEvent.click(screen.getByText('JOGAR'))
    fireEvent.click(screen.getByTestId('test-sortear'))
    fireEvent.click(screen.getByTestId('test-intermediate'))
    fireEvent.click(screen.getByTestId('test-custom'))
    expect(screen.getByTestId('test-custom-states')).toBeTruthy();
  })

  it('returns to level menu',() => {
    render(<Menu/>);
    fireEvent.click(screen.getByText('JOGAR'))
    fireEvent.click(screen.getByTestId('test-sortear'))
    fireEvent.click(screen.getByTestId('test-intermediate'))
    fireEvent.click(screen.getByText('Voltar'))
    expect(screen.getByTestId('test-level-menu')).toBeTruthy();
  });
});