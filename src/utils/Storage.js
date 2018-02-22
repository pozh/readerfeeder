let instance = null;

class TheStorage {

  constructor() {
    if (!instance) instance = this;
    this.feeds = [];
    this.categories = [];
    return instance;
  }

  get isEmpty() {
    return this.feeds.length === 0;
  }

  feedIdFromSlug(slug) {
    return this.feeds.filter(feed => feed.slug === slug);
  }
}

export default Storage = new TheStorage();
