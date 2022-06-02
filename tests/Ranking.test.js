import React from 'react';
import { screen } from '@testing-library/react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App';
import userEvent from '@testing-library/user-event';

describe('Testa a página de Raking da aplicação', () => {
  const INITIAL_STATE = {
    name: '',
    assertions: 0,
    score: 0,
    gravatarEmail: '',
  };
  const PLAYER2_STATE = {
    name: 'Player 2',
    assertions: 1,
    score: 55,
    gravatarEmail: 'player2@gmail.com'
  }
  it('Testa se a página de ranking é renderizada', () => {
    renderWithRouterAndRedux(<App />, {player: INITIAL_STATE}, '/ranking');
    const title = screen.getByRole('heading', {name: /ranking/i, level: 2});
    expect(title).toBeInTheDocument();
  });

  it('Testa se existe um botão que leva para a página de login', () => {
    const { history } = renderWithRouterAndRedux(<App />, {player: INITIAL_STATE}, '/ranking');
    const button = screen.getByRole('button', {name: /login/i});
    expect(button).toBeInTheDocument();
    userEvent.click(button);
    const { pathname } = history.location;
    expect(pathname).toBe('/')
  });

  it('Testa se as informações do jogador são renderizadas na tela', () => {
    renderWithRouterAndRedux(<App />, {player: PLAYER2_STATE}, '/feedback');
    const button = screen.getByRole('button', { name: /ranking/i});
    userEvent.click(button);
    const img = screen.getByRole('img', {alt: /avatar do jogador/i, src: 'https://www.gravatar.com/avatar/5b28313f2c2500812586be3f5e8a8031'});
    const name = screen.getByText('Player 2');
    const score = screen.getByText('55');
    expect(img).toBeInTheDocument();
    expect(name).toBeInTheDocument();
    expect(score).toBeInTheDocument();
  });

  it('Testa se a aplicação salva as informações do jogador no localStorage', () => {
    const setItem = jest.spyOn(Storage.prototype, 'setItem');
    const getItem = jest.spyOn(Storage.prototype, 'getItem');
    renderWithRouterAndRedux(<App />, {player: INITIAL_STATE}, '/feedback');
    const button = screen.getByRole('button', { name: /ranking/i});
    userEvent.click(button);
    expect(getItem).toHaveBeenCalled();
    expect(setItem).toHaveBeenCalled();
  });
})
