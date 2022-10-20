export default (stringContainingXMLSource) => {
  const parserInstanse = new DOMParser();
  const doc = parserInstanse.parseFromString(stringContainingXMLSource, 'application/xml');
  const items = doc.querySelectorAll('item');
  const channelTitle = doc.querySelector('channel > title');
  const channelDescription = doc.querySelector('channel > description');

  const channel = {
    channelTitle: channelTitle.textContent,
    channelDescription: channelDescription.textContent,
    posts: [],
  };

  items.forEach((item) => {
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    const pubDate = item.querySelector('pubDate').textContent;

    channel.posts.push({
      title,
      description,
      link,
      pubDate,
      pubDateMs: Date.parse(pubDate),
    });
  });
  return channel;
};
