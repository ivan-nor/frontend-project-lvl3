import { sortBy } from 'lodash';
import { clickPostHandler } from './controllers';

const createCardElement = (title) => {
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.innerHTML = title;
  cardBody.append(cardTitle);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  card.append(cardBody);
  card.append(ul);

  return card;
};

const renderFeeds = (state, elements, t) => {
  // console.log('RENDER FEEDS');
  const { feeds: feedsElement } = elements;
  feedsElement.innerHTML = '';

  const feedsName = t('feedsName');
  const feedsCard = createCardElement(feedsName);
  const feedsUl = feedsCard.querySelector('ul');
  feedsCard.append(feedsUl);

  state.feeds.forEach(({ channelTitle, channelDescription }) => {
    const feedsLi = document.createElement('li');
    feedsLi.textContent = `${channelTitle} | ${channelDescription}`;
    feedsLi.classList.add('list-group-item', 'border-0', 'border-end-0');
    feedsUl.append(feedsLi);
  });

  if (Object.values(state.feeds)) { feedsElement.append(feedsCard); }
};

const renderMessage = ({ message }, elements, t) => {
  // console.log('RENDER MESSAGE', message);
  const { feedback } = elements;
  feedback.innerHTML = (message) ? t(`messages.${message}`) : '';
};

const renderForm = (state, elements) => {
  const {
    form, feedback, input, button,
  } = elements;

  feedback.classList.remove('text-success', 'text-danger', 'text-warning');
  button.classList.remove('disabled');
  input.classList.remove('is-valid', 'is-invalid');

  // console.log('RENDER FORM PROCESS', state.process);
  const processRenders = {
    success: () => {
      form.reset();
      input.focus();
      feedback.classList.add('text-success');
    },
    input: () => {
      if (state.inputValue.length > 0) {
        input.classList.add('is-valid');
      }
    },
    error: () => {
      feedback.classList.add('text-danger');
      input.classList.add('is-invalid');
      input.focus();
    },
    sending: () => {
      button.classList.add('disabled');
      feedback.classList.add('text-warning');
      form.reset();
    },
  };

  processRenders[state.process]();
};

const renderPosts = (watchedState, elements, t) => {
  // console.log('RENDER POSTS');
  const {
    posts: postsElement,
  } = elements;
  postsElement.innerHTML = '';

  const postsName = t('postsName');
  const postsCard = createCardElement(postsName);
  const postUl = postsCard.querySelector('ul');
  postsCard.append(postUl);

  sortBy(watchedState.posts, (p) => p.id)
    .reverse()
    .forEach((post) => {
      const {
        title, link, id, visited,
      } = post;

      const postA = document.createElement('a');
      postA.setAttribute('href', link);
      postA.setAttribute('target', '_blank');
      postA.setAttribute('rel', 'noopener noreferrer');
      postA.setAttribute('data-id', id);
      postA.className = (visited) ? 'fw-normal link-secondary' : 'fw-bold';
      postA.textContent = title;

      const postButton = document.createElement('button');
      postButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      postButton.setAttribute('data-id', id);
      postButton.setAttribute('type', 'button');
      postButton.setAttribute('data-bs-toggle', 'modal');
      postButton.setAttribute('data-bs-target', '#modal');
      postButton.textContent = t('messages.sending');

      const postsLi = document.createElement('li');
      postsLi.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0', 'mr-1');
      postsLi.addEventListener('click', clickPostHandler(post, postsLi, watchedState, t));
      postsLi.append(postA, postButton);

      postUl.append(postsLi);
    });
  if (Object.values(watchedState.posts)) {
    postsElement.append(postsCard);
  }
};

const renderModal = (state, elements) => {
  // console.log('RENDER MODAL');
  const {
    title: modalTitle,
    body: modalBody,
    link: modalLink,
  } = elements.modal;

  const {
    title, description, link,
  } = state.modal;

  modalTitle.textContent = '';
  modalBody.innerHTML = '';
  modalLink.setAttribute('href', '#');

  const modalTextContainer = document.createElement('div');
  modalTextContainer.classList.add('container', 'p-1');

  const descriptionHTML = new DOMParser().parseFromString(description, 'text/html');
  const imgElements = descriptionHTML.querySelectorAll('img');
  imgElements.forEach((img) => {
    img.classList.add('img-fluid');
  });
  descriptionHTML.body.childNodes.forEach((el) => modalTextContainer.append(el));
  modalBody.append(modalTextContainer);
  modalTitle.textContent = title;
  modalLink.setAttribute('href', link);
};

export {
  renderFeeds, renderMessage, renderPosts, renderForm, renderModal,
};
