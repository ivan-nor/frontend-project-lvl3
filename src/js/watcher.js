import onChange from 'on-change';
import {
  renderFeeds, renderPosts, renderMessage, renderForm, renderModal,
} from './renders';

export default (elements, state, t) => {
  function watch(path) {
    switch (path) {
      case 'process':
        renderForm(state, elements, t);
        break;
      case 'posts':
        renderPosts(this, elements, t);
        break;
      case 'feeds':
        renderFeeds(state, elements, t);
        break;
      case 'message':
        renderMessage(state, elements, t);
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
