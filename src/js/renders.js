/* eslint-disable no-param-reassign */

const renderFeeds = (state, feedsElement) => {
  console.log('click render feeds', feedsElement);
  feedsElement.innerHTML = '';
  const ul = document.createElement('ul');
  state.feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.textContent = feed;
    ul.append(li);
  });
  feedsElement.append(ul);
};

const renderErrorMessage = (state, elements) => {

};

const renderPosts = (state, elements) => {
  if (state.posts.lenght === 0) {
    elements.posts.innerHTML = '';
  } else {
    const ul = document.createElement('ul');
    state.posts.forEach((post) => {
      const li = document.createElement('li');
      li.textContent = post;
      ul.append(li);
    });
    elements.posts.append(ul);
  }
};

export { renderFeeds, renderErrorMessage, renderPosts };
