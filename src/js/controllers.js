/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import { uniqBy, uniqueId } from 'lodash';
import onChange from 'on-change';
import validate from './validator.js';
import parse from './parser.js';

const requestFeedsResourses = (watchedState) => {
  const {
    proxy,
    timerId,
    urls,
  } = watchedState;

  const state = onChange.target(watchedState);

  const proxiedUrls = urls.map((url) => `${proxy}${url}`);
  const requests = proxiedUrls.map((url) => axios.get(url));

  Promise.all(requests)
    .then((responses) => {
      responses.forEach((response) => {
        console.log('RESPONSE ', response);

        const responseData = (proxy) ? response.data.contents : response.data;
        const parsed = parse(responseData);

        const newFeed = { channelTitle: parsed.channelTitle, channelDescription: parsed.channelDescription };
        const uniqueFeeds = uniqBy([...state.feeds, newFeed], 'channelTitle');
        watchedState.feeds = [...uniqueFeeds];

        const uniquePosts = uniqBy([...state.posts, ...parsed.channelPosts], 'title');
        const updatedPosts = uniquePosts.map((post) => ((post.id) ? post : { ...post, id: uniqueId(), visited: null }));
        watchedState.posts = [...updatedPosts];
        watchedState.process = 'input';
      });
    })
    .catch(console.log);

  clearTimeout(timerId);
  watchedState.timerId = setTimeout(requestFeedsResourses, 5000, watchedState); // рекурсивный таймер
};

const submitHandler = (watchedState) => (event) => {
  event.preventDefault();

  const validateMessage = validate(watchedState.inputValue, watchedState.urls);
  const keyMessage = Object.keys(validateMessage)[0] || '';
  watchedState.message = keyMessage;
  watchedState.process = (keyMessage) ? 'error' : 'input';

  if (!watchedState.message) {
    const requestURL = `${watchedState.proxy}${watchedState.inputValue}`;

    axios.get(requestURL)
      .then((response) => {
        const contentType = response.data.status.content_type;
        if ((contentType.includes('rss') || contentType.includes('xml')) && !watchedState.urls.includes(watchedState.inputValue)) {
          watchedState.urls.push(watchedState.inputValue);
          watchedState.message = 'success';
          watchedState.process = 'success';
          requestFeedsResourses(watchedState);
        } else {
          watchedState.process = 'error';
          watchedState.message = 'formatError';
        }
      })
      .catch((e) => {
        watchedState.process = 'error';
        watchedState.message = 'networkError';
      });
  }
};

const inputHandler = (watchedState) => (event) => {
  event.preventDefault();
  watchedState.inputValue = event.target.value;
};

const clickPostHandler = (postItem, postElement, watchedState, t) => (event) => {
  if (event.target.tagName === 'BUTTON') {
    watchedState.modal = postItem;
  }

  postItem.visited = true;
};

export {
  inputHandler, submitHandler, requestFeedsResourses, clickPostHandler,
};
