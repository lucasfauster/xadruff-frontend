import React, { useState } from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import Menu from '../Menu';

afterEach(cleanup);

describe('Main Menu', ()=>{
  it('renders logo', () => {
    render(<Menu/>);

    expect(screen.getByRole('img',{name:'XadrUFF'})).toBeTruthy();
  });

  it('renders jogar button', () => {
    render(<Menu/>);

    expect(screen.getByRole('button',{name:'JOGAR'})).toBeTruthy();
  });

  it('does not render jogar button', () => {
    render(<Menu/>);
    fireEvent.click(screen.getByText('JOGAR'))
    expect(screen.queryByRole('button', {name: 'JOGAR'})).toBeFalsy();
  });

  it('default renders main menu', () => {
    React.useState = jest.fn().mockReturnValue([-1, {}])
    render(<Menu/>);
    expect(screen.getByRole('button', {name: 'JOGAR'})).toBeTruthy();
  });
});
