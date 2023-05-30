import onChange from 'on-change';
import { renderFeeds, renderPosts, renderMessage } from './renders';

export default (elements, state, t) => {
  const {
    form,
    input,
    button,
    feedback,
    feeds,
    posts,
  } = elements;

  console.log('SET WATCHER');
  let counter = 0;

  function watch(path, value, previousValue) {
    counter += 1;
    console.log('WATCHER CALLED', counter, 'time(s) PATH :>>', path, 'PREV ->', previousValue, 'VALUE ->', value);

    switch (path) {
      case 'process':
        if (state.process === 'sending') {
          break;
        }
        if (state.process === 'success') {
          form.reset();
          input.focus();
        } else {
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
        renderPosts(state, posts, t);
        break;
      case 'feeds':
        renderFeeds(state, feeds, t);
        break;
      case 'message':
        renderMessage(state, elements, t);
        break;
      case 'timerId':
        break;
      case 'channels':
        break;
      case 'urls':

        break;
      default:
        break;
    }
  }
  return onChange(state, watch, { ignoreKeys: ['timerId'] });
};
