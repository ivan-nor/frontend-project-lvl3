import onChange from 'on-change';
import { renderFeeds } from './renders.js';

export default (elements, state, t) => {
  const {
    form,
    input,
    button,
    feedback,
  } = elements;
  let {
    feeds,
    posts,
    errorMessages,
    process,
    urls,
  } = state;

  console.log('SET WATCHER');
  let index = 0;
  // eslint-disable-next-line func-names
  return onChange(state, function (path, value, previousValue, applyData) {
    console.log('Object changed:', ++index);
    console.log('this:', this);
    console.log('path:', path);
    console.log('value:', value);
    console.log('previousValue:', previousValue);
    console.log('applyData:', applyData);

    switch (path) {
      case 'process':
        if (state.process === 'sending') {
          // button.classList.add('disabled');
          feedback.classList.remove('text-danger', 'text-success');
          // feedback.innerHTML = t('sending');
          feedback.classList.add('text-warning');
        }
        if (state.process === 'success') {
          button.classList.remove('disabled');
          feedback.classList.remove('text-danger', 'text-warning');
          feedback.innerHTML = t('messages.success');
          feedback.classList.add('text-success');
          form.reset();
          input.focus();
        }
        input.focus();
        break;
      case 'form.status':
        break;
      case 'inputValue':
        break;
      case 'posts':
        break;
      case 'feeds':
        renderFeeds(this, elements.feeds);
        break;
      case 'message':
        break;
      default:
        break;
    }
  });
};
