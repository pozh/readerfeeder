<?php

namespace App;

/**
 * SDocument
 * Grab text from the given URL and convert it to .mobi format
 */
class SDocument
{
    public $url = null;
    public $debug = false;
    public $keep_images = true;
    public $send_as_book = true;
    public $author = 'ReaderFeeder';
    public $title = 'Untitled';

    private $html = null;
    private $footer_html = null;
    private $site_url = null;
    private $folder_url = null;
    private $encoding = null;
    private $path = null;
    private $temp_files = null;
    private $filename_base = null;
    private $site_has_rss = false;
    private $user_id = 0;
    private $type = null;
    private $language = 'en-us';
    private $navpoints = array();
    private $links_map = array();
    private $toc_html = '';
    private $time = null;
    private $section_data = null;
    private $ncx_navpoints = '';
    private $navpoint_id = 1;      // incremental. +1 on each new item in the result doc
    private $play_order = 1;       // same to navpoint_id, but each section increments the value as well.
    private $cover = null;


    /**
     * Constructor
     * @param number $user_id User ID
     * @param string $type single | periodical
     */
    public function __construct($user_id, $type = 'single')
    {
        $this->user_id = $user_id;
        $this->type = $type;

        // create user personal folder if not exists
        $this->path = env('DATA_PATH') . '/' . $user_id;
        if (!is_dir($this->path)) {
            mkdir($this->path, env('DATA_ATTR'));
        }

        // create folder for documents HTML files
        if (!is_dir($this->path . '/html')) {
            mkdir($this->path . '/html', env('DATA_ATTR'));
        }

        // periodical: add TOC
        if ($type == 'periodical') {
            $this->toc_html = Mobi::$toc_html;
        }
    }

    /**
     * Set document author
     * @param string $author Author
     */
    public function setAuthor($author)
    {
        $this->author = mb_substr(strip_tags($author), 0, 100);
    }


    /**
     * Set document title. Automatically sets the filename_base
     * @param string $title Title associated with HTML
     * @param string $title_suffix Title Suffix
     */
    public function setTitle($title, $title_suffix = '')
    {
        $this->title = stripslashes(mb_substr(strip_tags($title), 0, 255)) . $title_suffix;
        $this->filename_base = Utils::makeFilename($title . $title_suffix);
        if (file_exists($this->path . '/' . $this->filename_base . '.mobi')) {
            $n = 1;
            do {
                $n++;
            } while (file_exists($this->path . '/' . $this->filename_base . $n . '.mobi'));
            $this->filename_base .= $n;
        }
    }

    public function getFilenameBase()
    {
        return $this->filename_base;
    }

    public function siteHasRss()
    {
        return $this->site_has_rss;
    }

    /**
     * Set document language (for sets, not a single doc)
     * @param string $language The language (en-us by default)
     */
    public function setLanguage($language)
    {
        $this->language = $language;
    }

    /**
     * Set source url
     * @param string $url URL associated with HTML
     * @return boolean TRUE on success, otherwise FALSE
     */
    public function setUrl($url)
    {
        $url = trim($url);
        $url = get_magic_quotes_gpc() ? stripslashes($url) : $url;
        \Log::info('URL: ' . $url . ' for user ' . $this->user_id);
        $this->url = $url;

        // Trick for NY Times and few others
        if (stripos($this->url, '.nytimes.com') !== FALSE) {
            if (stripos($this->url, 'www.nytimes.com') !== FALSE) {
                $this->url = str_replace('www.nytimes.', 'mobile.nytimes.', $this->url);
            }
            if (!stripos($this->url, 'pagewanted=all')) {
                $this->url = strpos($this->url, '?') ? $this->url . '&pagewanted=all' : $this->url . '?pagewanted=all';
            }
        } elseif ((stripos($url, 'newyorker.com') !== FALSE) && (strpos($url, '?') === FALSE))
            $this->url = $url . '?currentPage=all';
        elseif ((stripos($url, 'cicero.de') !== FALSE) && (strpos($url, '?') == FALSE))
            $this->url = $url . '?print';
        elseif ((stripos($url, 'news.investors.com/article') !== FALSE) && (strpos($url, '?') == FALSE))
            $this->url = $url . '?p=full';
        elseif ((stripos($url, 'gamasutra') !== FALSE)) {
            if (strpos($url, '?') == FALSE)
                $this->url = $url . '?print=1';
            else
                $this->url = $url . '&print=1';
        } else
            $this->url = $url;

        // get rid of #xxx in the end of the url
        $hashPos = strpos($this->url, '#');
        if ($hashPos !== FALSE) {
            $this->url = substr($this->url, 0, $hashPos);
        }

        $matches = array();
        if (!preg_match('/https?:\/\/(www.)?([^\/]+)/', $url, $matches)) {
            \Log::error('Wrong url: ' . $url);
            return false;
        }
        $this->site_url = $matches[0];    // without last /
        $this->author = $matches[2];
        $this->folder_url = substr($url, 0, strrpos($url, '/'));    // without last /
        return true;
    }

