<?php

// Everything is handled in Frontend app
Route::view('{path}', 'app')->where('path', '(.*)');

