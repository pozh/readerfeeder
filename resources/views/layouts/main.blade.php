<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title')</title>
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
<nav class="navbar navbar-expand-lg navbar-light bg-white">
  <div class="container">
    <a class="navbar-brand" href="/"><img src="/assets/images/logo.png"></a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span
        class="navbar-toggler-icon"></span></button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav ml-auto">
        <li class="nav-item"><a class="nav-link" href="#features">Features</a></li>
        <li class="nav-item"><a class="nav-link" href="#pricing">Pricing</a></li>
        <li class="nav-item"><a class="btn navbar__btn btn-outline-secondary" href="/app">Sign In</a></li>
      </ul>
    </div>
  </div>
</nav>

@yield('content')

<div class="footer">
    <div class="container text-center">
        <p class="text-muted small">&copy; 2018. ReaderFeeder.co. All rights reserved.</p>
        <p class="text-center small">
            <a href="/terms/">Terms of service</a>
            &nbsp;&middot;&nbsp;
            <a href="/privacy/">Privacy Policy</a>
        </p>
    </div>
</div>

</body>
</html>
