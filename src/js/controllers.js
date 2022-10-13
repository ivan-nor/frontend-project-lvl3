import _ from 'lodash';
import validate from './validator';

const testURL = 'https://ru.hexlet.io/lessons.rss';
const testURL2 = 'https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits';
let counterClicks = 0;
const count = () => {
  counterClicks += 1;
  return counterClicks;
};

const inputHandler = (watcher) => (event) => {
  const watchedState = watcher;
  event.preventDefault();
  watchedState.inputValue = event.target.value;
  const errorMessages = validate(watchedState.inputValue);
  watchedState.isValid = _.isEmpty(errorMessages) || watchedState.inputValue === '';
  watchedState.errorMessages = errorMessages;
};

const submitHandler = (watchedState) => (event) => {
  let { process, inputValue, urls } = watchedState;
  event.preventDefault();
  process = 'sending';
  urls.push({ url: inputValue, content: count() });
  // fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(testURL)}`)
  //   .then((response) => {
  //     if (response.ok) {
  //       watchedState.process = 'success';
  //       return response.json();
  //     }
  //     throw new Error('Network response was not ok.');
  //   })
  //   .then((data) => {
  //     console.log('DATA WAS LOAD');
  //     console.log(data.contents);
  //     watchedState.lists.push({
  //       url: testURL,
  //       data: data.contents,
  //     });
  //   });
};

export { inputHandler, submitHandler };
