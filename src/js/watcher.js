import onChange from 'on-change';
// import { isEmpty } from 'lodash';
import {
  renderFeeds, renderPosts, renderMessage, renderForm,
} from './renders';

export default (elements, state, t) => {
  const {
    feeds,
    posts,
  } = elements;

  console.log('SET WATCHER');
  let counter = 0;

  function watch(path, value, previousValue) {
    counter += 1;
    if (path !== 'inputValue') {
      console.log('WATCHER CALLED', counter, 'PATH =', path, '\n   PREV  ->', previousValue, '\n   VALUE ->', value);
    }

    switch (path) {
      case 'process':
        renderForm(state, elements, t);
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
      case 'urls':
        break;
      default:
        break;
    }
  }

  return onChange(state, watch, { ignoreKeys: ['timerId'] });
};
