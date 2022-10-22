import * as yup from 'yup';
import keyBy from 'lodash/keyBy.js';

export default (url, feeds) => {
  const schema = yup.object().shape({
    url: yup.string().url().notOneOf(feeds.map((feed) => feed.url)),
  });

  try {
    schema.validateSync({ url }, { abortEarly: false });
    return {};
  } catch (e) {
    return keyBy(e.inner, 'type');
  }
};