    /**
     * Set time to use it in the document's cover page, maybe somewhere else.
     * @param int $time New time
     */
    function setTime($time)
    {
        $this->time = $time;
    }

    /**
     * Grab html content from the remote host and process it by PHP Readability
     * @param boolean $use_readability true to process the html by Readability
     * @param int $flags Readability flags, 7 by default
     * @return boolean True if the text is successfully obtained and processed
     */
    function grabHtml($use_readability = true, $flags = 7)
    {
        $html = false;

        // sites where we should not use readability since it's useless there.
        $sites = ['samlib.ru', 'stackoverflow.com'];
        foreach ($sites as $site) {
            $use_readability &= (stripos($this->url, $site) === FALSE);
        }

        // Site-specific flags
        if (stripos($this->url, 'adme.ru') !== false) {
            $flags = 2;
        }

        // grab anything except gizmodo and few others using curl
        $exceptions = array('gizmodo', 'lifehacker');
        $useCurl = true;
        foreach ($exceptions as $exception) {
            if (strpos($this->url, $exception) > 0) $useCurl = false;
        }
        if ($useCurl) $html = Utils::curlGetData($this->url);

        if ($html === false) {
            \Log::error('* No sucess with CURL @ ' . $this->url);
            $opts = array(
                'http' => array(
                    'method' => "GET",
                    'header' => Utils::USER_AGENTS[rand(0, 12)]));
            $context = stream_context_create($opts);
            $html = @file_get_contents($this->url, NULL, $context);
        }

        if (!$html) {
            ini_set("user_agent", "Mozilla/3.0\r\nAccept: */*\r\nX-Padding: Foo");
            $html = @file_get_contents($this->url);
            if (!$html) {
                \Log::error("Can' get file contents, gave up");
                return false;
            }
        }

        $this->encoding = Utils::getEncoding($html);

        if (strtolower($this->encoding) != 'utf-8') {
            // if iconv failes, use the unconverted html code.
            $temp_str = @iconv($this->encoding, 'utf-8', $html);
            if ($temp_str != false) {
                $html = $temp_str;
                if (function_exists('tidy_parse_string')) {
                    $tidy = tidy_parse_string($html, array('indent' => true), 'UTF8');
                    $tidy->cleanRepair();
                    $html = $tidy->value;
                }
            }
        }

        // find out whether or not there is an rss feed on the site
        if (stripos($html, 'rss') !== false)
            $this->site_has_rss = true;

        // Remove (i.e. ruin) javascript calls
        $html = str_replace('javascript:', '', $html);

        // Remove various stuff Kindlegen does not like
        $html = str_replace(['&shy;', chr(13), '<img />', '<img/>', '<img>'], ' ', $html);

        // Remove images from html if we don't need'em
        if (!$this->keep_images) {
            $html = preg_replace('/< *img +[^>]*>/', ' ', $html);
        } else {
            // Keep images, but ovework the troubles Kindlegen has with img tags not containing "src" param.
            $html = preg_replace('/< *img +([^>]*)>/', '<img $1 src="" />', $html);
            $html = preg_replace('/< *img +.*data-src[^>]*>/', ' ', $html);
        }

        if ($use_readability) {
            $readability = new Readability($html, $this->url);
            $readability->debug = $this->debug;
            $readability->setFlags($flags);
            $result = $readability->init();

            // does it look like we found what we wanted?
            $readabilityLength = $readability->getContentLength();
            if ($readabilityLength > 0)
                $content_proportion = strlen($html) / $readabilityLength;
            else
                $content_proportion = 10000;
            \Log::info('LENGTH', ['$readabilityLength' => $readabilityLength, 'html-length' => strlen($html)]);
            \Log::info('Content proportion: ' . $content_proportion);
            if (!$result || ($content_proportion > 700)) {
                \Log::error('Readability returned empty result',
                    ['result' => $result, 'content proportion' => $content_proportion]);
                return false;
            }
            $html = $readability->getContent()->innerHTML;
            $this->setTitle(stripslashes($readability->getTitle()->innerHTML));
        }

        $html = str_replace(chr(10), ' ', $html);
        $this->setHtml($html);
        return true;
    }

