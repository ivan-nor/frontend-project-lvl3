/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import axios from 'axios';
import { uniqBy } from 'lodash';
// import onChange from 'on-change';
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
  const proxiedUrls = watchedState.feeds.map(({ url }) => getUrl(url, watchedState.proxy));
  const requests = proxiedUrls.map((url) => axios.get(url));

  Promise.all(requests)
    .then((responses) => {
      responses.forEach((response) => {
        const parsed = parse(response.data.contents);
        // console.log('RESPoNse in RFR', response.data.contents);
        // console.log('parsed :>> ', parsed);

        const newFeed = {
          channelTitle: parsed.channelTitle,
          channelDescription: parsed.channelDescription,
        };
        const uniqueFeeds = uniqBy([...watchedState.feeds, newFeed], 'channelTitle');
        watchedState.feeds = [...uniqueFeeds];

        const uniquePosts = uniqBy([...watchedState.posts, ...parsed.channelPosts], 'title');
        watchedState.posts = [...uniquePosts];
      });
    })
    .catch((e) => console.log('ERROR req in RFR', requests, e.message))
    .then(() => setTimeout(requestFeedsResourses, 5000, watchedState)); // рекурсивный таймер
};

const submitHandler = (watchedState) => (event) => { // изменить обработку ошибки в парсере, один раз загружать источники, все хранить в feeds
  event.preventDefault();
  const urls = watchedState.feeds.map((feed) => feed.url);
  // console.log('SUBMIT HANDLER', urls);
  const validateMessage = validate(watchedState.form.inputValue, urls);
  const keyMessage = Object.keys(validateMessage)[0] || '';
  // console.log('validateMessage :>> ', keyMessage);
  watchedState.errorMessage = keyMessage;
  watchedState.processFeedAdding = (keyMessage) ? 'error' : 'input';

  if (!watchedState.errorMessage) {
    const requestURL = getUrl(watchedState.form.inputValue, watchedState.proxy);
    // console.log('REQUEST URL', requestURL.href);

    axios.get(requestURL)
      .then((response) => {
        // console.log('SUBMIT HANDLER'); // response.data.contents
        const parsed = parse(response.data.contents); // добавиьт в парсер выброс ошибок
        // console.log('PARSED in SUNBNIT', parsed);
        const feed = { ...parsed, url: watchedState.form.inputValue };
        watchedState.feeds.push(feed);
        watchedState.posts.push(...parsed.channelPosts);
        watchedState.processFeedAdding = 'success';

        // requestFeedsResourses(watchedState); // только без обновления, для разработки
      })
      .catch((error) => { // в зависимости от ошибки
        const newErrorMessage = (error.message === 'Network Error') ? 'networkError' : error.message;
        // console.log('req ERROR', requestURL, '\n', error.message, newErrorMessage);
        watchedState.processFeedAdding = 'error';
        watchedState.errorMessage = newErrorMessage;
      });
  }
};

const inputHandler = (watchedState) => (event) => {
  // console.log('INPUT HANDLER', event.target.value);
  event.preventDefault();
  watchedState.form.inputValue = event.target.value;
};

const clickPostHandler = (postItem, postElement, watchedState) => (event) => {
  // console.log('CLICK POST HANDLER', postItem, event.target.tagName);
  if (event.target.tagName === 'BUTTON') {
    watchedState.modal = postItem;
  }

  watchedState.uiState.visited.push(postItem.id);
};

export {
  inputHandler, submitHandler, requestFeedsResourses, clickPostHandler,
};
