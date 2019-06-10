<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title') - ReaderFeeder</title>
    <meta name="description" content="">
    <meta property="og:title" content="" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="" />
    <meta property="og:image" content="" />
    <meta property="og:description" content="" />
    <link rel="icon" href="/assets/images/favicon.png" type="image/png">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Gentium+Basic:700|Open+Sans:400,600,700">
    <link rel="stylesheet" href="/assets/styles/site.css">
</head>
<body>
@include('shared.navbar')

<div class="page-title">
  <div class="container">
    <h1 class="text-center mt-6 text-serif">@yield('page-title')</h1>
  </div>
</div>

@yield('content')

@include('shared.footer')

</body>
</html>
