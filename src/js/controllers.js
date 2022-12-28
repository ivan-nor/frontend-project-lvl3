import axios from 'axios';
// import { includes } from 'lodash';
import validate from './validator';
import parse from './parser';

const clickPostHandler = (watchedState, state, postId) => (event) => { // добавить в стейт просмотренный пост и отслеживание изменений
  console.log('CLICK POST id ', postId);
  // const targetPost = state.posts.filter((postItem) => postItem.postId === postId)[0]; // старый фильтр когда state.posts массив
  const targetPost = state.posts[postId]
  if (event.target.tagName === 'BUTTON') {
    watchedState.modal = targetPost;
    watchedState.modal.visited = true;
  }
  watchedState.posts[postId].visited = true;
  // Object.defineProperty(watchedState.modal, 'visited', { value: true });
};

const inputHandler = (watchedState) => (event) => {
  event.preventDefault();
  // console.log('INPUT HANDLER');
  watchedState.inputValue = event.target.value;
  const newErrorMessages = validate(watchedState.inputValue, watchedState.urls);
  watchedState.errorMessages = (watchedState.inputValue === '') ? {} : { ...newErrorMessages };
  // console.log('inputValue :>> ', watchedState.inputValue);
};

let count = 0;
const responseFeedsResourses = (watchedState, state, feedLinks) => () => {
  // console.log('count :>> ', count);
  // console.log('CALL RFR');
  let {
    errorMessages,
    process,
    proxy,
    feeds,
    posts,
    timerId,
  } = watchedState;

  console.log('COUNT of responses :>> ', ++count);
  // console.log('RFR feedsList :>> ', feedLinks);
  // console.table(state.posts.map(p => p.pubDateMs));

  const feedsPromises = feedLinks.map((feed) => {
    const requestURL = `${proxy}${feed}`;
    return axios.get(requestURL)
      .then((response) => {
        // console.log('RESPONSE DATA', response.data);
        const contentType = response.data.status.content_type;
        if (contentType.includes('xml')) {
          return parse(response.data.contents);
        }
        // console.log('contr FEDDS PROMIS NETW ERR');
        watchedState.process = 'input';
        watchedState.errorMessages = { formatError: null };
        return null;
      })
      .catch(() => {
        watchedState.errorMessages = { networkError: null };
      });
  });
  Promise.all(feedsPromises).then((parsed) => {
    // console.log('PARSED', parsed);
    watchedState.process = 'success';
    parsed.forEach(({ channelPosts, channelTitle, channelDescription }) => {
      // console.log('parsed :>> ', channelPosts.map((post) => post.title));
      // console.log('state.feeds :>> ', state.feeds);
      // console.log('not includes(state.feeds, channelTitle) :>> ', !includes(state.feeds, channelTitle));
      const newPosts = state.posts;
      channelPosts.forEach((post) => {
        if (!Object.entries(state.posts).map(([postId, p]) => p.pubDateMs).includes(post.pubDateMs)) {
          newPosts[post.postId] = post;
        }
      });
      if (Object.keys(newPosts).length > 0) {
        watchedState.posts = {...newPosts}
      }
      if (!(state.feeds.map((f) => f.channelTitle).includes(channelTitle))) {
        feeds.push({ channelTitle, channelDescription });
      }
    });
  });
  clearTimeout(state.timerId);
  state.timerId = setTimeout(responseFeedsResourses(watchedState, state, feedLinks), 5000);
};

const submitHandler = (watchedState, state, proxy) => (event) => {
  event.preventDefault();

  // console.log('SUBMIT HANDLER');
  let {
    inputValue,
    process,
    urls,
    errorMessages,
  } = watchedState;
  watchedState.process = 'sending';
  const requestURL = `${proxy}${(inputValue)}`;
  axios.get(requestURL)
    .then((response) => {
      // console.log('response :>> ', response);
      if (response.data.status.content_type.indexOf('xml') > 0 && response.data.contents.length > 0) {
        watchedState.process = 'success';
        urls.push(inputValue);
        // console.log('THEN success resp url');
        responseFeedsResourses();
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
};

export {
  inputHandler,
  submitHandler,
  clickPostHandler,
  responseFeedsResourses,
};
