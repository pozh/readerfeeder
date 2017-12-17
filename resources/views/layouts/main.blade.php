<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title')</title>
    <meta name="description" content="@yield('description')">
    <link rel="icon" href="/assets/images/favicon.png">
    <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Open+Sans:300,400,700">
    <link rel="stylesheet" type="text/css" href="/assets/css/app.css">
</head>

<body id="top">

<header class="header header-shrink header-inverse fixed-top">
    <div class="container">
        <nav class="navbar navbar-expand-lg">

            <a class="navbar-brand" href="index.html">
                <span class="logo-default"><img src="assets/images/logo.png" alt=""></span>
                <span class="logo-inverse"><img src="assets/images/logo-inverse.png" alt=""></span>
            </a>

            <div class="navbar-toggler" data-toggle="collapse" data-target="#navbarNav">
                <span class="lnr lnr-text-align-right nav-hamburger"></span>
                <span class="lnr lnr-cross nav-close"></span>
            </div>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item"><a class="nav-link" href="#">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Subscriptions</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Pricing</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">FAQ</a></li>
                    <li class="nav-item">
                        <a class="nav-link btn btn-sm btn-rounded btn-primary u-w-110" href="" >Sign in</a>
                    </li>
                </ul>
            </div>

        </nav>
    </div>
</header>


<footer>
    <section class="bg-gray-v2">
        <div class="container">
        <div class="row">
            <div class="col-lg-4 mb-5 mb-lg-0">
                <img src="assets/images/logo-inverse.png" alt="">
                <p class="u-my-40">
                    Nam liber tempor cum soluta nobis eleifend they option congue is nihil
                    imper per tem por legere is  me velit doming vulputate.
                </p>
            <form class="form-inline">
                <div class="input-group box-shadow-v1 u-rounded-50 bg-white u-of-hidden">
                    <div class="input-group-addon bg-white border-0 pl-4 pr-0">
                        <span class="icon icon-Mail text-primary"></span>
                    </div>
                    <input type="text" class="form-control border-0 p-3" placeholder="Enter your email">
                    <button type="submit" class="input-group-btn btn bg-white">
                        <span class="icon icon-Arrow text-primary"></span>
                    </button>
                </div>
            </form>

            </div>
            <div class="col-lg-2 col-md-6 ml-auto mb-5 mb-lg-0">
                <h4>Useful Links</h4>
                <div class="u-h-4 u-w-50 bg-primary rounded mt-3 u-mb-40"></div>
                <ul class="list-unstyled u-lh-2">
                    <li><a href="">About Us </a> </li>
                    <li><a href="">Testimonials </a> </li>
                    <li><a href="">Pricing </a> </li>
                    <li><a href="">Contact Us</a></li>
                    <li><a href="">News </a> </li>
                </ul>
            </div>
            <div class="col-lg-3 col-md-6 ml-auto mb-5 mb-lg-0">
                <h4>Contact Info</h4>
                <div class="u-h-4 u-w-50 bg-primary rounded mt-3 u-mb-40"></div>
                <ul class="list-unstyled">
                    <li class="mb-2">
                        <span class="icon icon-Phone2 text-primary mr-2"></span> 008. 567. 890. 634
                    </li>
                    <li class="mb-2">
                        <span class="icon icon-Mail text-primary mr-2"></span> <a href="mailto:support@echotheme.com">support@echotheme.com</a>
                    </li>
                    <li class="mb-2">
                        <span class="icon icon-Pointer text-primary mr-2"></span> Melbourne, Australia
                    </li>
                </ul>
                <ul class="list-inline social social-rounded social-white mt-4">
                    <li class="list-inline-item">
                        <a href=""><i class="a fa-facebook"></i></a>
                    </li>
                    <li class="list-inline-item">
                        <a href=""><i class="fa fa-twitter"></i></a>
                    </li>
                    <li class="list-inline-item">
                        <a href=""><i class="fa fa-google-plus"></i></a>
                    </li>
                    <li class="list-inline-item">
                        <a href=""><i class="fa fa-linkedin"></i></a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    </section>

    <section class="u-py-40">
        <div class="container">
            <p class="mb-0 text-center">
                &copy; Copyright {{ date('Y') }} ReaderFeeder.co | A project of <a class="text-primary" href="https://pozhilov.com" target="_blank">Sergey Pozhilov</a>
            </p>
        </div>
    </section>
</footer>


</body>
</html>