    /**
     * Return the HTML code
     */
    function getHtml()
    {
        return $this->html;
    }

    /**
     * Set html content for the document
     * @param string $html HTML source code for the doc
     */
    public function setHtml($html)
    {
        $this->html = $html;//stripslashes( $html );
    }

    /**
     * Prepare document for conversion
     * The result of this function is HTML temp file along with all necessary images.
     * @param $stripTables bool Set TRUE to replace all tables by divs. To prenent content from hidding
     * @param $stripHead bool
     * @param bool $remap_links if True, modify all lins in the doc's html to make them internal.
     *                          For composed documents and maybe periodicals
     * @return TRUE on success, otherwise FALSE
     */
    function writeTempHtml($stripTables = true, $stripHead = true, $remap_links = false)
    {

        $mimeExtensions = array('image/gif' => 'gif', 'image/jpeg' => 'jpg', 'image/png' => 'png', 'image/bmp' => 'bmp');

        $temp_filename = "$this->path/$this->filename_base.html";
        \Log::info('html temp file: ' . $temp_filename);
        $this->temp_files = array($temp_filename);    // remember, we'll need to delete temp files (but don't delete .mobi files)

        $this->prepareHtml($stripTables, $stripHead, $remap_links);

        // all operations - on a temp copy of html
        $html = $this->html;

        // find all images to download them to the local temp folder
        // All images in the html will be replaced by the local copies
        $images = array();
        preg_match_all("/< *img [^>]+>/", $html, $images, PREG_PATTERN_ORDER);
        if (is_array($images[0]) && (count($images[0]) > 0)) {
            foreach ($images[0] as $img_number => $img) {
                $src = array();
                if (preg_match('/ src *= *["\']([^"\']+)["\']/', $img, $src)) {    // returns an array containing 2 elements - full entry and the src from ()
                    $image_url = $src[1];
                    $image_url = str_replace(' ', '%20', $image_url);
                    $rand_str = base_convert(rand(10e7, 10e10), 10, 36);
                    $temp_img_name = time() . $rand_str;
                    //$temp_img_name = sanitize_file_name( $rand_str . substr($src[1], strrpos($src[1], '/')+1) );
                    //$temp_img_name = str_replace( array('|',';',',','!','@','#','$','(',')','<','>','%','/','\\','"','\'','`','~','{','}','[',']','=','+','&','^','‘','’', '?'), '', $temp_img_name );

                    // get extension
                    if (stripos($image_url, '.jpg') > 0) $temp_img_name .= '.jpg';
                    elseif (stripos($image_url, '.jpeg') > 0) $temp_img_name .= '.jpeg';
                    elseif (stripos($image_url, '.gif') > 0) $temp_img_name .= '.gif';
                    elseif (stripos($image_url, '.png') > 0) $temp_img_name .= '.png';
                    elseif (stripos($image_url, '.svg') > 0) $temp_img_name .= '.svg';
                    else {
                        // There is no extension in the image filename i.e. it's php/asp/other script-based.
                        // So we have to use alternate way to find out what kind of image we have here.
                        $imgSize = @getimagesize($image_url);
                        if (is_array($imgSize)) {
                            $temp_img_name .= '.' . $mimeExtensions[$imgSize['mime']];
                        } else {
                            $temp_img_name = '';
                        }
                    }

                    // now download the image to my server.
                    if (strlen($temp_img_name) > 0) {
                        if (@copy($image_url, $this->path . '/' . $temp_img_name))
                            $this->temp_files[] = $this->path . '/' . $temp_img_name;
                        else
                            \Log::error('img copy command failed. from: ' . $image_url . ' to: ' . $this->path . '/' . $temp_img_name);
                        $html = str_replace($src[1], $temp_img_name, $html);
                    }
                }
            }
        } //is_array($images...

        // Finally write everything to file
        $file = fopen($temp_filename, "wb");
        if (!$file) {
            \Log::error('fopen for the file ' . $temp_filename . ' failed');
            return false;
        }

        // fwrite( $file, "\xEF\xBB\xBF" );
        fwrite($file, <<<EOT
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"><html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <title>' . $this->title . '</title>
    <meta name="author" content="' . $this->author . '" />
    <style type="text/css">
        .aligncenter { text-align: center; }
        img.aligncenter { display:block; margin-left:auto; margin-right:auto; }
        img.alignleft{ float:left; margin:5px 15px 0 0; }
        img.alignright{ float:right; margin:5px 0 0 15px; }
    </style>
</head>
<body>
EOT
        );
        fwrite($file, $html);
        if ($this->footer_html) {
            fwrite($file, $this->footer_html);
        }
        fclose($file);
        return true;
    }

