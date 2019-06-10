@extends('layouts.main')
@section('title', 'Read RSS feeds while offline, in the sun')

@section('content')

  <div class="section" style="overflow-x:hidden;">
    <div class="container d-flex align-content-center hero">
      <div class="row align-content-center">
        <div class="col-lg-6">
          <h1 class="hero__title">
            Read your favorite RSS feeds offline, in the sun!
            <span class="d-block d-lg-none">
            <img width="65%" src="/assets/images/hero.svg" alt="" class="mt-3">
          </span>
          </h1>
          <h2 class="h5 font-weight-bold pr-xl-8">
            Follow your favorite blogs, sites &amp; news portals —
            read them all from the comfort of your Kindle Paperwhite!
            <span class="small d-block mt-3 mb-4">
              ReaderFeeder delivers articles from your favorite RSS feeds
              to your Kindle Paperwhite, wirelessly, in full-text format,
              so you can read them anywhere, even in the sun,
              thanks to Kindle&rsquo;s E-Ink screen!
          </span>
            <a class="btn btn-lg btn-primary btn-lg-cta" href="/app/">Try it free</a>
          </h2>
        </div>
        <div class="col">
          <img src="/assets/images/hero.svg" alt="" class="hero__img">
        </div>
      </div>
    </div>
  </div>

  <div class="section features">
    <div class="container">
      <h2 id="features" class="text-serif text-center mb-0">Features</h2>
      <p class="mb-5 mb-lg-7 text-muted text-center">So, why ReaderFeeder is awesome?</p>
      <div class="row">
        <div class="col-md-6 col-lg-5 offset-lg-1">
          <img src="/assets/images/brain.svg" alt="" width="64">
          <h3 class="h6 mt-4 mb-3">Distraction-free reading</h3>
          <p>
            With Kindle, it's easy to concentrate on the reading, not on the countless
            notifications, ads and other bells and whistles you are getting every second
            on your phone, tablet or laptop.
          </p>
        </div>
        <div class="col-md-6 col-lg-5">
          <img src="/assets/images/hand.svg" alt="" width="64">
          <h3 class="h6 mt-4 mb-3">Helps your eyes relax</h3>
          <p>
            Spend entire days in front of your PC screen?
            Then you should definitely consider making ReaderFeeder your default RSS
            reader. Many people say EInk screens are much less stressful to the eye than
            displays of any other type.
          </p>
        </div>
      </div>
      <div class="row mt-5">
        <div class="col-md-6 col-lg-5 offset-lg-1">
          <img src="/assets/images/fulltext.svg" alt="" width="64">
          <h3 class="h6 mt-4 mb-3">Full-text content</h3>
          <p>
            There are feeds that only provide summary posts with a link to the full
            one. That would force you to use the web browser on Kindle,
            which as you know is turtle slow. ReaderFeeder eliminates that problem
            by extracting the full posts from any URL an RSS feed contains.
          </p>
        </div>
        <div class="col-md-6 col-lg-5">
          <img src="/assets/images/wifi.svg" alt="" width="64">
          <h3 class="h6 mt-4 mb-3">Wireless delivery</h3>
          <p>
            To receive a set of fresh news and updates from ReaderFeeder, you don't even need
            to connect your Kindle to computer using a wire. Just make sure its wifi is turned
            On and connected to your local network.
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="section mt-5 mt-md-8 pricing">
    <div class="container">
      <h2 id="pricing" class="text-serif text-center mb-5 mb-lg-7">Pricing</h2>

      <p class="text-center">
        <img src="/assets/images/price.png" alt="only $5/mo" class="img-fluid" style="margin-left: -10px;">
      </p>
      <p class="text-center mt-6">
        Our pricing is dead simple: $5 + VAT per month.
        <small class="d-block text-muted">
          BTW, is that roughly a one cup of coffee in your area?
        </small>
      </p>
      <p class="text-center mb-6" style="line-height: 1.7">
        <b>You get the following: </b>
        <br>
        Unlimited subscriptions. <br class="d-none d-sm-inline">
        Unlimited personal feeds. <br class="d-none d-sm-inline">
        No restricted features. <br class="d-none d-sm-inline">
        No set up costs. <br class="d-none d-sm-inline">
        Unlimited support.
      </p>

    </div>
  </div>

  <div class="section section-cta text-center mb-6">
    <div class="container">
      <h2 class="text-serif">Get started with ReaderFeeder today</h2>
      <p class="text-center">
        And of course, you can try Readerfeeder for free,<br>
        for an unlimited period of time, with a single RSS subscription.
      </p>
      <p class="mt-4">
        <a class="btn btn-lg btn-lg-cta" href="/app/">Try it free</a>
        <br>
        <small class="text-muted">No credit card required</small>
      </p>
    </div>
  </div>

@endsection
