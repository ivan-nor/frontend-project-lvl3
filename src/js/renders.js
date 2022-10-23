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

export const renderErrors = (elements, state, t) => {
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
    button.classList.add('disabled');
  });
  feedback.innerHTML = messages.join('\n');

  if (messages.length === 0 && state.inputValue.length > 0) {
    input.classList.add('is-valid');
  }
};

export const renderModal = ({ modal }, post) => {
  console.log('RENDER MODAL');
  const {
    title: modalTitle,
    body: modalBody,
    link: modalLink,
  } = modal;
  const { title, description, link } = post;

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

export const renderFeeds = (elements, state, t) => {
  console.log('RENDER FEEDS');
  const { feeds: feedsElement } = elements;
  const { feeds } = state;
  feedsElement.innerHTML = '';
  const feedsName = t('feedsName');
  const feedsCard = createCardElement(feedsName);
  const feedsUl = feedsCard.querySelector('ul');
  feedsCard.append(feedsUl);

  feeds.reverse().forEach(({ channelTitle, channelDescription }) => {
    // console.log('channel :>> ', channelTitle, channelDescription);
    const titleElement = document.createElement('h3');
    titleElement.classList.add('h6', 'm-0');
    titleElement.innerHTML = channelTitle;

    const descriptionElement = document.createElement('p');
    descriptionElement.classList.add('m-0', 'small', 'text-black-50');
    descriptionElement.innerHTML = channelDescription;

    const feedsLi = document.createElement('li');
    feedsLi.append(titleElement, descriptionElement);
    feedsLi.classList.add('list-group-item', 'border-0', 'border-end-0');
    feedsUl.append(feedsLi);
  });

  if (feeds.length) { feedsElement.append(feedsCard); }
};

export const renderPosts = (elements, state, t) => {
  // console.log('RENDER CONTENT', state.feeds, state.posts);
  console.log('RENDER CONTENT');
  const { posts } = state;
  const {
    posts: postsElement,
    input,
    form,
  } = elements;
  postsElement.innerHTML = '';

  const postsName = t('postsName');
  const postsCard = createCardElement(postsName);
  const postUl = postsCard.querySelector('ul');
  postsCard.append(postUl);

  posts
    .sort((a, b) => {
      if (a.pubDateMs > b.pubDateMs) { return 1; }
      return -1;
    })
    .reverse()
    .forEach((post) => {
      const {
        title, link, postId, visited,
      } = post;
      const postsLi = document.createElement('li');

      const postA = document.createElement('a');
      postA.setAttribute('href', link);
      postA.setAttribute('target', '_blank');
      postA.setAttribute('rel', 'noopener noreferrer');
      postA.setAttribute('data-id', postId);
      postA.className = visited ? 'fw-normal link-secondary' : 'fw-bold';
      postA.textContent = title;
      postA.addEventListener('click', clickPostHandler(post));

      const postButton = document.createElement('button');
      postButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      postButton.setAttribute('data-id', postId);
      postButton.setAttribute('type', 'button');
      postButton.setAttribute('data-bs-toggle', 'modal');
      postButton.setAttribute('data-bs-target', '#exampleModal');
      postButton.textContent = 'Просмотр';
      postButton.addEventListener('click', clickPostHandler(elements, post, renderModal));

      postsLi.append(postA, postButton);
      postsLi.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0', 'mr-1');
      postUl.append(postsLi);
    });
  if (posts.length) { postsElement.append(postsCard); }

  input.classList.remove('is-invalid');
  input.classList.remove('is-valid');
  form.reset();
};