    /**
     * Prepare document for conversion
     * The result of this function is "ideal" HTML
     * @param $stripTables bool TRUE to replace all tables by divs. To prenent content from hidding
     * @param $stripHead bool
     * @param $remap_links bool If True, modify all links in the doc's html to make them internal.
     *                          For composed documents and maybe periodicals
     */
    function prepareHtml($stripTables = true, $stripHead = true, $remap_links = false)
    {
        \Log::info('Prepare HTML');

        // take care about interlinking between sections
        if ($remap_links && count($this->links_map) > 0) {
            foreach ($this->links_map as $map_to => $map_from) {
                if (!empty($map_from)) {
                    \Log::info('LINK MAP: from ' . $map_from . ' to ' . $map_to);
                    $this->html = str_replace($map_from, $map_to, $this->html);
                }
            }
            \Log::info('LINK MAPPING: DONE');
        }

        // Get rid of double # in links (those containing to internal can contain # too)
        $this->html = preg_replace('/href[\s]*=[\s]*"(#[^"]+)#.*?"/i', 'href="$1"', $this->html);

        // make sure all images have full filenames (i.e. contain http://)
        $images = [];
        $new_images = [];
        preg_match_all("/< *img [^>]+>/", $this->html, $images, PREG_PATTERN_ORDER);
        $images = $images[0];

        if (is_array($images) && (count($images) > 0)) {
            foreach ($images as $img_number => $img) {
                $src = array();
                if (preg_match('/ (src|original) *= *["\']([^"\']+)["\']/', $img, $src))    // returns an array containing 2 elements - full entry and the src from ()
                {
                    $image_url = $src[2];
                    if (!preg_match('/https?:\/\/[^\/]+/', $image_url)) {
                        if ($image_url[0] == '/') {
                            if ($image_url[1] == '/')  // on wikipedia image URLs start with '//upload.wikimedia.org...' so we just need to add http:
                                $image_url = 'http:' . $image_url;
                            else
                                $image_url = $this->site_url . $image_url;
                        } else {
                            $image_url = $this->folder_url . '/' . $image_url;
                        }
                    }
                    // add the correct <img ... /> to the special array, we'll move it from there to html in a separate loop
                    $new_images[$img_number] = str_replace($src[0], ' src="' . $image_url . '" ', $images[$img_number]);
                }
            }

            // now move all correct <img ... /> from $new_images to $this->html
            foreach ($images as $img_number => $img) {
                if (array_key_exists($img_number, $new_images))
                    $this->html = str_replace($img, $new_images[$img_number], $this->html);
            }
        } //is_array($images...

        // Take care about tables
        if ($stripTables) {
            $this->html = preg_replace('/< *\/?[tT][aA][bB][lL][eE][^>]*>/', '', $this->html);
            $this->html = preg_replace('/< *[tT][dDrRhH][^>]*>/', '<div>', $this->html);
            $this->html = preg_replace('/< *\/[tT][dDrRhH][^>]*>/', '</div>', $this->html);
        }

        if ($stripHead) {
            // Take care about <body>, <head> and <html> tags (remove'em)
            if (preg_match('/< *\/[hH][eE][aA][dD][^>]*>/', $this->html, $head_matches, PREG_OFFSET_CAPTURE) > 0) {
                $this->html = mb_substr($this->html, $head_matches[0][1]);    // remove everything before /head
                $this->html = '<div>' . PHP_EOL . preg_replace('/< *\/[hH][eE][aA][dD][^>]*>/', '', $this->html); // remove /head
            }
            $this->html = preg_replace('/< *\/[bB][oO][dD][yY][^>]*>/', '', $this->html);
            $this->html = preg_replace('/< *[bB][oO][dD][yY][^>]*>/', '', $this->html);
            $this->html = preg_replace('/< *\/[hH][tT][mM][lL][^>]*>/', '', $this->html);
            $this->html = preg_replace('/< *[hH][tT][mM][lL][^>]*>/', '', $this->html);
        }
    }

