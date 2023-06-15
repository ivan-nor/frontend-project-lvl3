import onChange from 'on-change';
import {
  renderFeeds, renderPosts, renderErrorMessage, renderForm, renderModal,
} from './renders';

export default (elements, state, t) => {
  function watch(path) { // value, previousValue
    // console.log('WATCHER PATH :>>', path, 'PREVVALUE :>>', previousValue, 'VALUE :>>', value);
    switch (path) {
      case 'processFeedAdding':
        renderForm(this, elements, t);
        break;
      case 'posts':
        renderPosts(this, elements, t);
        break;
      case 'feeds':
        renderFeeds(this, elements, t);
        break;
      case 'errorMessage':
        renderErrorMessage(this, elements, t);
        break;
      case 'modal':
        renderModal(this, elements);
        break;
      default:
        renderPosts(this, elements, t);
        break;
    }
  }

  return onChange(state, watch, { ignoreKeys: ['timerId', 'urls', 'inputValue'] });
};
