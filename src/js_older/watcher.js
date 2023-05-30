// import axios from 'axios';
import onChange from 'on-change';
import { renderErrors, renderFeeds, renderModal, renderPosts } from './renders';
import { responseFeedsResourses } from './controllers';

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

  input.focus();
  // console.log('SET WATCHER');
  // eslint-disable-next-line func-names, prefer-arrow-callback
  return onChange(state, function (...args) {
    const [path] = args;
    console.log('WATCHER change ', path.toUpperCase(), ':>>', state[path]);
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
          feedback.innerHTML = t('success');
          feedback.classList.add('text-success');
          form.reset();
        }
        // form.reset();
        break;
      case 'errorMessages':
        renderErrors(elements, state, t);
        break;
      case 'posts':
        renderPosts(elements, state, t, this);
        break;
      case 'feeds':
        renderFeeds(elements, state, t);
        break;
      case 'urls':
        // console.log('WATC URLS before');
        clearTimeout(this.timerId);
        setTimeout(responseFeedsResourses(this, state, urls), 0);
        // console.log('WATC URLS after');
        break;
      case 'modal':
        renderModal(elements, state);
        break;
      case 'modal.visited':
        renderPosts(elements, state, t, this);
        break;
      case (/posts\.\d\.visited/).test(path):
        renderPosts(elements, state, t, this);
      case 'inputValue':
      case 'timerId':
      case 'proxy':
        break;
      default:
        if (/posts\.\d\.visited/) {
          renderPosts(elements, state, t, this);
        } else {
          throw new Error(`Unknown watchedState path: ${path}`);
        }
    }
  });
};