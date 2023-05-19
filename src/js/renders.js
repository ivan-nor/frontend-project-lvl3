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

const renderErrorMessage = (elements, state, t) => {
  console.log('RENDER FEEDBACK');
  const { feedback, input, button } = elements;

  input.classList.remove('is-valid', 'is-invalid');
  button.classList.remove('disabled');
  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');

  const messages = [];
  Object.keys(state.errorMessages).forEach((key) => {
    messages.push(t(`errorMessages.${key}`));
    input.classList.add('is-invalid');
    // button.classList.add('disabled');
  });
  feedback.innerHTML = messages.join('\n');

  if (messages.length === 0 && state.inputValue.length > 0) {
    input.classList.add('is-valid');
  }
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
