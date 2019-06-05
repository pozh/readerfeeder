<!DOCTYPE html>
<html>
<head>
    <title>Feed</title>
</head>
<body>
<div class="header">
    <h1><a href="{{ $permalink }}">{{ $title }}</a></h1>
</div>
    @foreach ($items as $item)
    <div class="item">
        <h2><a href="{{ $item->get_permalink() }}">{{ $item->get_title() }}</a></h2>
        <p>{{ $item->get_description() }}</p>
        <p><small>Posted on {{ $item->get_date('j F Y | g:i a') }}</small></p>
    </div>
    @endforeach
</body>
</html>
