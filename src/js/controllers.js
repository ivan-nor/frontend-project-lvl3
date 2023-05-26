/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import { isEmpty, uniqBy } from 'lodash';
import validate from './validator.js';
import parse from './parser.js';

let counterRFR = 0;

const responseFeedsResourses = (watchedState) => {
  const {
    errorMessages,
    process,
    proxy,
    channels,
    timerId,
    urls,
  } = watchedState;

  counterRFR += 1;
  console.log('RFR', counterRFR, 'time(s)', '->', urls);

  const proxiedUrls = urls.map((url) => `${proxy}${url}`);
  // console.log('proxiedUrls :>> ', proxiedUrls);
  const requests = proxiedUrls.map((url) => axios.get(url));
  Promise.all(requests)
    .then((responses) => {
      responses.forEach((response) => {
        // console.log('RESPONSe ', response);
        const parsed = parse(response.data.contents);
        // console.log('parsed :>> ', parsed);

        if (watchedState.channels.length === 0) {
          watchedState.channels.push(parsed);
        }
        let counterChannelsUpdate = 0;
        watchedState.channels.map((channel) => { // добавить каналы которых нет в стейт, а еще перебор постов и добавление новых
          console.log('>>>', channel);
          console.log('counterChannelsUpdate :>> ', ++counterChannelsUpdate, '\n', channel.channelTitle, '\n', parsed.channelTitle);
          if (channel.channelTitle === parsed.channelTitle) {
            console.log('!!!!', channel.channelPosts.length, parsed.channelPosts.length);
            const updatePosts = uniqBy([...channel.channelPosts, parsed.channelPosts]);
            console.log('{ ...channel, channelPosts: updatePosts } :>> ', { ...channel, channelPosts: updatePosts });
            return { ...channel, channelPosts: updatePosts };
          }
          return parsed;
        });
      });
    })
    .catch(console.log);

  // const urls = channels.map(({ channelLink }) => {
  //   console.log('CHANNEL LINK', channelLink);
  //   return axios.get(`${proxy}${channelLink}`)
  //     .then((response) => {
  //       console.log('RESP MAP GET ', response);
  //       return parse(response.data.contents);
  //     })
  //     .catch((e) => {
  //       console.log('ERROR RFR LINK ITER');
  //       console.log('e :>> ', e);
  //     });
  // });

  // Promise.all(urls)
  //   .then((res) => console.log('Promise All success', res))
  //   .catch((e) => console.log('Promise All error', e));

  // перебрать все каналы, загрузиь посты по каждой ссылке и сравнить с соотв постами в соотв канале
  // channels.forEach(({ // перебор каналов
  //   channelTitle,
  //   channelDescription,
  //   channelPosts,
  //   channelLink,
  // }) => {
  //   console.log(channelTitle, channelDescription, channelPosts, channelLink);

  //   axios.get(`${proxy}${channelLink}`)
  //     .then((response) => {
  //       console.log('RESP MAP GET ', response);
  //       return parse(response.data.contents);
  //     })
  //     .catch((e) => {
  //       console.log('ERROR RFR LINK ITER');
  //       console.log('e :>> ', e);
  //     });

  //   channelPosts.forEach(({ title, description, link }) => { // перебор постов в канале
  //     // console.log(title, description, link);

  //     // запрос по ссылке канала на новые посты

  //   });
  // });

  clearTimeout(timerId);
  watchedState.process = 'input';
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
      // console.log('response :>> ', response);

      if (response.data.status.content_type.includes('rss')) {
        console.log('SUCCESS RSS');
        watchedState.urls.push(watchedState.inputValue);
        watchedState.process = 'success';
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
  const validateMessage = validate(watchedState.inputValue, watchedState.urls);

  if (event.target.value === '' || isEmpty(validateMessage)) {
    watchedState.process = 'input';
    watchedState.message = {};
  }
  console.log('validateMessage :>> ', validateMessage);
};

export { inputHandler, submitHandler, responseFeedsResourses };
