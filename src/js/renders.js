import _ from 'lodash';
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

export const renderModal = ({
  title, description, link,
}) => {
  console.log('title', title, 'descrip', description, 'link', link);
  const modalTitle = document.querySelector('.modal-title');
  modalTitle.textContent = '';
  const modalBody = document.querySelector('.modal-body');
  modalBody.textContent = '';
  const modalA = document.querySelector('.modal-footer > a');
  modalA.setAttribute('href', '#');

  modalTitle.textContent = title;
  modalBody.textContent = description;
  modalA.setAttribute('href', link);
};

export const renderContent = (feedsElement, postsElement, channels) => {
  console.log('RENDER CONTENT');
  feedsElement.innerHTML = '';
  postsElement.innerHTML = '';

  const feedsCard = createCardElement('Фиды');
  const feedsUl = feedsCard.querySelector('ul');
  feedsCard.append(feedsUl);

  const postsCard = createCardElement('Посты');
  const postUl = postsCard.querySelector('ul');
  postsCard.append(postUl);

  channels.forEach(({ channelTitle, channelDescription, posts }) => {
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

    _.sortBy(posts, (post) => post.postId).forEach((post) => {
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
      postButton.addEventListener('click', clickPostHandler(post, renderModal));

      postsLi.append(postA, postButton);
      postsLi.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0', 'mr-1');
      postUl.append(postsLi);
    });
  });

  if (channels.length) {
    feedsElement.append(feedsCard);
    postsElement.append(postsCard);
  }
};
