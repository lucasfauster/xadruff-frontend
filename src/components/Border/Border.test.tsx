import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import Border from './Border';

afterEach(cleanup);

describe('Border', ()=>{
  it('renders vertical border', () => {
    render(<Border text={'1'} axis={'V'}/>);
    const border = screen.getByTestId('test-vertical');

    expect(border).toBeTruthy();
    expect(border).toHaveTextContent('1');
    expect(border).toHaveClass('border border-vertical');
  });

  it('renders horizontal border', () => {
    render(<Border text={'A'} axis={'H'}/>);
    const border = screen.getByTestId('test-horizontal');

    expect(border).toBeTruthy();
    expect(border).toHaveTextContent('A');
    expect(border).toHaveClass('border border-horizontal');
  });

  it('renders corner', () => {
    render(<Border text={''} axis={'C'}/>);
    const border = screen.getByTestId('test-corner');

    expect(border).toBeTruthy();
    expect(border).toHaveTextContent('');
    expect(border).toHaveClass('border border-corner');
  });

  it('default does not render', () =>{
    render(<Border text={'0'} axis={'K'}/>);

    expect(screen.queryByTestId('test-vertical')).toBeFalsy()
    expect(screen.queryByTestId('test-horizontal')).toBeFalsy()
    expect(screen.queryByTestId('test-corner')).toBeFalsy()
  });
});