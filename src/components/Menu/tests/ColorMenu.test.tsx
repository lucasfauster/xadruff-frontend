import {cleanup, fireEvent, render, screen} from "@testing-library/react";
import Menu from "../Menu";
import React from "react";

afterEach(cleanup);

describe('Color Menu', ()=>{
  it('renders question and options',() =>{
    render(<Menu/>);
    fireEvent.click(screen.getByText('JOGAR'))

    expect(screen.getByText('COM QUAIS PEÇAS VOCÊ QUER JOGAR?')).toBeTruthy();
    expect(screen.getByText('PRETAS')).toBeTruthy();
    expect(screen.getByText('BRANCAS')).toBeTruthy();
    expect(screen.getByText('SORTEAR')).toBeTruthy();
  })

  it('chooses black pieces',() => {
    render(<Menu/>);
    fireEvent.click(screen.getByText('JOGAR'))
    fireEvent.click(screen.getByTestId('test-pretas'))
    fireEvent.click(screen.getByTestId('test-intermediate'))
    expect(screen.getByTestId('test-option-menu')).toBeTruthy();


  });

  it('chooses white pieces',() => {
    render(<Menu/>);
    fireEvent.click(screen.getByText('JOGAR'))
    fireEvent.click(screen.getByTestId('test-brancas'))
    fireEvent.click(screen.getByTestId('test-intermediate'))
    expect(screen.getByTestId('test-option-menu')).toBeTruthy();
  });

  it('chooses random',() => {
    render(<Menu/>);
    fireEvent.click(screen.getByText('JOGAR'))
    fireEvent.click(screen.getByTestId('test-sortear'))
    fireEvent.click(screen.getByTestId('test-intermediate'))
    expect(screen.getByTestId('test-option-menu')).toBeTruthy();
  });

  it('returns to main menu',() => {
    render(<Menu/>);
    fireEvent.click(screen.getByText('JOGAR'))
    fireEvent.click(screen.getByText('Voltar'))
    expect(screen.getByRole('button',{name:'JOGAR'})).toBeTruthy();
  });

  it('returns to color menu',() => {
    render(<Menu/>);
    fireEvent.click(screen.getByText('JOGAR'))
    fireEvent.click(screen.getByTestId('test-sortear'))
    fireEvent.click(screen.getByText('Voltar'))
    expect(screen.getByTestId('test-color-menu')).toBeTruthy();
  });
});