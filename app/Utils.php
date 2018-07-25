<?php
namespace App;


class Utils
{
    /**
     * @var array User Agents
     */
    const USER_AGENTS = [
        'User-Agent: Mozilla/5.0 (Windows NT 6.1) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.46 Safari/535.11',
        'User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:7.0.1) Gecko/20100101 Firefox/7.0.1',
        'User-Agent: Mozilla/5.0 (Linux; U; Android 2.3.3; en-au; GT-I9100 Build/GINGERBREAD) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1',
        'User-Agent: Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; InfoPath.2; .NET CLR 2.0.50727; .NET CLR 3.0.04506.648; .NET CLR 3.5.21022; .NET CLR 1.1.4322)',
        'User-Agent: Mozilla/5.0 (Windows NT 6.1; rv:5.0) Gecko/20100101 Firefox/5.0',
        'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_2) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/14.0.835.202 Safari/535.1',
        'User-Agent: Mozilla/5.0 (BlackBerry; U; BlackBerry 9800; en) AppleWebKit/534.1+ (KHTML, like Gecko) Version/6.0.0.337 Mobile Safari/534.1+',
        'User-Agent: Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)',
        'User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:7.0.1) Gecko/20100101 Firefox/7.0.1',
        'User-Agent: Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.34 (KHTML, like Gecko) rekonq Safari/534.34',
        'User-Agent: Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; GTB6; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; OfficeLiveConnector.1.4; OfficeLivePatch.1.3)',
        'User-Agent: IE 7 ? Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.04506.30)',
        'User-Agent: Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.2.23) Gecko/20110920 Firefox/3.6.23 SearchToolbar/1.2'
    ];

    public static function makeFilename($str)
    {
        $str = strtolower(trim($str));  // lowercase
        $str = strip_tags($str);        // no html tags
        $str = mb_substr($str, 0, 255); // cut
        $str = stripslashes($str);      // un-quote

        //delete and replace special chars
        $find = array(' ', '&', '\r\n', '\n', '+', ',');
        $str = str_replace($find, '-', $str);
        $find = array('/[^a-z0-9\-<>]/', '/[\-]+/', '/<[^>]*>/');
        $repl = array('', '-', '');
        $str = preg_replace($find, $repl, $str);

        return $str;
    }

    /**
     * version of sprintf for cases where named arguments are desired (php syntax)
     * with sprintf: sprintf('second: %2$s ; first: %1$s', '1st', '2nd');
     *
     * with sprintfn: sprintfn('second: %second$s ; first: %first$s', array(
     *  'first' => '1st',
     *  'second'=> '2nd'
     * ));
     *
     * @param string $format sprintf format string, with any number of named arguments
     * @param array $args array of [ 'arg_name' => 'arg value', ... ] replacements to be made
     * @return string|false result of sprintf call, or bool false on error
     */
    public static function sprintfn($format, array $args = array())
    {
        // map of argument names to their corresponding sprintf numeric argument value
        $arg_nums = array_slice(array_flip(array_keys(array(0 => 0) + $args)), 1);

        // find the next named argument. each search starts at the end of the previous replacement.
        for ($pos = 0; preg_match('/(?<=%)([a-zA-Z_]\w*)(?=\$)/', $format, $match, PREG_OFFSET_CAPTURE, $pos);) {
            $arg_pos = $match[0][1];
            $arg_len = strlen($match[0][0]);
            $arg_key = $match[1][0];

            // programmer did not supply a value for the named argument found in the format string
            if (!array_key_exists($arg_key, $arg_nums)) {
                //user_error("sprintfn(): Missing argument '${arg_key}'", E_USER_WARNING);
                return false;
            }

            // replace the named argument with the corresponding numeric one
            $format = substr_replace($format, $replace = $arg_nums[$arg_key], $arg_pos, $arg_len);
            $pos = $arg_pos + strlen($replace); // skip to end of replacement for next iteration
        }
        return vsprintf($format, array_values($args));
    }

    /**
     * Find HTML encoding
     * @param $html string HTML <body>
     * @return string the encoding
     */
    public static function getEncoding($html)
    {
        if (!$html) return false;
        $head = substr($html, 0, 1000);

        // try to read from the charset meta first
        $matches = array();
        if (preg_match('/charset *= *[\'\"]?([a-zA-Z0-9_\-]+)/', $head, $matches)) {
            return $matches[1];
        }

        // if charset meta was not found, try to find encoding via hack.
        $cp_list = mb_list_encodings();
        array_shift($cp_list); //remove 'pass' because everything worked without these 2 encodings in the list
        array_shift($cp_list); //remove 'auto' -/-/-/-/-/-/-
        array_unshift($cp_list, 'utf-8', 'windows-1251');
        $strStart = strpos($html, 'body');
        if (!$strStart) $strStart = 0;
        $str = substr($html, $strStart, 1000);

        foreach ($cp_list as $k => $codepage) {
            if (md5($str) == md5(iconv($codepage, $codepage, $str))) {
                return $codepage;
            }
        }
        return 'utf-8'; // By default let's assume it's UTF8
    }

    /**
     * Grabs page content using cUrl
     * @param  string $url URL of the page to grab content from
     * @param  boolean $headerOnly SET TRUE if we want to get header only. Default: FALSE
     * @return string the text grabbed, or FALSE on fail
     */
    public static function curlGetData($url, $headerOnly = false)
    {
        $ch = curl_init();

        if (!$ch) return false;

        $timeout = 20;
        $date = date('Y-m-d');
        curl_setopt($ch, CURLOPT_URL, $url);
        if ($headerOnly) {
            curl_setopt($ch, CURLOPT_HEADER, true); // was sometime ago commented, to get rid of header, the problem was described at http://stackoverflow.com/questions/1378915/header-only-retreival-in-php-via-curl
            curl_setopt($ch, CURLOPT_NOBODY, true);
        }

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_ENCODING, 'gzip,deflate');

        // Wikipedia requires honest user agent information!
        if (strpos($url, 'wikipedia.') !== false)
            curl_setopt($ch, CURLOPT_USERAGENT, 'User-Agent: ReaderFeeder (+https://readerfeeder.com/)');
        else
            curl_setopt($ch, CURLOPT_USERAGENT, self::USER_AGENTS[rand(0, 12)]);

        curl_setopt($ch, CURLOPT_COOKIEJAR, env('COOKIES_PATH') . "/cookie-$date.txt");
        curl_setopt($ch, CURLOPT_COOKIEFILE, env('COOKIES_PATH') . "/cookie-$date.txt");
        $data = curl_exec($ch);
        curl_close($ch);
        return $data;
    }
}
