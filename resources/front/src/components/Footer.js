import React from 'react';

export default () => (
  <footer className="bg-light small">
    <div className="container py-6">
      <div className="row">
        <div className="col text-center">
          <p className="mb-2">
            ReaderFeeder &copy;
            {(new Date().getFullYear())}
          </p>
          <p className="mb-0">
            <a href="/terms" target="_blank" className="link-dark">Terms of Use</a>
            &nbsp; &middot; &nbsp;
            <a href="/privacy" target="_blank" className="link-dark">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  </footer>
);
