import _ from 'lodash';

export default (container, watchedState, i18nInstance, button) => {
  // console.log('RENDER', container, watchedState, i18nInstance);
  console.log('RENDER');
  console.log('is empry error messages', _.isEmpty(watchedState.errorMessages));
  console.log('isValid ->', watchedState.isValid);
  console.log('inputvalue ->', watchedState.inputValue);
  console.log('isvalid or inputvalue', watchedState.isValid || watchedState.inputValue);
  console.log('isvalid or not inputvalue', watchedState.isValid || !watchedState.inputValue);
  const form = container.querySelector('form');
  form.classList.add('was-validated');
  console.log('form class list before ->', form.className);
  const input = container.querySelector('input');
  
  // input.classList.add('is-valid');
  if (!watchedState.isValid || !watchedState.inputValue) {
    console.log('remove --->', form.className, watchedState.isValid);
    // input.classList.remove('is-valid');
    form.classList.remove('was-validated');
  }
  console.log('form class list after ->', form.className);

  button.disabled = (watchedState.process === 'sending');
  const content = container.querySelector('#content');
  const ul = document.createElement('ul');
  content.append(ul);
  watchedState.lists.forEach(({ data }) => {
    const li = document.createElement('li');
    li.innerHTML = JSON.stringify(data, null, 4);
    ul.append(li);
  });
};
