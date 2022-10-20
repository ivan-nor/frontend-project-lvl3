// @ts-check
import i18n from 'i18next';
import 'regenerator-runtime/runtime';
import resources from '../locales/index.js';
import { inputHandler, submitHandler } from './controllers';
import setWatcher from './watcher';

export default (container, initialState = {}) => {
  const { lng = 'ru' } = initialState;

  i18n.createInstance({ lng, resources }, (err, t) => {
    if (err) return console.log('something went wrong loading', err);

    const state = {
      process: 'input',
      inputValue: '',
      isValid: true,
      errorMessages: {},
      feeds: [],
      posts: [],
    };

    console.log('INIT');
    const watchedState = setWatcher(container, state, t);

    const form = container.querySelector('form');
    const input = form.querySelector('input');
    // const button = form.querySelector('button');

    const a = container.querySelector('#google'); // затычка для быстрого ввода ссылок
    a.addEventListener('click', (event) => {
      event.preventDefault();
      state.inputValue = event.target.textContent;
      input.value = event.target.textContent;
    });

    form.addEventListener('submit', submitHandler(watchedState));
    input.addEventListener('input', inputHandler(watchedState));
    input.focus();
    // button.disabled = false;

    return null; // требования линтера
  });
};
