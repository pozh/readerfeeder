let instance = null;

class TheAppState {

  constructor() {
    if (!instance) instance = this;
    this.feeds = [];
    this.categories = [];
    this.isAuthenticated = false;
    this.token = null;
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

const AppState = new TheAppState();
export default AppState;
