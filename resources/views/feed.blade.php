@extends('layouts.page')
@section('title', $feed->title . ' - RSS subscription for Kindle')
@section('page-title', $feed->title)

@section('content')

  <div class="section mt-6">
    <div class="container">
      <h2 class="h3 mb-1 font-weight-light">Latest posts</h2>
      <p class="small mb-5">Note: This is a preview of the feed. Subscribe to it to get updates on your Kindle.</p>

      @foreach ($content as $source)
        @if (count($source['items']) > 0 )
          <div class="source">
            <h5 class="h6 border-bottom pb-1 mb-3">{{ htmlspecialchars_decode($source['title']) }}</h5>
            <ul class="source__toc list-unstyled">
              @foreach ($source['items'] as $item)
                <li>
                  <a href="{{ $item->get_permalink() }}" target="_blank"
                     class="font-weight-bold link-dark">{{ htmlspecialchars_decode($item->get_title()) }}</a>
                  <br>
                  <small class="text-muted">
                    {{ Carbon\Carbon::createFromFormat('Y-n-j G:i:s', $item->get_date('Y-n-j G:i:s'))->diffForHumans() }}</small>
                </li>
              @endforeach
            </ul>
          </div>
        @endif
      @endforeach

    </div>
  </div>

  <div class="section section-cta text-center mb-7">
    <div class="container">
      <p class="mt-4">
        <a class="btn btn-lg-cta" href="/app/">Sign in or Register to subscribe</a>
      </p>
    </div>
  </div>


@endsection
