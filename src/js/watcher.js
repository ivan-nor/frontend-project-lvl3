import onChange from 'on-change';

export default (elements, state, t) => {
  const {
    form,
    input,
    button,
    feedback,
  } = elements;

  console.log('SET WATCHER');
  let counter = 0;

  function watch(path, value, previousValue) {
    counter += 1;
    console.log('WATCHER CALLED', counter, 'time(s) PATH :>>', path, 'PREV ->', previousValue, 'VALUE ->', value);

    switch (path) {
      case 'process':
        if (state.process === 'sending') {
          break;
        }
        if (state.process === 'success') {
          form.reset();
          input.focus();
        }
        input.focus();
        break;
      case 'form.status':
        break;
      case 'inputValue':
        break;
      case 'posts':
        break;
      case 'feeds':
        break;
      case 'message':
        break;
      case 'timerId':
        break;
      case 'channels':
        break;
      default:
        break;
    }
  }
  return onChange(state, watch, { ignoreKeys: ['timerId'] });
};
