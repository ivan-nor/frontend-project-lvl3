// @ts-check
import i18n from 'i18next';
import Parser from 'rss-parser';
import parse from 'rss-to-json';
import 'regenerator-runtime/runtime';
import resources from '../locales/index.js';
import { inputHandler, submitHandler } from './controllers';
import setWatcher from './watcher';

export default async (container, initialState = {}) => {
  const { lng = 'ru' } = initialState;

  const i18nInstance = i18n.createInstance();
  await i18nInstance.init({
    lng,
    resources,
  });

  const state = {
    process: 'input',
    inputValue: '',
    isValid: true,
    errorMessages: {},
    channels: [],
    // urls: [],
  };

  console.log('INIT');
  const watchedState = setWatcher(container, state, i18nInstance);

  const form = container.querySelector('form');
  const input = form.querySelector('input');
  const button = form.querySelector('button');

  const a = container.querySelector('#google'); // затычка для быстрого ввода ссылок
  a.addEventListener('click', (event) => {
    event.preventDefault();
    // console.log((event.target))
    input.value = event.target.textContent;
  });

  form.addEventListener('submit', submitHandler(watchedState));
  input.addEventListener('input', inputHandler(watchedState));
  input.focus();
  button.disabled = false;
};
