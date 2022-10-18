import _, { uniqueId } from 'lodash';
import validate from './validator';
import parse from './parser';
import { renderModal } from './renders';

const testURL = 'https://ru.hexlet.io/lessons.rss';
const testURL2 = 'https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits';
const testURL3 = 'http://lorem-rss.herokuapp.com/feed?unit=second&interval=30';

let counterClicks = 0; // реализация счетчика кликов
const count = () => {
  counterClicks += 1;
  return counterClicks;
};

const clickPostHandler = (post) => (event) => {
  if (event.target.tagName === 'BUTTON') {
    event.preventDefault();
    renderModal(post);
  }
  post.visited = true;
  const a = event.target.parentNode.firstElementChild;
  a.className = 'fw-normal link-secondary';
};

const inputHandler = (watchedState) => (event) => {
  event.preventDefault();
  watchedState.inputValue = event.target.value;
  const newErrorMessages = validate(watchedState.inputValue);
  watchedState.isValid = _.isEmpty(newErrorMessages) || watchedState.inputValue === '';
  watchedState.errorMessages = newErrorMessages;
};

const submitHandler = (watchedState) => (event) => {
  event.preventDefault();
  let { process, inputValue, channels } = watchedState;
  process = 'sending';

  const fetchPromise = fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(inputValue)}`)
    .then((response) => {
      if (response.ok) {
        process = 'success';
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then((data) => {
      console.log('DATA WAS LOAD');
      const parsed = parse(data.contents);
      const { channelTitle, channelDescription, posts } = parsed;
      const mappedPosts = posts.map((post) => ({ ...post, postId: uniqueId() }));
      channels.push({
        channelTitle,
        channelDescription,
        posts: mappedPosts,
        url: inputValue,
        channelId: uniqueId(),
        visited: false,
      });
    });

  Promise.all([fetchPromise]).then(console.log);
};

export {
  inputHandler,
  submitHandler,
  clickPostHandler,
};