    /**
     * Add html content to the end of the doc in "set" mode (Periodicals, etc.)
     * And add nav point to the table of contents at the same time.
     * @param string $title Entry title
     * @param string $html Entry HTML code
     * @param string $source_url Source URL address
     * @param boolean $publish_source true if source url must be published in the doc
     */
    function addEntry($title, $html = '', $source_url = '', $publish_source = true)
    {
        $navpoint_link = $this->filename_base . '.html#navpoint' . $this->navpoint_id;

        // If nothing except title is specified,
        // this is a channel title. So, add a section to the toc
        if (($html == '') && ($source_url == '')) {

            // if another section was started previously, finalize it first and move its content to appropriate placeholders
            if ($this->section_data != null)
                $this->finalizeTOCSection();

            // now start a new section, i.e. fill in the $section_data by new values.
            $this->section_data = array(
                'id' => $this->navpoint_id,
                'playorder' => $this->play_order,
                'title' => $title,
                'link' => $navpoint_link,
                'navpoints' => array());
            $this->play_order += 1;
            return;
        } else {
            // new navpoint to the current section (it must be created by now!)
            $navpoint = array(
                'id' => $this->navpoint_id,
                'playorder' => $this->play_order,
                'title' => $title,
                'link' => $navpoint_link
            );
            $this->section_data['navpoints'][] = $navpoint;
            $this->links_map['#navpoint' . $this->navpoint_id] = $source_url;

            // add new html content to the doc. And the link to the source
            $this->addHtml(sprintf(PHP_EOL . '<a name="#navpoint%u"> </a> <h3>%s</h3>' . PHP_EOL, $this->navpoint_id, strip_tags($title)));
            $this->addHtml($html);
            if ($publish_source && $source_url != '')
                $this->addHtml('<br /><p style="text-align:right;"><a href="' . $source_url . '">' . $source_url . '</a></p>');

            // we've just added a new item to the list, so increment the ID... playorder too of course
            $this->navpoint_id += 1;
            $this->play_order += 1;
        }
    }

    /**
     * finalize, i.e. move section items into section (into the table of content and into html)
     * add new items to to opf: items & spineitems
     */
    function finalizeTOCSection()
    {
        $navpoints = '';
        $toc_items = '';
        if (!empty($this->section_data['navpoints'])) {
            foreach ($this->section_data['navpoints'] as $navpoint) {
                // !navpoints for NCX
                $navpoints .= Utils::sprintfn(PHP_EOL . Mobi::$navpoint_tpl, array(
                    'id' => str_pad((int)$navpoint['id'], 3, "0", STR_PAD_LEFT),
                    'playorder' => $navpoint['playorder'],
                    'title' => $navpoint['title'],
                    'link' => $navpoint['link']));
                $toc_items .= sprintf('<li><a href="%s">%s</a></li>' . PHP_EOL, $navpoint['link'], $navpoint['title']);
            }
        }

        // add section to ncx
        $this->ncx_navpoints .= Utils::sprintfn(Mobi::$navsection_tpl, array(
            'id' => str_pad($this->section_data['id'], 3, "0", STR_PAD_LEFT),
            'playorder' => $this->section_data['playorder'],
            'title' => $this->section_data['title'],
            'link' => $this->section_data['link'],
            'navpoints' => $navpoints));

        // Add new entry to the TOC (the file filename_toc.html will be created somewhere else)
        $this->toc_html .= sprintf('<h4>%s</h4> <ul>%s</ul>', $this->section_data['title'], $toc_items);
    }

    /**
     * Add html content in the end of existing code
     * @param string $html HTML code to add
     */
    function addHtml($html)
    {
        $this->html .= stripslashes($html);
    }

    /**
     * Write footer and close the body and html tags.
     * @param $footer_html - HTML code to put in the footer; use {source} to insert link to the source
     */
    function addFooter($footer_html = '', $add_source = false)
    {
        if (strpos($footer_html, '{source}') > 0 && !empty($this->url)) {
            $footer_html = str_replace('{source}',
                '<a href="' . $this->url . '">' . $this->url . '</a>', $footer_html);
        }
        $this->footer_html .= '</body></html>';
    }

