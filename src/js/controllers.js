/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import { isEmpty } from 'lodash';
import validate from './validator.js';
import parse from './parser.js';

let counterRFR = 1;
const responseFeedsResourses = (watchedState) => {
  const {
    errorMessages,
    process,
    proxy,
    channels,
    timerId,
  } = watchedState;

  // перебрать все каналы, загрузиь посты по каждой ссылке и сравнить с соотв постами в соотв канале

  clearTimeout(timerId);
  console.log('RFR ', counterRFR, 'time(s)');

  counterRFR += 1;
  watchedState.timerId = setTimeout(responseFeedsResourses, 5000, watchedState);
};

let counterSubmit = 1;
const submitHandler = (watchedState) => (event) => {
  const { proxy, inputValue, channels } = watchedState;
  event.preventDefault();
  console.log('SUBMIT HANDLER ', counterSubmit);

  const requestURL = `${proxy}${inputValue}`;

  axios.get(requestURL)
    .then((response) => {
      const parsed = parse(response.data.contents);

      if (response.data.status.content_type.includes('xml')) {
        console.log('SUCCESS RSS');
        watchedState.channels.push(parsed);
        responseFeedsResourses(watchedState);
      } else {
        console.log('NOT RSSSSS');
        watchedState.errorMessages = { formatError: null };
      }
    })
    .catch((e) => {
      console.log('CATCH controLlEr NETW ERR', e, requestURL);
      watchedState.process = 'input';
      watchedState.errorMessages = { networkError: null };
    });
  watchedState.process = 'success';
  counterSubmit += 1;
};

const inputHandler = (watchedState) => (event) => {
  event.preventDefault();
  console.log('INPUT HANDLER ', event.target.value);

  watchedState.inputValue = event.target.value;
  const validateMessage = validate(watchedState.inputValue, watchedState.feeds);

  if (event.target.value === '' || isEmpty(validateMessage)) {
    watchedState.process = 'input';
    watchedState.message = {};
  }
  console.log('validateMessage :>> ', validateMessage);
};

export { inputHandler, submitHandler };
