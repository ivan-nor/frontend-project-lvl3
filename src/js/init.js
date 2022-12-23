// @ts-check
import i18n from 'i18next';
import 'regenerator-runtime/runtime';
import resources from './locales/index.js';
import { inputHandler, submitHandler } from './controllers';
import setWatcher from './watcher';

export default (container, initialState = {}) => {
  const { lng = 'ru', proxy } = initialState;

  i18n.createInstance({ lng, resources }, (err, t) => {
    if (err) return console.log('something went wrong loading', err);
    console.log('INIT');

    const state = {
      process: 'input', // input, sending, success
      inputValue: '',
      errorMessages: {},
      feeds: [],
      posts: [],
      urls: [],
      proxy,
      timerId: null,
      // TODO UI State сделать соответственно элементам, чтобы применять диспетчеризацию (??)
      modal: null,
    };

    const elements = {
      form: container.querySelector('.rss-form'),
      input: container.querySelector('#rssInput'),
      button: container.querySelector('button[type="submit"]'),
      label: container.querySelector('label'),
      feedback: container.querySelector('.feedback'),
      example: container.querySelector('p.text-muted'),
      feeds: container.querySelector('#feeds'),
      posts: container.querySelector('#posts'),
      title: container.querySelector('#title'),
      lead: container.querySelector('#lead'),
      modal: {
        title: container.querySelector('.modal-title'),
        body: container.querySelector('.modal-body'),
        link: container.querySelector('.modal-footer > a'),
        button: container.querySelector('.modal-footer > button'),
      },
    };

    const tempLinks = container.querySelectorAll('.tempLink'); // затычка для быстрого ввода ссылок
    tempLinks.forEach((link) => link.addEventListener('click', (event) => {
      event.preventDefault();
      state.inputValue = event.target.textContent;
      elements.input.value = event.target.textContent;
    }));
    const watchedState = setWatcher(elements, state, t);

    elements.title.innerHTML = t('title');
    elements.lead.innerHTML = t('lead');
    elements.button.innerHTML = t('submit');
    elements.label.innerHTML = t('label');
    elements.example.innerHTML = t('example');
    elements.form.addEventListener('submit', submitHandler(watchedState, state, proxy));
    elements.input.addEventListener('input', inputHandler(watchedState));
    elements.input.focus();
    elements.modal.link.innerHTML = t('modal.link');
    elements.modal.button.innerHTML = t('modal.button');

    return null; // требования линтера
  });
};
