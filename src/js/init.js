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
    urls: [],
  };

  console.log('INIT');
  const watchedState = setWatcher(container, state, i18nInstance);

  const form = container.querySelector('form');
  const input = form.querySelector('input');
  // const content = container.querySelector('#content');
  const button = form.querySelector('button');

  form.addEventListener('submit', submitHandler(watchedState));
  input.addEventListener('input', inputHandler(watchedState));
  input.focus();
  button.disabled = false;

  const testURL = 'https://ru.hexlet.io/lessons.rss';
};
