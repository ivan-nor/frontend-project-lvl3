import axios from 'axios';
import validate from './validator';
import parse from './parser';

const clickPostHandler = (elements, post, renderModalFunction) => (event) => {
  console.log('CLICK POST');
  if (event.target.tagName === 'BUTTON') {
    event.preventDefault();
    renderModalFunction(elements, post);
  }
  Object.defineProperty(post, 'visited', { value: true });
  const a = event.target.parentNode.firstElementChild;
  a.className = 'fw-normal link-secondary';
};

const inputHandler = (watchedState) => (event) => {
  event.preventDefault();
  console.log('INPUT HANDLER');
  watchedState.inputValue = event.target.value;
  const newErrorMessages = validate(watchedState.inputValue, watchedState.urls);
  watchedState.errorMessages = (watchedState.inputValue === '') ? {} : { ...newErrorMessages };
  // console.log('inputValue :>> ', watchedState.inputValue);
};

const submitHandler = (watchedState, proxy) => (event) => {
  event.preventDefault();
  const form = event.target;

  console.log('SUBMIT HANDLER');
  let {
    inputValue,
    process,
    urls,
    errorMessages,
  } = watchedState;
  watchedState.process = 'sending';
  const requestURL = `${proxy}${encodeURIComponent(inputValue)}`;
  axios.get(requestURL)
    .then((response) => {
      // console.log('response :>> ', response);
      if (response.data.status.content_type.indexOf('xml') > 0 && response.data.contents.length > 0) {
        watchedState.process = 'success';
        urls.push(inputValue);
        form.reset();
      } else {
        // console.log('NOT RSSSSS');
        watchedState.errorMessages = { formatError: null };
      }
    })
    .catch(() => {
      watchedState.process = 'input';
      watchedState.errorMessages = { networkError: null };
    });
};

let count = 0;
const responseFeedsResourses = (watchedState, state, feedLinks) => () => {
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
    const requestURL = `${proxy}${encodeURIComponent(feed)}`;
    return axios.get(requestURL)
      .then((response) => {
        // console.log('RESPONSE DATA', response.data);
        const contentType = response.data.status.content_type;
        if (contentType.includes('xml')) {
          return parse(response.data.contents);
        }
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
      const newPosts = [];
      channelPosts.forEach((post) => {
        if (!(state.posts.map((p) => p.pubDateMs).includes(post.pubDateMs))) {
          newPosts.push(post);
        }
      });
      // console.log('newPosts :>> ', newPosts);
      if (newPosts.length > 0) {
        posts.push(...newPosts);
      }
      if (!(state.feeds.map((f) => f.channelTitle).includes(channelTitle))) {
        feeds.push({ channelTitle, channelDescription });
      }
    });
  });
  clearTimeout(state.timerId);
  state.timerId = setTimeout(responseFeedsResourses(watchedState, state, feedLinks), 5000);
};

export {
  inputHandler,
  submitHandler,
  clickPostHandler,
  responseFeedsResourses,
};
