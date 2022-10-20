import onChange from 'on-change';
import { renderContent } from './renders';

export default (container, state, t) => {
  console.log('RUN SET WATCHER');
  const form = container.querySelector('form');
  const input = form.querySelector('input');
  const postsElement = document.querySelector('#posts');
  const feedsElement = document.querySelector('#feeds');

  const button = form.querySelector('button');
  button.innerHTML = t('submit');

  const invalidFeedback = document.querySelector('.invalid-feedback');
  invalidFeedback.innerHTML = t('invalidFeedback');

  const label = form.querySelector('label');
  label.innerHTML = t('label');

  input.focus();

  // eslint-disable-next-line func-names
  return onChange(state, function (...args) {
    const [path] = args;
    console.log('WATCHER change ', path.toUpperCase(), ':>>', state[path]);
    input.classList.add('is-invalid');
    switch (path) {
      case 'process':
        if (state.process === 'sending') {
          button.classList.add('disabled');
        } else {
          button.classList.remove('disabled');
        }
        form.reset();
        break;
      case 'feeds':
        break;
      case 'errorMessages':
        break;
      case 'inputValue':
        break;
      case 'isValid':
        if (this.isValid) {
          button.classList.remove('disabled');
          input.classList.add('is-valid');
          input.classList.remove('is-invalid');
        } else {
          button.classList.add('disabled');
          input.classList.add('is-invalid');
          input.classList.remove('is-valid');
        }
        if (this.inputValue === '') {
          button.classList.add('disabled');
          input.classList.remove('is-invalid');
          input.classList.remove('is-valid');
        }
        input.focus();
        break;
      case 'posts':
        renderContent(feedsElement, postsElement, state.feeds, state.posts);

        input.classList.remove('is-invalid');
        input.classList.remove('is-valid');
        form.reset();
        break;
      default:
        throw new Error(`Unknown watchedState path: ${path}`);
    }
  });
};