    /**
     * Convert html file to MOBI using Kindlegen
     * @return String containing the filename (incl. path) of the mobi file or False
     */
    function saveMobi()
    {
        // prepare the OPF/NCX files first
        // finalize the last section added. I'm sure, there was at least one section.
        $this->finalizeTOCSection();

        $time = ($this->time == null) ? time() : $this->time;
        $date_str = date('l, F j, Y', $time);
        $file_hash = 'ReaderFeeder' . base_convert(rand(10e7, 10e10), 10, 36);

        $opf_tpl = ($this->send_as_book) ? Mobi::$opf_tpl_book : Mobi::$opf_tpl;

        $the_title = $this->title;
        $opf_text = Utils::sprintfn($opf_tpl, array(
            'title' => $the_title,
            'filehash' => $file_hash,
            'lang' => $this->language,
            'creator' => ($this->send_as_book) ? 'ReaderFeeder' : $the_title,
            'publisher' => ($this->send_as_book) ? 'ReaderFeeder.com' : $the_title,
            'subject' => 'ReaderFeeder',
            'description' => '',
            'date' => $date_str,
            'filename_base' => $this->filename_base
        ));
        $opf_filename = $this->path . '/' . $this->filename_base . '.opf';
        $opf_file = fopen($opf_filename, 'w');
        if (!$opf_file) {
            \Log::error("Can't open OPF file for writing: " . $opf_filename);
            return false;
        }
        if (!fwrite($opf_file, $opf_text)) {
            \Log::error("Can't write OPF file: " . $opf_filename);
            return false;
        }
        fclose($opf_file);

        // Cover file
        if (!$this->cover) $this->cover = Utils::sprintfn(Mobi::$cover_tpl, array(
            'title' => $this->title,
            'date' => $date_str));
        $cover_file = fopen($this->path . '/' . $this->filename_base . '_cover.html', 'w');
        if (!$cover_file) {
            \Log::error("Can't write Cover file: " . $this->path . '/' . $this->filename_base . '_cover.html');
            return false;
        }
        fwrite($cover_file, $this->cover);
        fclose($cover_file);

        // NCX file
        $ncx_tpl = ($this->send_as_book) ? Mobi::$ncx_tpl_book : Mobi::$ncx_tpl;
        $ncx_text = Utils::sprintfn($ncx_tpl, array(
                'filehash' => $file_hash,
                'title' => $the_title,
                'author' => 'ReaderFeeder',
                'filename_base' => $this->filename_base,
                'navpoints' => $this->ncx_navpoints)
        );
        $ncx_file = fopen($this->path . '/' . $this->filename_base . '.ncx', 'w');
        if (!$ncx_file) {
            \Log::error("Can't write NCX file: " . $this->path . '/' . $this->filename_base . '.ncx');
            return false;
        }
        fwrite($ncx_file, $ncx_text);
        fclose($ncx_file);

        // And finally, TOC html file. Finalize its html code first.
        $this->toc_html .= '<div style="page-break-after:always"></div> </body></html>';
        $toc_file = fopen($this->path . '/' . $this->filename_base . '_toc.html', 'w');
        if (!$toc_file) {
            \Log::error("Can't write TOC file: " . $this->path . '/' . $this->filename_base . '_toc.html');
            return false;
        }
        fwrite($toc_file, $this->toc_html);
        fclose($toc_file);
        exec('../kindlegen ' . $opf_filename, $res); // 0's element contans HTML filename

        // Some reporting about the Kindlegen result
        $res_str = implode(PHP_EOL, $res);
        \Log::info($res_str);

        // Check for Kindlegen errors
        if (strpos($res_str, 'rror(prcgen') != false || strpos($res_str, 'rror: ') != false) {
            \Log::error($res_str);
            return false;
        } else return str_replace('.html', '.mobi', $this->temp_files[0]);
    }

    /**
     * Delete temporary images and html file
     */
    function deleteTempFiles()
    {
        // if we've sent a periodical, delete cover, TOC, OPF and NCX files
        @unlink($this->path . '/' . $this->filename_base . '.opf');
        @unlink($this->path . '/' . $this->filename_base . '.ncx');
        @unlink($this->path . '/' . $this->filename_base . '_toc.html');
        @unlink($this->path . '/' . $this->filename_base . '_cover.html');

        foreach ($this->temp_files as $delete_it) {
            @unlink($delete_it);
        }
    }
}
