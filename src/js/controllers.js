/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import {
  uniqBy, includes, uniqueId,
} from 'lodash';
import onChange from 'on-change';
import validate from './validator.js';
import parse from './parser.js';

let counterRFR = 0;

const responseFeedsResourses = (watchedState) => {
  const {
    proxy,
    timerId,
    urls,
  } = watchedState;

  counterRFR += 1;
  console.log('RFR', counterRFR, 'time(s)', ' URLS ->', urls);
  const state = onChange.target(watchedState);
  // console.log('state :>> ', state);

  const proxiedUrls = urls.map((url) => `${proxy}${url}`);
  const requests = proxiedUrls.map((url) => axios.get(url, { withCredentials: false })); // для отключ CORS ???

  Promise.all(requests)
    .then((responses) => {
      responses.forEach((response) => {
        console.log('RESPONSe ', response);

        const responseData = (proxy) ? response.data.contents : response.data; // при разработке без сети и прокси
        const parsed = parse(responseData);

        const newFeed = { channelTitle: parsed.channelTitle, channelDescription: parsed.channelDescription };
        const uniqueFeeds = uniqBy([...state.feeds, newFeed], 'channelTitle');
        console.log('newFeed, uniqueFeeds :>> ', newFeed, uniqueFeeds);
        watchedState.feeds = [...uniqueFeeds];

        const uniquePosts = uniqBy([...state.posts, ...parsed.channelPosts], 'title');
        const updatedPosts = uniquePosts.map((post) => ((post.id) ? post : { ...post, id: uniqueId(), visited: null }));
        watchedState.posts = [...updatedPosts];
      });
    })
    .catch(console.log);

  clearTimeout(timerId);
  watchedState.timerId = setTimeout(responseFeedsResourses, 1000, watchedState); // рекурсивный таймер
};

let counterSubmit = 1;
const submitHandler = (watchedState) => (event) => {
  // const { proxy, inputValue, urls } = watchedState;
  event.preventDefault();
  console.log('SUBMIT HANDLER ', counterSubmit);

  const requestURL = `${watchedState.proxy}${watchedState.inputValue}`;
  watchedState.process = 'success';
  watchedState.message = 'success';

  axios.get(requestURL, { withCredentials: false }) // без сети для разработки
    .then((response) => {
      // добавить проверку на уникальность URL
      if (response.data.status.content_type.includes('rss') && !watchedState.urls.includes(watchedState.inputValue)) {
        console.log('SUCCESS RSS');
        watchedState.urls.push(watchedState.inputValue);
        watchedState.process = 'success';
        watchedState.message = 'success';
        responseFeedsResourses(watchedState);
      } else {
        console.log('NOT RSSSSS');
        watchedState.process = 'error';
        watchedState.message = 'formatError';
      }
    })
    .catch((e) => {
      console.log('CATCH controLlEr NETW ERR', e, requestURL);
      // watchedState.urls.push(watchedState.inputValue);
      // responseFeedsResourses(watchedState);
      // для разработки без сети
      // watchedState.proxy = '';
      // watchedState.urls.push('http://localhost:5000/feed?unit=second&interval=30');
      // // watchedState.urls.push('http://localhost:5000/');
      // responseFeedsResourses(watchedState);

      watchedState.process = 'error';
      watchedState.message = 'networkError';
    });
  watchedState.process = 'success';
  watchedState.message = 'success';
  counterSubmit += 1;
};

const inputHandler = (watchedState) => (event) => {
  event.preventDefault();
  // console.log('event.type :>> ', event.type);
  watchedState.inputValue = event.target.value;
  const validateMessage = validate(watchedState.inputValue, watchedState.urls);

  const keyMessage = Object.keys(validateMessage)[0];
  watchedState.message = keyMessage;

  watchedState.process = (keyMessage) ? 'error' : 'input';
  // console.log('! ! ! => ', watchedState.message, watchedState.process);
};

export { inputHandler, submitHandler, responseFeedsResourses };
