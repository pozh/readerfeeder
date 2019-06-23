@extends('layouts.main')
@section('title', 'RSS Feeds for Kindle Paperwhite, Touch and Voyage')
@section('page-title', 'RSS Feeds')

@section('content')

  <div class="page-title">
    <div class="container">
      <h1 class="text-center mt-6 text-serif">
        RSS Feeds
        <small class="d-block h6 text-muted font-weight-normal">
          Full text feeds for Kindle, Kindle Touch, Paperwhite, Oasis &amp; Voyage
        </small>
      </h1>
      <p class="text-center lead mt-2">
        Subscribe to any of the RSS Feeds listed below,
        and ReaderFeeder will start delivering them right to your Kindle.
      </p>
    </div>
  </div>

  {{-- Categories --}}
  <div class="section mt-6">
    <div class="container">
      <h2 class="h3 mb-4 font-weight-normal">Categories</h2>
      <div class="row">
        @foreach ($categories as $category)
          <div class="col-md-6 col-lg-3 mb-5">
            <a href="{{  route('category', ['slug' => $category->slug]) }}" class="link-dark">
              <div class="cat-img" style="background-image:url(/assets/images/cat-{{ $category->slug }}.jpg);"></div>
              <h6 class="mt-2 mb-0 text-uppercase">{{ $category->title }}</h6>
            </a>
          </div>
        @endforeach
      </div>
    </div>
  </div>

  {{-- Top feeds --}}
  <div class="section mb-6">
    <div class="container">
      <h2 class="h3 mb-4 font-weight-normal">Popular feeds</h2>
      <div class="row">
        @foreach ($feeds->sortByDesc('subscribers')->slice(0,env("POPULAR_FEEDS",4))->all() as $feed)
          <div class="col-md-6 col-lg-4 mb-4">
            @include('shared.feed')
          </div>
        @endforeach
      </div>
    </div>
  </div>

  @include('shared.more-inside')

@endsection
