import { uniqueId } from 'lodash';

const isJsonString = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export default (str) => {
  const stringContainingXMLSource = isJsonString(str) ? JSON.parse(str) : str;
  const parserInstanse = new DOMParser();
  try {
    const doc = parserInstanse.parseFromString(stringContainingXMLSource, 'application/xml');
    // console.log(doc.querySelector('parsererror'));
    if (doc.querySelector('parsererror')) {
      throw new Error('formatError');
    }
    // console.log('PARSER', doc);
    const items = doc.querySelectorAll('item');
    const channelTitle = doc.querySelector('channel > title');
    const channelDescription = doc.querySelector('channel > description');
    const channelLink = doc.querySelector('channel > link');

    const channel = {
      channelTitle: channelTitle.textContent,
      channelDescription: channelDescription.textContent,
      channelPosts: [],
      channelLink: channelLink.textContent,
      channelId: uniqueId(),
    };

    items.forEach((item) => {
      const title = item.querySelector('title').textContent;
      const description = item.querySelector('description').textContent;
      const link = item.querySelector('link').textContent;

      channel.channelPosts.push({
        title,
        description,
        link,
        id: uniqueId(),
      });
    });
    return channel;
  } catch (error) {
    console.log('ERR in PARSER', error.message);

    throw new Error('formatError');
  }
};
