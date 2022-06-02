import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App';
import userEvent from '@testing-library/user-event';
const { data, badData } = require('./helpers/data');

describe('Testes da tela de jogo', () => {
  const playerEmail = 'player1@gmail.com';
  const playerName = 'Player1';
  const INITIAL_STATE = {
    name: playerName,
    assertions: 0,
    score: 0,
    gravatarEmail: playerEmail,
  };

  it('Testa se o fetch é chamado ao entra na tela de Game', async () => {
    global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(data),
      }),
    );
    renderWithRouterAndRedux(<App/>, {player: INITIAL_STATE}, '/game');
    expect(fetch).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.getAllByRole('button')).toHaveLength(2));
  });

  it('Testa se a pergunta é renderizada corretamente', async () => {
    global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(data),
      }),
    );
    const { history } = renderWithRouterAndRedux(<App/>, {player: INITIAL_STATE}, '/game');
    await waitFor(() => {
      const category = screen.getByRole('heading', { name: /geography/i });
      const trueAnswer = screen.getByRole('button', { name: /true/i});
      const falseAnswer = screen.getByRole('button', { name: /false/i});
      const question = screen.getByText(/The Republic of Malta is the smallest microstate worldwide./i);
      const { pathname } = history.location;
      expect(category).toBeInTheDocument();
      expect(question).toBeInTheDocument();
      expect(trueAnswer).toBeInTheDocument();
      expect(falseAnswer).toBeInTheDocument();
      expect(pathname).toBe('/game')
    });
  });

  it('Testa se o header é renderizado corretamente na tela de Game', async () => {
    global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(data),
      }),
    );
    renderWithRouterAndRedux(<App/>, {player: INITIAL_STATE}, '/game');
    await waitFor(() => {
      const headerName = screen.getByRole('heading', { name: /player1/i});
      const headerImg = screen.getByRole('img', { src: 'https://www.gravatar.com/avatar/fba3b221b06a32f89be295037d1285fe'});
      const headerPoints = screen.getByRole('heading', { name: /0/i, level: 2});
      expect(headerName).toBeInTheDocument();
      expect(headerImg).toBeInTheDocument();
      expect(headerPoints).toBeInTheDocument();
    });
  });

  it('Testa se ao acertar perguntas a pontuação é atualizada', async () => {
    global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(data),
      }),
    );
    renderWithRouterAndRedux(<App/>, {player: INITIAL_STATE}, '/game');
    await waitFor(() => {
      const correctAnswer = screen.getByRole('button', { name: /false/i});
      userEvent.click(correctAnswer);
      const points = screen.getByRole('heading', { level: 2, name: /40/i});
      expect(points).toBeInTheDocument();
    });
  });

  it('Testa se ao errar a pergunta a pontuação continua em 0', async () => {
    global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(data),
      }),
    );
    renderWithRouterAndRedux(<App/>, {player: INITIAL_STATE}, '/game');
    await waitFor(() => {
      const incorrectAnswer = screen.getByRole('button', { name: /true/i});
      userEvent.click(incorrectAnswer);
      const points = screen.getByRole('heading', { level: 2, name: /0/i});
      expect(points).toBeInTheDocument();
    });
  });

  it('Testa se ao zerar o timer a pergunta é dada como incorreta', async () => {
    global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(data),
      }),
    );
    renderWithRouterAndRedux(<App/>, {player: INITIAL_STATE}, '/game');
    await new Promise((timer) => setTimeout(timer, 33000));
    const points = screen.getByRole('heading', { level: 2, name: /0/i});
    expect(points).toBeInTheDocument();
  }, 40000);

  it('Testa o funcionamento do botão Next', async () => {
    global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(data),
      }),
    );
    renderWithRouterAndRedux(<App/>, {player: INITIAL_STATE}, '/game');
    await waitFor(() => {
      const correctAnswer = screen.getByRole('button', { name: /false/i});
      userEvent.click(correctAnswer);
      const nextButton = screen.getByRole('button', { name: /next/i});
      userEvent.click(nextButton);
      const newQuestion = screen.getByText(/In quantum physics, which of these theorised sub-atomic particles has yet to be observed?/i);
      expect(newQuestion).toBeInTheDocument();
    });
  });

  it('Testa se ao terminar de responder as perguntar o jogador é direcionado a página de feedback', async () => {
    global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(data),
      }),
    );
    const { history } = renderWithRouterAndRedux(<App/>, {player: INITIAL_STATE}, '/game');
    await waitFor(() => {
      userEvent.click(screen.getByTestId('correct-answer'));
      expect(screen.getByRole('heading', { name: '40'})).toBeInTheDocument();
      userEvent.click(screen.getByRole('button', { name: /next/i}));
      userEvent.click(screen.getByTestId('correct-answer'));
      expect(screen.getByRole('heading', { name: '140'})).toBeInTheDocument();
      userEvent.click(screen.getByRole('button', { name: /next/i}));
      userEvent.click(screen.getByTestId('correct-answer'));
      expect(screen.getByRole('heading', { name: '210'})).toBeInTheDocument();
      userEvent.click(screen.getByRole('button', { name: /next/i}));
      userEvent.click(screen.getAllByRole('button')[0]);
      userEvent.click(screen.getByRole('button', { name: /next/i}));
      userEvent.click(screen.getAllByRole('button')[0]);
      userEvent.click(screen.getByRole('button', { name: /next/i}));
      const { pathname } = history.location;
      expect(pathname).toBe('/feedback');
    });
  });

  it('Testa se o elemento muda a cor da borda ao responder uma pergunta', async () => {
    global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(data),
      }),
    );
    renderWithRouterAndRedux(<App/>, {player: INITIAL_STATE}, '/game');
    await waitFor(() => {
      const correctNormalBorder = getComputedStyle(screen.getByTestId('correct-answer'));
      expect(correctNormalBorder.border).toBe('2px outset buttonface');

      const incorrectNormalBorder = getComputedStyle(screen.getAllByTestId(/wrong-answer/i)[0]);
      expect(incorrectNormalBorder.border).toBe('2px outset buttonface');
    });
    await waitFor(() => {
      userEvent.click(screen.getByTestId('correct-answer'));
      const incorrectAnswerBorder = getComputedStyle(screen.getByRole('button', { name: 'True'}));
      expect(incorrectAnswerBorder.border).toBe('3px solid red');
      const correctAnswerBorder = getComputedStyle(screen.getByRole('button', { name: 'False'}));
      expect(correctAnswerBorder.border).toBe('3px solid rgb(6, 240, 15)');
    })
  });
  it('Testa se ao entrar com um token inválido o jogador é redirecionado para a página de login', async () => {
    global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(badData),
      }),
    );
    const removeItem = jest.spyOn(Storage.prototype, 'removeItem');
    localStorage.setItem('token', '456556sa5das65')
    const { history } = renderWithRouterAndRedux(<App/>, {player: INITIAL_STATE}, '/game');
    await waitFor(() => {
      expect(removeItem).toHaveBeenCalledTimes(1);
      const { pathname } = history.location;
      expect(pathname).toBe('/');
    })
  });
});
