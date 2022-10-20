import * as yup from 'yup';
import keyBy from 'lodash/keyBy.js';

export default (url, feeds) => {
  const schema = yup.object().shape({
    url: yup.string().url().notOneOf(feeds.map((feed) => feed.url)),
  });

  console.log('VALIDATOR, url --> ', url);
  // const feedLinks = collection.map(({ link }) => link);
  try {
    schema.validateSync({ url }, { abortEarly: false });
    return {}; // isValidSync() ---> boolean или можно validateSync() ----> возвращает массив ошибок
  } catch (e) {
    console.log('ERROR', keyBy(e.inner, 'path'));
    return keyBy(e.inner, 'path');
  }
};
