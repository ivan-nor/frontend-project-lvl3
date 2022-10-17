import onChange from 'on-change';
import render from './renders';

export default (container, state, i18nInstance) => {
  console.log('RUN SET WATCHER');
  const form = container.querySelector('form');
  const input = form.querySelector('input');
  const postsElement = document.querySelector('#posts');
  const feedsElement = document.querySelector('#feeds');

  const button = form.querySelector('button');
  button.innerHTML = i18nInstance.t('submit');

  const invalidFeedback = form.querySelector('.invalid-feedback');
  invalidFeedback.innerHTML = i18nInstance.t('invalidFeedback');

  const label = form.querySelector('label');
  label.innerHTML = i18nInstance.t('label');

  // eslint-disable-next-line func-names
  return onChange(state, function (...args) {
    const [path, value] = args;
    button.disabled = false;
    input.classList.add('is-invalid');
    switch (path) {
      case 'process':
        button.disabled = (this.process === 'sending');
        form.reset();
        break;
      case 'errorMessages':
      case 'inputValue':
      case 'isValid':
        if (this.isValid) {
          input.classList.add('is-valid');
          input.classList.remove('is-invalid');
        } else {
          button.disabled = true;
          input.classList.add('is-invalid');
          input.classList.remove('is-valid');
        }
        if (this.inputValue === '') {
          button.disabled = true;
          input.classList.remove('is-invalid');
          input.classList.remove('is-valid');
        }
        // input.focus();
        break;
      case 'channels':
        render(feedsElement, postsElement, this.channels);

        input.classList.remove('is-invalid');
        input.classList.remove('is-valid');
        form.reset();
        break;
      default:
        throw new Error(`Unknown watchedState path: ${path}`);
    }
  });
};
