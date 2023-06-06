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
    console.log('WATCHER CALLED', counter, 'time(s) PATH :>>', path, 'PREV ->', previousValue, 'VALUE ->', value);

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
