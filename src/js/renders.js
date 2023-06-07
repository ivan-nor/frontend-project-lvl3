/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import { sortBy } from 'lodash';

const renderFeeds = (state, feedsElement, t) => {
  console.log('RENDER FEEDS called');
  feedsElement.innerHTML = '';

  const h2 = document.createElement('h2');
  h2.textContent = t('feedsName');

  const ul = document.createElement('ul');
  state.feeds.forEach(({ channelTitle, channelDescription }) => {
    const li = document.createElement('li');
    li.textContent = `${channelTitle} | ${channelDescription}`;
    ul.append(li);
  });

  feedsElement.append(h2, ul);
};

const renderMessage = (state, elements, t) => { // изменить отрисову сообщений
  // подумать как сделать либо только по ключу отрисовывать разные увета либо
  // по состоянию лейбла, danger, warning, success, empty
  // тогда состояния формы, сообдщения ИЛИ только ПРОЦЕСС input success error sending !!!!!

  const { feedback } = elements;

  const keyMessage = state.message;

  feedback.innerHTML = (state.message) ? t(`messages.${keyMessage}`) : '';
  console.log('RENDER FEEDBACK CALLED key message |', keyMessage, '| html |', feedback.innerHTML);
};

const renderForm = (state, elements, t) => {
  // console.log('RENDER FORM called');

  const {
    form, feedback, input, button,
  } = elements;

  feedback.classList.remove('text-success', 'text-danger', 'text-warning');
  button.classList.remove('disabled');
  input.classList.remove('is-valid', 'is-invalid');

  const processRenders = {
    success: () => {
      console.log('CALLED PROCESS RENNDERING SUCCESS =>', state.process);
      form.reset();
      input.focus();
      feedback.classList.add('text-success');
    },
    input: () => {
      console.log('CALLED PROCESS RENNDERING INPUT =>', state.process, state.inputValue.length);
      if (state.inputValue.length > 0) {
        input.classList.add('is-valid');
      }
      // input.classList.remove('is-valid', 'is-invalid');
    },
    error: () => {
      console.log('CALLED PROCESS RENNDERING ERROR =>', state.process);
      // button.classList.add('disabled');
      feedback.classList.add('text-danger');
      input.classList.add('is-invalid');
      input.focus();
    },
    sending: () => {
      console.log('CALLED PROCESS RENNDERING SENDING =>', state.process);
      button.classList.add('disabled');
      feedback.classList.add('text-warning');
      form.reset();
    },
  };

  processRenders[state.process](); // диспетчеризация отрисовки по процессу
};

const renderPosts = (state, postsElement, t) => {
  console.log('RENDER POSTS Called');
  postsElement.innerHTML = '';

  const h2 = document.createElement('h2');
  h2.textContent = t('postsName');

  const ul = document.createElement('ul');
  sortBy(state.posts, (p) => p.id).forEach(({ title, description, link }) => {
    const li = document.createElement('li');
    // li.textContent = `${title} \n ${description} \n ${link}`; // попытка пройти тесты
    li.textContent = `${title}`;
    ul.append(li);
  });
  postsElement.append(h2, ul);
};

export {
  renderFeeds, renderMessage, renderPosts, renderForm,
};
