import * as yup from 'yup';
import keyBy from 'lodash/keyBy.js';

export default (url, feeds) => {
  console.log('RUN VALIDATE');
  const schema = yup.object().shape({
    url: yup.string().url().notOneOf(feeds),
  });

  try {
    schema.validateSync({ url }, { abortEarly: false });
    return {};
  } catch (e) {
    console.log(keyBy(e.inner, 'type'));
    return keyBy(e.inner, 'type');
  }
};
