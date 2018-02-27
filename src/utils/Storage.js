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

  feedBySlug(slug) {
    let res = this.feeds.filter(feed => feed.slug === slug);
    return res.length > 0 ? res[0] : null;
  }

  categoryBySlug(slug) {
    let res = this.categories.filter(obj => obj.slug === slug);
    return res.length > 0 ? res[0] : null;
  }
}

export default Storage = new TheStorage();
