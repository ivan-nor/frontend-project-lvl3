/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import { uniqBy, uniqueId } from 'lodash';
import onChange from 'on-change';
import validate from './validator.js';
import parse from './parser.js';

let counterRFR = 0;

/*
Реализуйте валидацию в форме добавления RSS-потока.
После отправки данных формы, приложение должно производить валидацию и подсвечивать красным рамку вокруг инпута, если адрес невалидный.
Помимо корректности ссылки, нужно валидировать дубли. Если урл уже есть в списке фидов, то он не проходит валидацию.
После того как поток добавлен, форма принимает первоначальный вид (очищается инпут, устанавливается фокус).
*/

const responseFeedsResourses = (watchedState) => {
  const {
    proxy,
    timerId,
    urls,
  } = watchedState;

  counterRFR += 1;
  console.log('RFR', counterRFR, 'time(s)');
  const state = onChange.target(watchedState);

  const proxiedUrls = urls.map((url) => `${proxy}${url}`);
  const requests = proxiedUrls.map((url) => axios.get(url)); // для отключ CORS ??? { withCredentials: false }

  Promise.all(requests)
    .then((responses) => {
      responses.forEach((response) => {
        console.log('RESPONSE ', response);

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
  watchedState.timerId = setTimeout(responseFeedsResourses, 5000, watchedState); // рекурсивный таймер
};

let counterSubmit = 1;
const submitHandler = (watchedState) => (event) => {
  event.preventDefault();
  console.log('SUBMIT HANDLER ', counterSubmit);

  const validateMessage = validate(watchedState.inputValue, watchedState.urls); // валидация после отправки формы
  const keyMessage = Object.keys(validateMessage)[0] || '';
  watchedState.message = keyMessage;
  watchedState.process = (keyMessage) ? 'error' : 'input';

  if (!watchedState.message) {
    const requestURL = `${watchedState.proxy}${watchedState.inputValue}`;

    axios.get(requestURL) // без сети для разработки, { withCredentials: false }
      .then((response) => {
        if (response.data.status.content_type.includes('rss') && !watchedState.urls.includes(watchedState.inputValue)) {
          console.log('SUCCESS RSS');
          watchedState.urls.push(watchedState.inputValue);
          watchedState.message = 'success';
          watchedState.process = 'success';
          responseFeedsResourses(watchedState);
        } else {
          console.log('NOT RSSSSS');
          watchedState.process = 'error';
          watchedState.message = 'formatError';
        }
      })
      .catch((e) => {
        console.log('CATCH NETWORK ERROR', e, requestURL);
        watchedState.process = 'error';
        watchedState.message = 'networkError';
      });
  }
  counterSubmit += 1;
};

const inputHandler = (watchedState) => (event) => {
  event.preventDefault();
  console.log('INPUT HANDLER :>> ', event.target.value);
  watchedState.inputValue = event.target.value;
};

export { inputHandler, submitHandler, responseFeedsResourses };
