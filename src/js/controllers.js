/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import { isEmpty, uniqBy, includes, values, keys, unionBy } from 'lodash';
import onChange from 'on-change';
import validate from './validator.js';
import parse from './parser.js';

let counterRFR = 0;

const responseFeedsResourses = (watchedState) => {
  const {
    errorMessages,
    // process,
    proxy,
    channels,
    timerId,
    urls,
    feeds,
    posts,
  } = watchedState;

  counterRFR += 1;
  console.log('RFR', counterRFR, 'time(s)', ' URLS ->', urls);
  const state = onChange.target(watchedState);
  // console.log('state :>> ', state);

  const proxiedUrls = urls.map((url) => `${proxy}${url}`);

  const requests = proxiedUrls.map((url) => axios.get(url));

  Promise.all(requests)
    .then((responses) => {
      responses.forEach((response) => {
        // console.log('RESPONSe ', response);
        const parsed = parse(response.data.contents);

        if (!includes(state.feeds, parsed.channelTitle)) {
          watchedState.feeds.push(parsed.channelTitle);
        }
        const updatedPosts = uniqBy([...state.posts, ...parsed.channelPosts], 'title');
        // console.log('state.posts, parsed.posts :>> ', state.posts, parsed.channelPosts);
        // console.log('updatedposts :>> ', updatedPosts);
        watchedState.posts = [...updatedPosts];
      });
    })
    .catch(console.log);

  clearTimeout(timerId);
  // watchedState.process = 'input';
  // watchedState.timerId = setTimeout(responseFeedsResourses, 5000, watchedState); // рекурсивный таймер
};

let counterSubmit = 1;
const submitHandler = (watchedState) => (event) => {
  // const { proxy, inputValue, channels, urls } = watchedState;
  event.preventDefault();
  console.log('SUBMIT HANDLER ', counterSubmit);

  const requestURL = `${watchedState.proxy}${watchedState.inputValue}`;

  axios.get(requestURL)
    .then((response) => {
      // добавить проверку на уникальность URL
      if (response.data.status.content_type.includes('rss') && !watchedState.urls.includes(watchedState.inputValue)) {
        console.log('SUCCESS RSS');
        watchedState.urls.push(watchedState.inputValue);
        // watchedState.process = 'success';
        responseFeedsResourses(watchedState);
      } else {
        console.log('NOT RSSSSS');
        watchedState.message = { formatError: null };
      }
    })
    .catch((e) => {
      console.log('CATCH controLlEr NETW ERR', e, requestURL);

      // watchedState.process = 'input';
      watchedState.message = { networkError: null };
    });
  watchedState.process = 'success';
  watchedState.message = { success: null };
  counterSubmit += 1;
};

const inputHandler = (watchedState) => (event) => {
  event.preventDefault();
  console.log('INPUT HANDLER ', event.target.value);

  watchedState.inputValue = event.target.value;
  const validateMessage = validate(watchedState.inputValue, watchedState.urls);

  watchedState.message = validateMessage;
  watchedState.process = 'input';
};

export { inputHandler, submitHandler, responseFeedsResourses };
