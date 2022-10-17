import _ from 'lodash';

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

export default (feedsElement, postsElement, channels) => {
  feedsElement.innerHTML = '';
  postsElement.innerHTML = '';

  console.log(feedsElement, postsElement, channels);
  const feedsCard = createCardElement('Фиды');
  const feedsUl = feedsCard.querySelector('ul');
  feedsCard.append(feedsUl);

  const postsCard = createCardElement('Посты');
  const postUl = postsCard.querySelector('ul');
  postsCard.append(postUl);

  channels.forEach(({ channelTitle, channelDescription, posts, url }) => {
    const titleElement = document.createElement('span');
    titleElement.innerHTML = channelTitle;
  
    const descriptionElement = document.createElement('span');
    descriptionElement.innerHTML = channelDescription;
  
    const feedsLi = document.createElement('li');
    feedsLi.append(titleElement, descriptionElement);
    feedsLi.classList.add('list-group-item', 'border-0', 'border-end-0');
    feedsUl.append(feedsLi);

    _.sortBy(posts, (post) => post.pubDate).forEach(({ title, description, pubDate, link }) => {
      const postTitle = document.createElement('span');
      postTitle.className = '';
      postTitle.innerHTML = title;
  
      const postDescription = document.createElement('span');
      postDescription.innerHTML = description;
      postDescription.className = '';
  
      const postLink = document.createElement('span');
      postLink.innerHTML = link;
      postLink.className = '';
  
      const postsLi = document.createElement('li');
      postsLi.append(postTitle, postDescription, postLink);
      postsLi.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      postUl.append(postsLi);
    });
  });

  if (channels.length) {
    feedsElement.append(feedsCard);
    postsElement.append(postsCard);
  }
};

// export const renderFeeds = (channels) => {
//   const feedsCard = createCardElement('Фиды');
//   const feedsUl = feedsCard.querySelector('ul');
//   feedsCard.append(feedsUl);

//   channels.forEach(({ channelTitle, channelDescription }) => {
//     const titleElement = document.createElement('span');
//     titleElement.innerHTML = channelTitle;
  
//     const descriptionElement = document.createElement('span');
//     descriptionElement.innerHTML = channelDescription;
  
//     const feedsLi = document.createElement('li');
//     feedsLi.append(titleElement, descriptionElement);
//     feedsUl.append(feedsLi);
//   })
//   return feedsCard;
// };

// export const renderPosts = (channels) => {
//   const card = createCardElement('Посты');
//   const postUl = card.querySelector('ul');
//   _.sortBy(posts, (post) => post.pubDate).forEach(({ title, description, link, pubDate }) => {
    
//   });

//   return card;
// };
