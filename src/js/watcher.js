import onChange from 'on-change';

export default (container, state, i18nInstance) => {
  console.log('RUN SET WATCHER');
  const form = container.querySelector('form');
  const input = form.querySelector('input');
  const content = container.querySelector('#content');
  const button = form.querySelector('button');
  console.log('button text in instanse i18next', i18nInstance.t('buttons.submit'));
  button.innerHTML = i18nInstance.t('submit');
  const invalidFeedback = form.querySelector('.invalid-feedback');
  invalidFeedback.innerHTML = i18nInstance.t('invalidFeedback');
  const label = form.querySelector('label');
  label.innerHTML = i18nInstance.t('label');
  // const feedBack = form.querySelector('');
  const ul = document.createElement('ul');
  content.append(ul);

  // eslint-disable-next-line func-names
  return onChange(state, function (...args) {
    const [path, value] = args;
    console.log(`WATCHER CASE state.${path} = ${value}`);
    button.disabled = false;
    input.focus();
    input.classList.add('is-invalid');
    switch (path) {
      case 'process':
        button.disabled = (this.process === 'sending');
        form.reset();
        break;
      case 'errorMessages':
      case 'inputValue':
      case 'isValid':
        if (this.isValid) {
          input.classList.add('is-valid');
          input.classList.remove('is-invalid');
        } else {
          button.disabled = true;
          input.classList.add('is-invalid');
          input.classList.remove('is-valid');
        }
        if (this.inputValue === '') {
          button.disabled = true;
          input.classList.remove('is-invalid');
          input.classList.remove('is-valid');
        }
        input.focus();
        break;
      case 'urls':
        ul.innerHTML = '';
        this.urls.forEach(({ url, response }) => {
          const li = document.createElement('li');
          li.innerHTML = `${url}     _____<--->_____     ${response}`;
          ul.append(li);
        });
        input.classList.remove('is-invalid');
        input.classList.remove('is-valid');
        form.reset();
        break;
      default:
        throw new Error(`Unknown watchedState path: ${path}`);
    }
  });
};
