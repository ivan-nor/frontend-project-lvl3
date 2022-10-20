import { isEmpty } from 'lodash';
import axios from 'axios';
import validate from './validator';
import parse from './parser';

const proxy = 'https://allorigins.hexlet.app/get?url=';

// let counter = 0; // реализация счетчика кликов
// const count = () => {
//   counter += 1;
//   return counter;
// };

const clickPostHandler = (post, renderModalFunction) => (event) => {
  if (event.target.tagName === 'BUTTON') {
    event.preventDefault();
    renderModalFunction(post);
  }
  post.visited = true;
  const a = event.target.parentNode.firstElementChild;
  a.className = 'fw-normal link-secondary';
};

const inputHandler = (watchedState) => (event) => {
  event.preventDefault();
  watchedState.inputValue = event.target.value;
  const newErrorMessages = validate(watchedState.inputValue, watchedState.feeds);
  watchedState.isValid = isEmpty(newErrorMessages) || watchedState.inputValue === '';
  watchedState.errorMessages = newErrorMessages;
};

const submitHandler = (watchedState) => (event) => {
  // const { feeds: feeds1, posts: posts1 } = watchedState;
  event.preventDefault();
  watchedState.process = 'sending';
  console.log('click SUBMIT');
  const requestURL = `${proxy}${encodeURIComponent(watchedState.inputValue)}`;

  axios.get(requestURL)
    .then((response) => {
      // console.log(response);
      watchedState.process = 'success';
      const contentType = response.data.status.content_type;
      const contentUrl = response.data.status.url;
      if (contentType.includes('xml')) {
        const parsed = parse(response.data.contents);
        const { channelTitle, channelDescription, posts } = parsed;
        watchedState.feeds.push({ url: contentUrl, channelTitle, channelDescription });
        watchedState.posts.push(...posts);
      } else {
        watchedState.errorMessages = ['not rss!'];
      }
      return response.data.contents;
    })
    .catch((error) => { throw new Error(error); });
  // .then((data) => {
  // });
  // .then(() => {

  // }); // добавить отрисовку ошибки в ivalid-feedback
};

export {
  inputHandler,
  submitHandler,
  clickPostHandler,
};
