<div class="feed bg-light p-3">
  <div class="feed__icon">
    @if(file_exists('/assets/images/favicons/' . $feed->category()->slug . '.png'))
      <img src="/assets/images/favicons/{{ $feed->category()->slug }}.png" alt="">
    @endif
  </div>
  <a href="{{  route('feed', ['category' => $feed->category()->slug, 'slug' => $feed->slug]) }}" class="link-dark font-weight-bold">{{ $feed->title }}</a>
  <div class="small">Delivery: {{ $feed->period }}</div>
</div>
