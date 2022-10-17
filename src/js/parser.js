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
    const [title, description, link, pubDate] = item.childNodes;
    channel.posts.push({
      title: title.textContent,
      description: description.textContent,
      link: link.textContent,
      pubDate: pubDate.textContent,
    });
  });
  return channel;
};
