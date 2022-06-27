import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import Menu from './Menu';

afterEach(cleanup);


it('renders logo', () => {
  render(<Menu/>);

  expect(screen.getByRole('img',{name:'XadrUFF'})).toBeTruthy();
});

it('renders Jogar button', () => {
  render(<Menu/>);

  expect(screen.getByRole('button',{name:'JOGAR'})).toBeTruthy();
});

describe('opens color menu',()=>{

  it('does not render Jogar button',() =>{
    render(<Menu/>);
    fireEvent.click(screen.getByText('JOGAR'))

    expect(screen.queryByRole('button',{name:'JOGAR'})).toBeFalsy();
  })

  it('renders question and options',() =>{
    render(<Menu/>);
    fireEvent.click(screen.getByText('JOGAR'))

    expect(screen.getByText('COM QUAIS PEÇAS VOCÊ QUER JOGAR?')).toBeTruthy();
    expect(screen.getByText('PRETAS')).toBeTruthy();
    expect(screen.getByText('BRANCAS')).toBeTruthy();
    expect(screen.getByText('SORTEAR')).toBeTruthy();
  })

  it('chooses Black pieces',() =>{
    render(<Menu/>);
    fireEvent.click(screen.getByText('JOGAR'))
    fireEvent.click(screen.getByTestId('test-pretas'))
    expect(screen.getByTestId('test-board')).toBeTruthy();

  })

  it('chooses White pieces',() =>{
    render(<Menu/>);
    fireEvent.click(screen.getByText('JOGAR'))
    fireEvent.click(screen.getByTestId('test-brancas'))
    expect(screen.getByTestId('test-board')).toBeTruthy();
  })

  it('chooses random',() =>{
    render(<Menu/>);
    fireEvent.click(screen.getByText('JOGAR'))
    fireEvent.click(screen.getByTestId('test-sortear'))
    expect(screen.getByTestId('test-board')).toBeTruthy();
  })
})

