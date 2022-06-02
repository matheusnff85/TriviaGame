import React from 'react';
import { screen } from '@testing-library/react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App';
import userEvent from '@testing-library/user-event';

describe('Testa a tela de Feedback da aplicação', () => {
  const BADGAME_STATE = {
    name: 'Player 1',
    assertions: 1,
    score: 34,
    gravatarEmail: 'player1@gmail.com',
  };
  const GOODGAME_STATE = {
    name: 'Player 2',
    assertions: 4,
    score: 238,
    gravatarEmail: 'player2@gmail.com',
  };
  it('Testa se a página é renderizada corretamente', () => {
    const { history } = renderWithRouterAndRedux(<App/>, {player: BADGAME_STATE}, '/feedback');
    const scoreboard = screen.getByText(/placar final/i);
    const { pathname } = history.location;
    expect(scoreboard).toBeInTheDocument();
    expect(pathname).toBe('/feedback')
  });
  it('Testa se exibe a mensagem correta quando o player acerta mais de 3 perguntas', () => {
    renderWithRouterAndRedux(<App/>, {player: GOODGAME_STATE}, '/feedback');
    const goodGameMessage = screen.getByText(/well done!/i);
    const assertions = screen.getByText('4');
    const points = screen.queryAllByText('238');
    expect(goodGameMessage).toBeInTheDocument();
    expect(assertions).toBeInTheDocument();
    expect(points).toHaveLength(2);
  });
  it('Testa se exibe a mensagem correta quando o player acerta menos de 3 perguntas', () => {
    renderWithRouterAndRedux(<App/>, {player: BADGAME_STATE}, '/feedback');
    const badGameMessage = screen.getByText(/could be better.../i);
    const assertions = screen.getByText('1');
    const points = screen.queryAllByText('34');
    expect(badGameMessage).toBeInTheDocument();
    expect(assertions).toBeInTheDocument();
    expect(points).toHaveLength(2);
  });
  it('Testa se a página possui um botão para jogar novamente e seu funcionamento', () => {
    const { history } = renderWithRouterAndRedux(<App/>, {player: GOODGAME_STATE}, '/feedback');
    const playAgainButton = screen.getByRole('button', { name: /play again/i});
    expect(playAgainButton).toBeInTheDocument();
    userEvent.click(playAgainButton);
    const { pathname } = history.location;
    expect(pathname).toBe('/');
  });
  it('Testa se a página possui um botão para a tela de ranking', () => {
    const { history } = renderWithRouterAndRedux(<App/>, {player: GOODGAME_STATE}, '/feedback');
    const rankingButton = screen.getByRole('button', { name: /ranking/i});
    expect(rankingButton).toBeInTheDocument();
    userEvent.click(rankingButton);
    const { pathname } = history.location;
    expect(pathname).toBe('/ranking');
  });
});
