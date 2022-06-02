import React from 'react';
import { screen } from '@testing-library/react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App';
import userEvent from '@testing-library/user-event';

describe('Testa a tela de settings', () => {
  const INITIAL_STATE = {
    name: 'Player 1',
    assertions: 0,
    score: 0,
    gravatarEmail: 'player1@gmail.com',
  };
  it('Testa se a tela de settings é renderizada corretamente', () => {
    renderWithRouterAndRedux(<App/>, {player: INITIAL_STATE}, '/settings');
    const title = screen.getByText(/settings/i);
    expect(title).toBeInTheDocument();
  });
  it('Testa se existe um botão na página de login que leva a página de settings', () => {
    const { history } = renderWithRouterAndRedux(<App/>, {player: INITIAL_STATE}, '/');
    const settingsButton = screen.getByRole('button', { name: /settings/i});
    userEvent.click(settingsButton);
    const { pathname } = history.location;
    expect(pathname).toBe('/settings');
  });
});
