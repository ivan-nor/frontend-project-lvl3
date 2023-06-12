/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import axios from 'axios';
import { uniqBy, uniqueId } from 'lodash';
import onChange from 'on-change';
import validate from './validator.js';
import parse from './parser.js';

const getUrl = (url, proxy) => {
  const newUrl = new URL(proxy);
  const searchUrl = encodeURI(url);
  newUrl.searchParams.set('disableCache', 'true');
  newUrl.searchParams.set('url', searchUrl);
  newUrl.pathname = '/get';
  // console.log('GET URL', url, proxy, newUrl.href);
  return newUrl;
};

const requestFeedsResourses = (watchedState) => {
  // console.log('CALL RFR');
  const {
    proxy,
    // timerId,
    urls,
    // feeds,
    // posts,
  } = watchedState;

  const state = onChange.target(watchedState);

  const proxiedUrls = urls.map((url) => getUrl(url, proxy));
  const requests = proxiedUrls.map((url) => axios.get(url));

  Promise.all(requests)
    .then((responses) => {
      responses.forEach((response) => {
        // console.log('RESPoNse in RFR', response.data);
        const responseData = (proxy) ? response.data.contents : response.data;
        const parsed = parse(responseData);

        // console.log('response.data :>> ', response.data);
        // console.log('parsed :>> ', parsed);

        const newFeed = {
          channelTitle: parsed.channelTitle,
          channelDescription: parsed.channelDescription,
        };
        const uniqueFeeds = uniqBy([...state.feeds, newFeed], 'channelTitle');
        watchedState.feeds = [...uniqueFeeds];

        const uniquePosts = uniqBy([...state.posts, ...parsed.channelPosts], 'title');
        const updatedPosts = uniquePosts.map((post) => ((post.id) ? post : { ...post, id: uniqueId(), visited: null }));
        watchedState.posts = [...updatedPosts];
      });
    })
    .catch((e) => console.log('ERROR req ', requests, e));

  // clearTimeout(timerId);
  // watchedState.timerId = setTimeout(requestFeedsResourses, 5000, watchedState); // рекурсивный таймер
  setTimeout(requestFeedsResourses, 5000, watchedState); // рекурсивный таймер
};

const submitHandler = (watchedState) => (event) => {
  event.preventDefault();
  const validateMessage = validate(watchedState.inputValue, watchedState.urls);
  const keyMessage = Object.keys(validateMessage)[0] || '';
  watchedState.message = keyMessage;
  watchedState.process = (keyMessage) ? 'error' : 'input';

  if (!watchedState.message) {
    const requestURL = getUrl(watchedState.inputValue, watchedState.proxy);

    axios.get(requestURL)
      .then((response) => {
        // console.log('SUBMIT HANDLER', response.data.contents);
        // console.log('RESPONSE in SUBMIT', (response.data.contents));
        // const parsed = parse(response.data)
        // console.log('PARSED in SUNBNIT', parsed);
        // const contentType = response.data.status.content_type;
        if ((response.data.contents.includes('rss'))) {
          watchedState.urls.push(watchedState.inputValue);
          watchedState.message = 'success';
          watchedState.process = 'success';
          // requestFeedsResourses(watchedState);
        } else {
          watchedState.process = 'error';
          watchedState.message = 'formatError';
        }
      })
      .catch((e) => {
        console.log('req ERROR', requestURL, e);
        watchedState.process = 'error';
        watchedState.message = 'networkError';
      });
  }
};

const inputHandler = (watchedState) => (event) => {
  // console.log('INPUT HANDLER');
  event.preventDefault();
  watchedState.inputValue = event.target.value;
};

const clickPostHandler = (postItem, postElement, watchedState) => (event) => {
  // console.log('CLICK POST HANDLER');
  if (event.target.tagName === 'BUTTON') {
    watchedState.modal = postItem;
  }

  postItem.visited = true;
};

export {
  inputHandler, submitHandler, requestFeedsResourses, clickPostHandler,
};
