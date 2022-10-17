import * as yup from 'yup';
import keyBy from 'lodash/keyBy.js';

const schema = yup.object().shape({
  url: yup.string().url(),
});

export default (url) => {
  console.log('VALIDATOR, url --> ', url);
  try {
    schema.validateSync({ url }, { abortEarly: false }); // isValidSync() --> boolean
    return {}; // или можно validateSync() --> возвращает массив ошибок
  } catch (e) {
    console.log('ERROR', keyBy(e.inner, 'path'));
    return keyBy(e.inner, 'path');
  }
};
