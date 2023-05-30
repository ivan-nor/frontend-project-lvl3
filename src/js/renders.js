/* eslint-disable no-param-reassign */

const hr = document.createElement('hr');

const renderFeeds = (state, feedsElement, t) => {
  console.log('state, state.feeds :>> ', state.feeds);
  console.log('click render feeds', feedsElement);
  feedsElement.innerHTML = '';
  const ul = document.createElement('ul');
  state.feeds.forEach((feed) => {
    console.log('feed :>> ', feed);
    const li = document.createElement('li');
    li.textContent = feed;
    ul.append(li);
  });
  feedsElement.append(ul);
};

const renderMessage = (state, elements, t) => {
  console.log('RENDER FEEDBACK');
  const { feedback, input, button } = elements;

  input.classList.remove('is-valid', 'is-invalid');
  button.classList.remove('disabled');
  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');

  const messages = [];
  Object.keys(state.message).forEach((key) => {
    messages.push(t(`errorMessages.${key}`));
    input.classList.add('is-invalid');
    button.classList.add('disabled');
  });
  feedback.innerHTML = messages.join('\n');

  if (messages.length === 0 && state.inputValue.length > 0) {
    input.classList.add('is-valid');
  }
};

const renderPosts = (state, postsElement, t) => {
  console.log('state.posts :>> ', state.posts);

  if (state.posts.lenght === 0) {
    postsElement.innerHTML = '';
  } else {
    const ul = document.createElement('ul');
    state.posts.forEach(({ title, description, link }) => {
      // console.log('object :>> ', title, description, link);
      const li = document.createElement('li');
      li.textContent = `${title} \n ${description} \n ${link}`;
      ul.append(li);
    });
    postsElement.append(ul);
  }
};

export { renderFeeds, renderMessage, renderPosts };
