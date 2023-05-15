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
  const doc = parserInstanse.parseFromString(stringContainingXMLSource, 'application/xml');
  const items = doc.querySelectorAll('item');
  const channelTitle = doc.querySelector('channel > title');
  const channelDescription = doc.querySelector('channel > description');
  console.log('DOC', doc);

  const channel = {
    channelTitle: channelTitle.textContent,
    channelDescription: channelDescription.textContent,
    channelPosts: [],
  };

  items.forEach((item) => {
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;

    channel.channelPosts.push({
      title,
      description,
      link,
    });
  });
  return channel;
};
