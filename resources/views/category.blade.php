@extends('layouts.main')
@section('title', $category->title)

@section('content')

  <div class="section hero-cat d-flex"
       style="background-image: url(/assets/images/cat-lg-{{ $category->slug }}.jpg);">
    <div class="container align-self-end">
      <h2 class="text-white mb-4 font-weight-normal">{{ $category->title }}</h2>
    </div>
  </div>

  {{-- Top feeds --}}
  <div class="section mb-6">
    <div class="container">
      <h2 class="h3 mb-4 font-weight-light">Top feeds</h2>
      <div class="row">
        @foreach ($feeds as $feed)
          <div class="col-md-6 col-lg-4 mb-4">
            @include('shared.feed')
          </div>
        @endforeach
      </div>
    </div>
  </div>

  @include('shared.more-inside')

@endsection
