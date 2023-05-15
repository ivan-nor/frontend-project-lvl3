/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import { isEmpty } from 'lodash';
import validate from './validator.js';
import parser from './parser.js';

const inputHandler = (watchedState) => (event) => {
  event.preventDefault();
  console.log('event.target.value :>> ', event.target.value);

  watchedState.inputValue = event.target.value;
  const validateMessage = validate(watchedState.inputValue, watchedState.feeds);
  if (event.target.value === '' || isEmpty(validateMessage)) {
    watchedState.process = 'input';
    watchedState.message = {};
  }
  console.log('validateMessage :>> ', validateMessage);
};

const submitHandler = (watchedState, state, proxy) => (event) => {
  event.preventDefault();
  console.log('SUBMIT HANDLER', watchedState.inputValue);

  const requestURL = `${proxy}${(watchedState.inputValue)}`;

  axios.get(requestURL)
    .then((response) => {
      console.log('response :>> ', response);
      if (response.data.status.content_type.indexOf('xml') > 0 && response.data.contents.length > 0) {
        // watchedState.process = 'success';
        watchedState.feeds.push(watchedState.inputValue);
        console.log('THEN success resp url');
        // responseFeedsResourses();
      } else {
        // console.log('NOT RSSSSS');
        watchedState.errorMessages = { formatError: null };
      }
    })
    .catch(() => {
      // console.log('CATCH controLEr NETW ERR');
      watchedState.process = 'input';
      watchedState.errorMessages = { networkError: null };
    });
  watchedState.process = 'success';
};

export { inputHandler, submitHandler };
