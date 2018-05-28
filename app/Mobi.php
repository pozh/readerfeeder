<?php
/**
 * Created by PhpStorm.
 * User: Sergey
 * Date: 20.05.2018
 * Time: 8:52
 */

namespace App;


class Mobi
{
    /**
     * @var string OPF file template. Periodicals.
     * @params: title, filehash, lang, creator, publisher, subject, description, date, filename_base (no path, no extension),
     */
    public static $opf_tpl = <<<'EOT'
<?xml version="1.0" encoding="utf-8"?>
<package unique-identifier="S2R-%filehash$s" xmlns="http://www.idpf.org/2007/opf" version="2.0">
	<metadata>
		<dc-metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
			<dc:title>%title$s</dc:title>
			<dc:language>%lang$s</dc:language>
			<meta name="cover" content="" />
			<dc:creator>%creator$s</dc:creator>
			<dc:publisher>%publisher$s</dc:publisher>
			<dc:subject>%subject$s</dc:subject>
			<dc:date>%date$s</dc:date>
			<dc:description>%description$s</dc:description>
		</dc-metadata>
		<x-metadata> <output encoding="utf-8" content-type="application/x-mobipocket-subscription-magazine"></output> </x-metadata>
	</metadata>
	<manifest>
		<item id="001" href="%filename_base$s.html" media-type="application/xhtml+xml" />
		<item id="contents" href="%filename_base$s_toc.html" media-type="application/xhtml+xml" />
		<item id="nav-contents" href="%filename_base$s.ncx" media-type="application/x-dtbncx+xml" />
	</manifest>
	<spine toc="nav-contents">
		<itemref idref="contents" />
		<itemref idref="001" />
	</spine>
	<guide>
		<reference type="toc" title="Table of Contents" href="%filename_base$s_toc.html"></reference>
	</guide>
	<nav epub:type="landmarks">
		<ol>
			<li><a epub:type="toc" href="%filename_base$s_toc.html">Table of Contents</a></li>
		</ol>
	</nav>
</package>
EOT;

    /**
     * @var string OPF file template. Books.
     * @params: title, filehash, lang, creator, publisher, subject, description, date, filename_base (no path, no extension),
     */
    public static $opf_tpl_book = <<<'EOT'
<?xml version="1.0" encoding="utf-8"?>
<package unique-identifier="S2R-%filehash$s" xmlns="http://www.idpf.org/2007/opf" version="2.0" >
	<metadata>
		<dc-metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
			<dc:title>%title$s</dc:title>
			<dc:language>%lang$s</dc:language>
			<meta name="cover" content="" />
			<dc:creator>%creator$s</dc:creator>
			<dc:publisher>%publisher$s</dc:publisher>
			<dc:subject>%subject$s</dc:subject>
			<dc:date>%date$s</dc:date>
			<dc:description>%description$s</dc:description>
		</dc-metadata>
	</metadata>
	<manifest>
		<item id="Cover" media-type= "application/xhtml+xml" href="%filename_base$s_cover.html"></item>
		<item id="001" href="%filename_base$s.html" media-type="application/xhtml+xml" />
		<item id="contents" href="%filename_base$s_toc.html" media-type="application/xhtml+xml" />
		<item id="nav-contents" href="%filename_base$s.ncx" media-type="application/x-dtbncx+xml" />
	</manifest>
	<spine toc="nav-contents">
		<itemref idref="Cover" />
		<itemref idref="contents" />
		<itemref idref="001" />
	</spine>
	<guide>
		<reference type="start" title="Startup Page" href="%filename_base$s_cover.html"></reference>
		<reference type="toc" title="Table of Contents" href="%filename_base$s_toc.html"></reference>
	</guide>
</package>
EOT;

    /**
     * @var string NCX Template. Periodicals
     */
    public static $ncx_tpl = <<<'EOT'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1" xml:lang="en-US">
    <head>
        <meta name="dtb:uid" content="S2R-%filehash$s"/>
        <meta name="dtb:depth" content="2"/>
        <meta name="dtb:totalPageCount" content="0"/>
        <meta name="dtb:maxPageNumber" content="0"/>
    </head>
    <docTitle><text>%title$s</text></docTitle>
    <docAuthor><text>%author$s</text></docAuthor>
    <navMap>
        <navPoint playOrder="0" class="periodical" id="periodical">
            <navLabel>
                <text>Table of Contents</text>
            </navLabel>
            <content src="%filename_base$s_toc.html"/>
            %navpoints$s
        </navPoint>
    </navMap>
</ncx>
EOT;

    /**
     * @var string NCX Template for Books
     */
    public static $ncx_tpl_book = <<<'EOT'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd"> 
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1" xml:lang="en-US">
	<head>
		<meta name="dtb:uid" content="S2R-%filehash$s"/>
		<meta name="dtb:depth" content="1"/>
		<meta name="dtb:totalPageCount" content="0"/>
		<meta name="dtb:maxPageNumber" content="0"/>
	</head>
	<docTitle><text>%title$s</text></docTitle>
	<docAuthor><text>%author$s</text></docAuthor>
	<navMap>
		<navPoint id="coverpage" playOrder="1">
			<navLabel><text>Cover</text></navLabel>
			<content src="%filename_base$s_cover.html" />
		</navPoint>
		%navpoints$s
	</navMap>
</ncx>
EOT;

    /**
     * @var string Single navpoint (used in the NCX file).
     * @params n (order number), title, link
     */
    public static $navpoint_tpl = <<<'EOT'
<navPoint class="article" id="%id$s" playOrder="%playorder$u">
	<navLabel><text>%title$s</text></navLabel>
	<content src="%link$s" />
</navPoint>
EOT;

    /**
     * @var string Navigation section
     */
    public static $navsection_tpl = <<<'EOT'
<navPoint class="section" id="section-%id$s" playOrder="%playorder$u">
	<navLabel><text>%title$s</text></navLabel>
	<content src="%link$s"/>
	%navpoints$s
</navPoint>
EOT;

    /**
     * @var string Default Cover page.
     * @params title, date
     */
    public static $cover_tpl = <<<'EOT'
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html> 
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
	<title>%title$s</title>
</head>
<body>
	<h1 style="margin:220px 0 0 0; text-align:center;">%title$s</h1>
	<p style="text-align:center; margin:0 0 100px 0;">%date$s</p>
	<p style="text-align:center; margin:0;">ReaderFeeder</p>
	<p style="text-align:center; font-size:0.8em; page-break-after:always;">
		<a href="https://readerfeeder.com">https://readerfeeder.com</a></p>
</body>
</html>
EOT;

    /**
     * @var string Custom Cover page
     */
    public static $custom_cover_tpl = <<<'EOT'
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
	<title>{{title}}</title>
</head>
<body>
	{{body}}
</body>
</html>
EOT;

    /**
     * @var string Table of Contents template
     */
    public static $toc_html = <<<'EOT'
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <title>Table of contents</title>
</head>
<body>
    <a name="#toc"> </a>
    <h1>Contents</h1>
EOT;
}
