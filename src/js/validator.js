import * as yup from 'yup';
import keyBy from 'lodash/keyBy.js';

export default (url, urls) => {
  // console.log('RUN VALIDATE', url, urls);
  const schema = yup.object().shape({
    url: yup.string().notOneOf(urls).url(),
  });

  try {
    schema.validateSync({ url }, { abortEarly: false });
    return {};
  } catch (e) {
    // console.log(keyBy(e.inner, 'type'));
    return keyBy(e.inner, 'type');
  }
};
