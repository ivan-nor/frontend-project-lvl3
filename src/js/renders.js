/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */

const renderFeeds = (state, feedsElement, t) => {
  console.log('state, state.feeds :>> ', state.feeds);
  console.log('click render feeds', feedsElement);
  feedsElement.innerHTML = '';
  const ul = document.createElement('ul');
  state.feeds.forEach(({ channelTitle, channelDescription }) => {
    // console.log('feed :>> ', feed);
    const li = document.createElement('li');
    li.textContent = `${channelTitle} | ${channelDescription}`;
    ul.append(li);
  });
  feedsElement.append(ul);
};

const renderMessage = (state, elements, t) => { // изменить отрисову сообщений
  // подумать как сделать либо только по ключу отрисовывать разные увета либо
  // по состоянию лейбла, danger, warning, success, empty
  // тогда состояния формы, сообдщения ИЛИ только ПРОЦЕСС input success error sending !!!!!

  console.log('RENDER FEEDBACK', 'State process', state.process);
  const { feedback } = elements;

  const keyMessage = state.message;
  const textMessage = t(`messages.${keyMessage}`);
  // console.log('!!!', keyMessage, textMessage);

  console.log('state.message, state.inputValue :>> ', state.message, state.inputValue);
  feedback.innerHTML = (state.message) ? textMessage : '';
};

const renderForm = (state, elements, t) => {
  const {
    form, feedback, input, button,
  } = elements;

  console.log('renderFORM called');

  feedback.classList.remove('text-success', 'text-danger', 'text-warning');
  button.classList.remove('disabled');
  input.classList.remove('is-valid', 'is-invalid');
  // input.classList.add('is-invalid');

  const processRenders = {
    success: () => {
      console.log('CALLED PROCESS RENNDERING SUCCESS =>', state.process);
      feedback.classList.add('text-success');
      form.reset();
      input.focus();
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
      button.classList.add('disabled');
      feedback.classList.add('text-danger');
      input.classList.add('is-invalid');
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
  console.log('state.posts        V');
  state.posts.forEach(console.log);

  if (state.posts.lenght === 0) {
    postsElement.innerHTML = '';
  } else {
    const ul = document.createElement('ul');
    state.posts.forEach(({ title, description, link }) => {
      // console.log('object :>> ', title, description, link);
      const li = document.createElement('li');
      // li.textContent = `${title} \n ${description} \n ${link}`; // попытка пройти тесты
      li.textContent = `${title}`;
      ul.append(li);
    });
    postsElement.append(ul);
  }
};

export {
  renderFeeds, renderMessage, renderPosts, renderForm,
};
