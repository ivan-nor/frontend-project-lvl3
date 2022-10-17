import _ from 'lodash';
import validate from './validator';
import parse from './parser';

const testURL = 'https://ru.hexlet.io/lessons.rss';
const testURL2 = 'https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits';
const testURL3 = 'http://lorem-rss.herokuapp.com/feed?unit=second&interval=30';

// let counterClicks = 0; // реализация счетчика кликов
// const count = () => {
//   counterClicks += 1;
//   return counterClicks;
// };

const inputHandler = (watchedState) => (event) => {
  event.preventDefault();
  // let { inputValue, isValid, errorMessages } = watchedState;
  watchedState.inputValue = event.target.value;
  const newErrorMessages = validate(watchedState.inputValue);
  watchedState.isValid = _.isEmpty(newErrorMessages) || watchedState.inputValue === '';
  watchedState.errorMessages = newErrorMessages;
};

const submitHandler = (watchedState) => (event) => {
  event.preventDefault();
  let { process, inputValue, channels } = watchedState;
  process = 'sending';

  fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(testURL)}`)
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
      channels.push({ channelTitle, channelDescription, posts, url: inputValue });
    });
};

export { inputHandler, submitHandler };
