import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App.js'
const { data, badData } = require('./helpers/data');

//ALTERAR ESTA

// const userToken = "44fe45813c8ea2f92f519bac70ae113f4db26c09788deca0879678cf90a1335f";

// const tokenToStorage = (token) => localStorage.setItem('token', token);

describe('Testa a tela de login', () => {
  // global.fetch = jest.fn(() =>
  // Promise.resolve({
  //   json: () => Promise.resolve(data),
  //   }),
  // );
  // const removeItem = jest.spyOn(Storage.prototype, 'removeItem');

  it('Tem 2 inputs e 2 botões na tela', () => {
    renderWithRouterAndRedux(<App/>)

    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(2);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);  
  });
  it('Botão "Play" está desabilitado ao iniciar a página', () => {
    renderWithRouterAndRedux(<App/>)

    const playButton = screen.getByRole('button', {name: /play/i});
    expect(playButton).toHaveAttribute('disabled');
  });
  it('Jogador pode escrever nome e email e clicar em "Play"', () => {
    global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(data),
      }),
    );
    renderWithRouterAndRedux(<App/>)
    
    const nameInput = screen.getByRole('textbox', {name: /nome/i});
    expect(nameInput).toBeInTheDocument();

    const emailInput = screen.getByRole('textbox', {name: /email/i});
    expect(emailInput).toBeInTheDocument();

    userEvent.type(nameInput, 'daniel');
    expect(nameInput).toHaveValue('daniel');

    userEvent.type(emailInput, 'daniel@trybe.com');
    expect(emailInput).toHaveValue('daniel@trybe.com');

    const playButton = screen.getByRole('button', {name: /play/i});
    expect(playButton).toBeInTheDocument();
    
    userEvent.click(playButton);
  });

  it('Ao clicar em Play a função fetch é chamada', () => {
  global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(data),
    }),
  );
  renderWithRouterAndRedux(<App/>);

  const nameInput = screen.getByRole('textbox', {name: /nome/i});
  expect(nameInput).toBeInTheDocument();

  const emailInput = screen.getByRole('textbox', {name: /email/i});
  expect(emailInput).toBeInTheDocument();

  userEvent.type(nameInput, 'daniel');
  expect(nameInput).toHaveValue('daniel');


  userEvent.type(emailInput, 'daniel@trybe.com');
  expect(emailInput).toHaveValue('daniel@trybe.com');

  const playButton = screen.getByRole('button', {name: /play/i});
  expect(playButton).toBeInTheDocument();

  userEvent.click(playButton);

  expect(fetch).toHaveBeenCalled();

  });
  it('Testa se token é enviado ao localStorage', async () => {
    const setItem = jest.spyOn(Storage.prototype, 'setItem');

    renderWithRouterAndRedux(<App/>);

    const nameInput = screen.getByRole('textbox', {name: /nome/i});
    expect(nameInput).toBeInTheDocument();

    const emailInput = screen.getByRole('textbox', {name: /email/i});
    expect(emailInput).toBeInTheDocument();

    userEvent.type(nameInput, 'daniel');
    expect(nameInput).toHaveValue('daniel');


    userEvent.type(emailInput, 'daniel@trybe.com');
    expect(emailInput).toHaveValue('daniel@trybe.com');

    const playButton = screen.getByRole('button', {name: /play/i});
    expect(playButton).toBeInTheDocument();

    userEvent.click(playButton);
    await waitFor(() => {
      expect(setItem).toHaveBeenCalled();
    })
  });
})
