import React from 'react';
import {cleanup, render, screen} from '@testing-library/react';
import App from './App';

afterEach(cleanup);

describe('App', ()=> {
  it('renders application and menu', () => {
    render(<App/>);

    expect(screen.getByTestId('test-app')).toBeTruthy();
    expect(screen.getByRole('img', {name: 'XadrUFF'})).toBeTruthy();
  });
});