<?php
namespace App;
use Illuminate\Support\Facades\Log;

/**
 * Arc90's Readability ported to PHP for FiveFilters.org
 * Based on readability.js version 1.7.1 (without multi-page support)
 * ------------------------------------------------------
 * Original URL: http://lab.arc90.com/experiments/readability/js/readability.js
 * Arc90's project URL: http://lab.arc90.com/experiments/readability/
 * JS Source: http://code.google.com/p/arc90labs-readability
 * Ported by: Keyvan Minoukadeh, http://www.keyvan.net
 * More information: http://fivefilters.org/content-only/
 * License: Apache License, Version 2.0
 * Requires: PHP5
 * Date: 2011-07-22
 *
 * Differences between the PHP port and the original
 * ------------------------------------------------------
 * Arc90's Readability is designed to run in the browser. It works on the DOM
 * tree (the parsed HTML) after the page's CSS styles have been applied and
 * Javascript code executed. This PHP port does not run inside a browser.
 * We use PHP's ability to parse HTML to build our DOM tree, but we cannot
 * rely on CSS or Javascript support. As such, the results will not always
 * match Arc90's Readability. (For example, if a web page contains CSS style
 * rules or Javascript code which hide certain HTML elements from display,
 * Arc90's Readability will dismiss those from consideration but our PHP port,
 * unable to understand CSS or Javascript, will not know any better.)
 *
 * Another significant difference is that the aim of Arc90's Readability is
 * to re-present the main content block of a given web page so users can
 * read it more easily in their browsers. Correct identification, clean up,
 * and separation of the content block is only a part of this process.
 * This PHP port is only concerned with this part, it does not include code
 * that relates to presentation in the browser - Arc90 already do
 * that extremely well, and for PDF output there's FiveFilters.org's
 * PDF Newspaper: http://fivefilters.org/pdf-newspaper/.
 *
 * Finally, this class contains methods that might be useful for developers
 * working on HTML document fragments. So without deviating too much from
 * the original code (which I don't want to do because it makes debugging
 * and updating more difficult), I've tried to make it a little more
 * developer friendly. You should be able to use the methods here on
 * existing DOMElement objects without passing an entire HTML document to
 * be parsed.
 */
class Readability
{
    public $version = '1.8.2-laravel';
    public $revertForcedParagraphElements = true;
    public $articleTitle;
    public $articleContent;
    public $dom;
    public $url = null;            // optional - URL where HTML was retrieved
    public $debug = false;
    protected $body = null;
    protected $bodyCache = null;   // Cache the body HTML in case we need to re-use it later
    protected $flags = 7;          // 1 | 2 | 4;   // Start with all flags set.
    protected $success = false;    // indicates whether we were able to extract or not

    public $regexps = array(
        'unlikelyCandidates' => '/combx|comment|cikk_ajanlo|author-container|artcl-social-media|community|disqus|extra|header|menu|remark|rss|shoutbox|sidebar|sponsor|ad-break|agegate|pagination|pager|popup|tweet|twitter/i',
        'okMaybeItsACandidate' => '/and|main_center|article|article-topics-container|article-content|story|cont|contentview|contentColumn|content_left|bodyContent|singleContent|body|column|text|main|shadow/i',
        'positive' => '/article|footnotes|story-header|story-meta|body|content|photo|container|content_area|entry|row|hentry|book|main|page|photo|pagination|post|text|blog|mainBodyArea|fifthPar|fourthPar|thirdPar|story/i',
        'negative' => '/entry-related|combx|comment|portlet|com-|toolbar|nav|pageheader|contact|foot|footer|footnote|masthead|media|meta|outbrain|promo|related|scroll|shoutbox|sidebar|sponsor|shopping|tags|tool|widget/i',
        'divToPElements' => '/<(a|blockquote|dd|dl|div|img|ol|pre|table|ul|noscript|article)/i',
        'replaceBrs' => '/(<br[^>]*>[ \n\r\t]*){2,}/i',
        'replaceFonts' => '/<(\/?)font[^>]*>/i',
        // 'trimRe'            => '/^\s+|\s+$/g', // PHP has trim()
        'normalize' => '/\s{2,}/',
        'killBreaks' => '/(<br\s*\/?>(\s|&nbsp;?)*){1,}/',
        'video' => '/http:\/\/(www\.)?(youtube|vimeo)\.com/i',
        'skipFootnoteLink' => '/^\s*(\[?[a-z0-9]{1,2}\]?|^|edit|citation needed)\s*$/i'
    );

    const FLAG_STRIP_UNLIKES = 1;
    const FLAG_WEIGHT_CLASSES = 2;
    const FLAG_CLEAN_CONDITIONALLY = 4;

    /**
     * Create instance of Readability
     * @param string $html UTF-8 encoded string
     * @param string $url (optional) URL associated with HTML (used for footnotes)
     */
    public function __construct($html, $url = null)
    {
        // Turn all double br's into p's
        // Note, this is pretty costly as far as processing goes. Maybe optimize later.
        $html = preg_replace($this->regexps['replaceBrs'], '</p><p>', $html);
        $html = preg_replace($this->regexps['replaceFonts'], '<$1span>', $html);
        $html = mb_convert_encoding($html, 'HTML-ENTITIES', "UTF-8");
        $this->dom = new \DOMDocument();
        $this->dom->preserveWhiteSpace = false;
        $this->dom->registerNodeClass('\DOMElement', 'App\JSLikeHTMLElement');
        if (trim($html) == '') $html = '<html></html>';
        @$this->dom->loadHTML($html);
        $this->url = $url;
    }

    /**
     * Get article title element
     * @return string DOMElement
     */
    public function getTitle()
    {
        return $this->articleTitle;
    }

    /**
     * Get article content element
     * @return string DOMElement
     */
    public function getContent()
    {
        return $this->articleContent;
    }

    public function getContentLength()
    {
        return strlen($this->articleContent->innerHTML);
    }

    /**
     * Runs readability.
     *
     * Workflow:
     *  1. Prep the document by removing script tags, css, etc.
     *  2. Build readability's DOM tree.
     *  3. Grab the article content from the current dom tree.
     *  4. Replace the current DOM tree with the new one.
     *  5. Read peacefully.
     *
     * @return boolean true if we found content, false otherwise
     **/
    public function init()
    {
        if (!isset($this->dom->documentElement)) return false;
        $this->clean($this->dom, 'script');

        // Assume successful outcome
        $this->success = true;

        $bodyElems = $this->dom->getElementsByTagName('body');
        if ($bodyElems->length > 0) {
            if ($this->bodyCache == null) {
                $this->bodyCache = $bodyElems->item(0)->innerHTML;
            }
            if ($this->body == null) {
                $this->body = $bodyElems->item(0);
            }
        }

        $this->prepDocument();

        /* Build readability's DOM tree */
        $overlay = $this->dom->createElement('div');
        $innerDiv = $this->dom->createElement('div');
        $articleTitle = $this->getArticleTitle();
        $articleContent = $this->grabArticle();

        if (!$articleContent) {
            $this->success = false;
            $articleContent = $this->dom->createElement('div');
            $articleContent->setAttribute('id', 'readability-content');
            $articleContent->innerHTML = '<p>Sorry, Readability was unable to parse this page for content.</p>';
        }

        $overlay->setAttribute('id', 'readOverlay');
        $innerDiv->setAttribute('id', 'readInner');

        /* Glue the structure of our document together. */
        $innerDiv->appendChild($articleTitle);
        $innerDiv->appendChild($articleContent);
        $overlay->appendChild($innerDiv);

        /* Clear the old HTML, insert the new content. */
        $this->body->innerHTML = '';
        $this->body->appendChild($overlay);
        //document.body.insertBefore(overlay, document.body.firstChild);
        $this->body->removeAttribute('style');

        // Set title and content instance variables
        $this->articleTitle = $articleTitle;
        $this->articleContent = $articleContent;

        return $this->success;
    }

    /**
     * Get the article title as an H1.
     *
     * @return \DOMElement | JSLikeHTMLElement
     */
    protected function getArticleTitle()
    {
        $curTitle = '';
        $origTitle = '';

        try {
            $curTitle = $origTitle = $this->getInnerText($this->dom->getElementsByTagName('title')->item(0));
        } catch (\Exception $e) {
        }

        if (preg_match('/ [\|\-] /', $curTitle)) {
            $curTitle = preg_replace('/(.*)[\|\-] .*/i', '$1', $origTitle);

            if (count(explode(' ', $curTitle)) < 3) {
                $curTitle = preg_replace('/[^\|\-]*[\|\-](.*)/i', '$1', $origTitle);
            }
        } else if (strpos($curTitle, ': ') !== false) {
            $curTitle = preg_replace('/.*:(.*)/i', '$1', $origTitle);

            if (count(explode(' ', $curTitle)) < 3) {
                $curTitle = preg_replace('/[^:]*[:](.*)/i', '$1', $origTitle);
            }
        } else if (strlen($curTitle) > 150 || strlen($curTitle) < 15) {
            $hOnes = $this->dom->getElementsByTagName('h1');
            if ($hOnes->length == 1) {
                $curTitle = $this->getInnerText($hOnes->item(0));
            }
        }

        $curTitle = trim($curTitle);

        if (count(explode(' ', $curTitle)) <= 4) {
            $curTitle = $origTitle;
        }

        $articleTitle = $this->dom->createElement('h1');
        $articleTitle->innerHTML = $curTitle;

        return $articleTitle;
    }

    /**
     * Prepare the HTML document for readability to scrape it.
     * This includes things like stripping javascript, CSS, and handling terrible markup.
     *
     * @return void
     **/
    protected function prepDocument()
    {
        /**
         * In some cases a body element can't be found (if the HTML is totally hosed for example)
         * so we create a new body node and append it to the document.
         */
        if ($this->body == null) {
            $this->body = $this->dom->createElement('body');
            $this->dom->documentElement->appendChild($this->body);
        }
        $this->body->setAttribute('id', 'readabilityBody');

        /* Remove all style tags in head */
        $styleTags = $this->dom->getElementsByTagName('style');
        for ($i = $styleTags->length - 1; $i >= 0; $i--) {
            $styleTags->item($i)->parentNode->removeChild($styleTags->item($i));
        }
    }

    /**
     * Reverts P elements with class 'readability-styled'
     * to text nodes - which is what they were before.
     *
     * @param \DOMElement | JSLikeHTMLElement
     * @return void
     */
    function revertReadabilityStyledElements($articleContent)
    {
        $xpath = new \DOMXPath($articleContent->ownerDocument);
        $elems = $xpath->query('.//p[@class="readability-styled"]', $articleContent);
        //$elems = $articleContent->getElementsByTagName('p');
        for ($i = $elems->length - 1; $i >= 0; $i--) {
            $e = $elems->item($i);
            $e->parentNode->replaceChild($articleContent->ownerDocument->createTextNode($e->textContent), $e);
        }
    }

    /**
     * Prepare the article node for display. Clean out any inline styles,
     * iframes, forms, strip extraneous <p> tags, etc.
     *
     * @param JSLikeHTMLElement|\DOMElement $articleContent
     * @return void
     */
    function prepArticle($articleContent)
    {
        /* Clean out junk from the article content */
        $this->cleanConditionally($articleContent, 'form');
        $this->clean($articleContent, 'object');
        $this->clean($articleContent, 'picture');
        $this->clean($articleContent, 'script');
        $this->clean($articleContent, 'svg');
        $this->clean($articleContent, 'iframe');

        $this->cleanInlineStyles($articleContent);
        $this->killBreaks($articleContent);

        if ($this->revertForcedParagraphElements) {
            $this->revertReadabilityStyledElements($articleContent);
        }


        /**
         * If there is only one h1 or h2, they are probably using it
         * as a header and not a subheader, so remove it since we already have a header.
         */
        if ($articleContent->getElementsByTagName('h1')->length == 1) {
            $this->clean($articleContent, 'h1');
        }
        if ($articleContent->getElementsByTagName('h2')->length == 1) {
            $this->clean($articleContent, 'h2');
        }


        $this->cleanHeaders($articleContent);

        /* Do these last as the previous stuff may have removed junk that will affect these */
        $this->cleanConditionally($articleContent, 'table');
        $this->cleanConditionally($articleContent, 'ul');
        $this->cleanConditionally($articleContent, 'div');

        /* Remove extra paragraphs */
        $articleParagraphs = $articleContent->getElementsByTagName('p');
        for ($i = $articleParagraphs->length - 1; $i >= 0; $i--) {
            $imgCount = $articleParagraphs->item($i)->getElementsByTagName('img')->length;
            $embedCount = $articleParagraphs->item($i)->getElementsByTagName('embed')->length;
            $objectCount = $articleParagraphs->item($i)->getElementsByTagName('object')->length;

            if ($imgCount === 0 && $embedCount === 0 && $objectCount === 0 && $this->getInnerText($articleParagraphs->item($i), false) == '') {
                $articleParagraphs->item($i)->parentNode->removeChild($articleParagraphs->item($i));
            }
        }

        try {
            $articleContent->innerHTML = preg_replace('/<br[^>]*>\s*<p/i', '<p', $articleContent->innerHTML);
            //articleContent.innerHTML = articleContent.innerHTML.replace(/<br[^>]*>\s*<p/gi, '<p');
        } catch (\Exception $e) {
        }
    }

    /**
     * Initialize a node with the readability object. Also checks the
     * className/id for special names to add to its score.
     *
     * @param Element
     * @return void
     **/
    protected function initializeNode($node)
    {
        $readability = $this->dom->createAttribute('readability');
        $readability->value = 0; // this is our contentScore
        $node->setAttributeNode($readability);

        switch (strtoupper($node->tagName)) { // unsure if strtoupper is needed, but using it just in case
            case 'DIV':
                $readability->value += 5;
                break;

            case 'PRE':
            case 'TD':
            case 'BLOCKQUOTE':
                $readability->value += 3;
                break;

            case 'ADDRESS':
            case 'OL':
            case 'UL':
            case 'DL':
            case 'DD':
            case 'DT':
            case 'LI':
            case 'FORM':
                $readability->value -= 3;
                break;

            case 'H1':
            case 'H2':
            case 'H3':
            case 'H4':
            case 'H5':
            case 'H6':
            case 'TH':
                $readability->value -= 5;
                break;
        }
        $readability->value += $this->getClassWeight($node);
    }

    /**
     * Using a variety of metrics (content score, classname, element types), find the content that is
     * most likely to be the stuff a user wants to read. Then return it wrapped up in a div.
     *
     * @param \DOMDocument | JSLikeHTMLElement | \DOMElement $page
     * @return \DOMElement | bool
     */
    protected function grabArticle($page = null)
    {
        $stripUnlikelyCandidates = $this->flagIsActive(self::FLAG_STRIP_UNLIKES);
        if (!$page) $page = $this->dom;
        $allElements = $page->getElementsByTagName('*');

        /**
         * First, node prepping. Trash nodes that look cruddy (like ones with the class name "comment", etc), and turn divs
         * into P tags where they have been used inappropriately (as in, where they contain no other block level elements.)
         *
         * Note: Assignment from index for performance. See http://www.peachpit.com/articles/article.aspx?p=31567&seqNum=5
         * TODO: Shouldn't this be a reverse traversal?
         **/
        $node = null;
        $nodesToScore = array();

        for ($nodeIndex = 0; ($node = $allElements->item($nodeIndex)); $nodeIndex++) {
            $tagName = strtoupper($node->tagName);

            /* Remove unlikely candidates */
            if ($stripUnlikelyCandidates) {
                $unlikelyMatchString = $node->getAttribute('class') . $node->getAttribute('id');
                if (
                    preg_match($this->regexps['unlikelyCandidates'], $unlikelyMatchString) &&
                    !preg_match($this->regexps['okMaybeItsACandidate'], $unlikelyMatchString) &&
                    $tagName != 'BODY' && $tagName != 'HTML'
                ) {
                    //$nodesToRemove[] = $node;
                    $node->parentNode->removeChild($node);
                    $nodeIndex--;
                    continue;
                }
            }

            if ($tagName == 'P' || $tagName == 'TD' || $tagName == 'PRE') {
                $nodesToScore[] = $node;
            }

            /* Turn all divs that don't have children block level elements into p's */
            if ($tagName == 'DIV') {
                if (!preg_match($this->regexps['divToPElements'], $node->innerHTML)) {
                    $newNode = $this->dom->createElement('p');
                    try {
                        $newNode->innerHTML = $node->innerHTML;
                        //$nodesToReplace[] = array('new'=>$newNode, 'old'=>$node);
                        $node->parentNode->replaceChild($newNode, $node);
                        $nodeIndex--;
                        $nodesToScore[] = $node; // or $newNode?
                    } catch (\Exception $e) {
                        Log::error('Could not alter div to p, reverting back to div.: ' . $e);
                    }
                } else {
                    /* EXPERIMENTAL */
                    // TODO: change these p elements back to text nodes after processing
                    for ($i = 0, $il = $node->childNodes->length; $i < $il; $i++) {
                        $childNode = $node->childNodes->item($i);
                        if ($childNode->nodeType == 3) { // XML_TEXT_NODE
                            $p = $this->dom->createElement('p');
                            $p->innerHTML = $childNode->nodeValue;
                            $p->setAttribute('style', 'display: inline;');
                            $p->setAttribute('class', 'readability-styled');
                            $childNode->parentNode->replaceChild($p, $childNode);
                        }
                    }
                }
            }
        }

        /**
         * Loop through all paragraphs, and assign a score to them based on how content-y they look.
         * Then add their score to their parent node.
         *
         * A score is determined by things like number of commas, class names, etc. Maybe eventually link density.
         **/
        $candidates = array();
        for ($pt = 0; $pt < count($nodesToScore); $pt++) {
            $parentNode = $nodesToScore[$pt]->parentNode;
            // $grandParentNode = $parentNode ? $parentNode->parentNode : null;
            $grandParentNode = !$parentNode ? null : (($parentNode->parentNode instanceof DOMElement) ? $parentNode->parentNode : null);
            $innerText = $this->getInnerText($nodesToScore[$pt]);

            if (!$parentNode || !isset($parentNode->tagName)) {
                continue;
            }

            /* If this paragraph is less than 15 characters, don't even count it. */
            if (strlen($innerText) < 15) {
                continue;
            }

            /* Initialize readability data for the parent. */
            if (!$parentNode->hasAttribute('readability')) {
                $this->initializeNode($parentNode);
                $candidates[] = $parentNode;
            }

            /* Initialize readability data for the grandparent. */
            if ($grandParentNode && !$grandParentNode->hasAttribute('readability') && isset($grandParentNode->tagName)) {
                $this->initializeNode($grandParentNode);
                $candidates[] = $grandParentNode;
            }

            $contentScore = 0;

            /* Add a point for the paragraph itself as a base. */
            $contentScore++;

            /* Add points for any commas within this paragraph */
            $contentScore += count(explode(',', $innerText));

            /* For every 100 characters in this paragraph, add another point. Up to 3 points. */
            $contentScore += min(floor(strlen($innerText) / 100), 3);

            /* Add the score to the parent. The grandparent gets half. */
            $parentNode->getAttributeNode('readability')->value += $contentScore;

            if ($grandParentNode) {
                $grandParentNode->getAttributeNode('readability')->value += $contentScore / 2;
            }
        }

        /**
         * After we've calculated scores, loop through all of the possible candidate nodes we found
         * and find the one with the highest score.
         **/
        $topCandidate = null;
        for ($c = 0, $cl = count($candidates); $c < $cl; $c++) {
            /**
             * Scale the final candidates score based on link density. Good content should have a
             * relatively small link density (5% or less) and be mostly unaffected by this operation.
             **/
            $readability = $candidates[$c]->getAttributeNode('readability');
            $readability->value = $readability->value * (1 - $this->getLinkDensity($candidates[$c]));

            $tag_info = sprintf('%s#%s.%s',
                $candidates[$c]->tagName,
                $candidates[$c]->getAttribute('id'),
                $candidates[$c]->getAttribute('class'));

            if (!$topCandidate || $readability->value > (int)$topCandidate->getAttribute('readability')) {
                $topCandidate = $candidates[$c];
            }
        }

        /**
         * If we still have no top candidate, just use the body as a last resort.
         * We also have to copy the body node so it is something we can modify.
         **/
        if ($topCandidate === null || strtoupper($topCandidate->tagName) == 'BODY') {
            $topCandidate = $this->dom->createElement('div');
            if ($page instanceof \DOMDocument) {
                if (!isset($page->documentElement)) {
                    // we don't have a body either? what a mess! :)
                } else {
                    $topCandidate->innerHTML = $page->documentElement->innerHTML;
                    $page->documentElement->innerHTML = '';
                    $page->documentElement->appendChild($topCandidate);
                }
            } else {
                $topCandidate->innerHTML = $page->innerHTML;
                $page->innerHTML = '';
                $page->appendChild($topCandidate);
            }
            $this->initializeNode($topCandidate);
        }

        /**
         * Now that we have the top candidate, look through its siblings for content that might also be related.
         * Things like preambles, content split by ads that we removed, etc.
         **/
        $articleContent = $this->dom->createElement('div');
        $articleContent->setAttribute('id', 'readability-content');
        $siblingScoreThreshold = max(10, ((int)$topCandidate->getAttribute('readability')) * 0.2);
        $siblingNodes = $topCandidate->parentNode->childNodes;
        if (!isset($siblingNodes)) {
            $siblingNodes = new \stdClass;
            $siblingNodes->length = 0;
        }
        for ($s = 0, $sl = $siblingNodes->length; $s < $sl; $s++) {
            $siblingNode = $siblingNodes->item($s);
            $append = false;

            // Looking at sibling node
            if ($siblingNode === $topCandidate) // or if ($siblingNode->isSameNode($topCandidate))
            {
                $append = true;
            }

            $contentBonus = 0;
            /* Give a bonus if sibling nodes and top candidates have the example same classname */
            if ($siblingNode->nodeType === XML_ELEMENT_NODE && $siblingNode->getAttribute('class') == $topCandidate->getAttribute('class') && $topCandidate->getAttribute('class') != '') {
                $contentBonus += ((int)$topCandidate->getAttribute('readability')) * 0.2;
            }

            if ($siblingNode->nodeType === XML_ELEMENT_NODE && $siblingNode->hasAttribute('readability') && (((int)$siblingNode->getAttribute('readability')) + $contentBonus) >= $siblingScoreThreshold) {
                $append = true;
            }

            // TODO: Remove if anything is wrong in result HTML
            if (($siblingNode->nodeType === XML_ELEMENT_NODE) && in_array($siblingNode->getAttribute('class'), array('photo', 'mediaobject'))) {
                $append = true;
            }

            if (strtoupper($siblingNode->nodeName) == 'P') {
                $linkDensity = $this->getLinkDensity($siblingNode);
                $nodeContent = $this->getInnerText($siblingNode);
                $nodeLength = strlen($nodeContent);

                if ($nodeLength > 80 && $linkDensity < 0.25) {
                    $append = true;
                } else if ($nodeLength < 80 && $linkDensity === 0 && preg_match('/\.( |$)/', $nodeContent)) {
                    $append = true;
                }
            }

            if ($append) {
                $nodeToAppend = null;
                $sibNodeName = strtoupper($siblingNode->nodeName);
                if ($sibNodeName != 'DIV' && $sibNodeName != 'P') {
                    /**
                     * We have a node that isn't a common block level element, like a form or td tag.
                     * Turn it into a div so it doesn't get filtered out later by accident.
                     */
                    $nodeToAppend = $this->dom->createElement('div');
                    try {
                        $nodeToAppend->setAttribute('id', $siblingNode->getAttribute('id'));
                        $nodeToAppend->innerHTML = $siblingNode->innerHTML;
                    } catch (\Exception $e) {
                        Log::error('Could not alter siblingNode to div, reverting back to original.');
                        $nodeToAppend = $siblingNode;
                        $s--;
                        $sl--;
                    }
                } else {
                    $nodeToAppend = $siblingNode;
                    $s--;
                    $sl--;
                }

                /* To ensure a node does not interfere with readability styles, remove its classnames */
                $nodeToAppend->removeAttribute('class');

                /* Append sibling and subtract from our list because it removes the node when you append to another node */
                $articleContent->appendChild($nodeToAppend);
            }
        }

        /**
         * So we have all of the content that we need. Now we clean it up for presentation.
         **/
        $this->prepArticle($articleContent);

        /**
         * Now that we've gone through the full algorithm, check to see if we got any meaningful content.
         * If we didn't, we may need to re-run grabArticle with different flags set. This gives us a higher
         * likelihood of finding the content, and the sieve approach gives us a higher likelihood of
         * finding the -right- content.
         **/
        if (strlen($this->getInnerText($articleContent, false)) < 250) {
            // TODO: find out why element disappears sometimes, e.g. for this URL http://www.businessinsider.com/6-hedge-fund-etfs-for-average-investors-2011-7
            // in the meantime, we check and create an empty element if it's not there.
            if (!isset($this->body->childNodes)) $this->body = $this->dom->createElement('body');
            $this->body->innerHTML = $this->bodyCache;

            if ($this->flagIsActive(self::FLAG_STRIP_UNLIKES)) {
                $this->removeFlag(self::FLAG_STRIP_UNLIKES);
                return $this->grabArticle($this->body);
            } else if ($this->flagIsActive(self::FLAG_WEIGHT_CLASSES)) {
                $this->removeFlag(self::FLAG_WEIGHT_CLASSES);
                return $this->grabArticle($this->body);
            } else if ($this->flagIsActive(self::FLAG_CLEAN_CONDITIONALLY)) {
                $this->removeFlag(self::FLAG_CLEAN_CONDITIONALLY);
                return $this->grabArticle($this->body);
            } else {
                return false;
            }
        }
        return $articleContent;
    }

    /**
     * Get the inner text of a node.
     * This also strips out any excess whitespace to be found.
     *
     * @param \DOMElement $
     * @param boolean $normalizeSpaces (default: true)
     * @return string
     **/
    public function getInnerText($e, $normalizeSpaces = true)
    {
        $textContent = '';

        if (!isset($e->textContent) || $e->textContent == '') {
            return '';
        }

        $textContent = trim($e->textContent);

        if ($normalizeSpaces) {
            return preg_replace($this->regexps['normalize'], ' ', $textContent);
        } else {
            return $textContent;
        }
    }

    /**
     * Get the number of times a string $s appears in the node $e.
     *
     * @param \DOMElement $e
     * @param string - what to count. Default is ","
     * @return number (integer)
     **/
    public function getCharCount($e, $s = ',')
    {
        return substr_count($this->getInnerText($e), $s);
    }

    /**
     * Remove inline styles on every $e and under.
     *
     * @param \DOMElement $e
     * @return void
     */
    public function cleanInlineStyles($e)
    {
        if (!is_object($e)) return;
        $elems = $e->getElementsByTagName('*');
        foreach ($elems as $elem) $elem->removeAttribute('style');
    }

    /**
     * Get the density of links as a percentage of the content
     * This is the amount of text that is inside a link divided by the total text in the node.
     *
     * @param JSLikeHTMLElement | \DOMElement $e
     * @return number (float)
     */
    public function getLinkDensity($e)
    {
        $links = $e->getElementsByTagName('a');
        $textLength = strlen($this->getInnerText($e));
        $linkLength = 0;
        for ($i = 0, $il = $links->length; $i < $il; $i++) {
            $linkLength += strlen($this->getInnerText($links->item($i)));
        }
        if ($textLength > 0) {
            return $linkLength / $textLength;
        } else {
            return 0;
        }
    }

    /**
     * Get an elements class/id weight. Uses regular expressions to tell if this
     * element looks good or bad.
     *
     * @param \DOMElement $e
     * @return number (Integer)
     */
    public function getClassWeight($e)
    {
        if (!$this->flagIsActive(self::FLAG_WEIGHT_CLASSES)) {
            return 0;
        }

        $weight = 0;

        /* Look for a special classname */
        if ($e->hasAttribute('class') && $e->getAttribute('class') != '') {
            if (preg_match($this->regexps['negative'], $e->getAttribute('class'))) {
                $weight -= 25;
            }
            if (preg_match($this->regexps['positive'], $e->getAttribute('class'))) {
                $weight += 25;
            }
        }

        /* Look for a special ID */
        if ($e->hasAttribute('id') && $e->getAttribute('id') != '') {
            if (preg_match($this->regexps['negative'], $e->getAttribute('id'))) {
                $weight -= 25;
            }
            if (preg_match($this->regexps['positive'], $e->getAttribute('id'))) {
                $weight += 25;
            }
        }
        return $weight;
    }

    /**
     * Remove extraneous break tags from a node.
     *
     * @param \DOMElement $node
     * @return void
     */
    public function killBreaks($node)
    {
        $html = $node->innerHTML;
        $html = preg_replace($this->regexps['killBreaks'], '<br />', $html);
        $node->innerHTML = $html;
    }

    /**
     * Clean a node of all elements of type "tag".
     * (Unless it's a youtube/vimeo video. People love movies.)
     *
     * @param \DOMElement | \DOMDocument $e
     * @param string $tag
     * @return void
     */
    public function clean($e, $tag)
    {
        $targetList = $e->getElementsByTagName($tag);
        for ($y = $targetList->length - 1; $y >= 0; $y--) {
            $targetList->item($y)->parentNode->removeChild($targetList->item($y));
        }
    }

    /**
     * Clean an element of all tags of type "tag" if they look fishy.
     * "Fishy" is an algorithm based on content length, classnames,
     * link density, number of images & embeds, etc.
     *
     * @param \DOMElement $e
     * @param string $tag
     * @return void
     */
    public function cleanConditionally($e, $tag)
    {
        if (!$this->flagIsActive(self::FLAG_CLEAN_CONDITIONALLY)) {
            return;
        }

        $tagsList = $e->getElementsByTagName($tag);
        $curTagsLength = $tagsList->length;

        /**
         * Gather counts for other typical elements embedded within.
         * Traverse backwards so we can remove nodes at the same time without effecting the traversal.
         *
         * TODO: Consider taking into account original contentScore here.
         */
        for ($i = $curTagsLength - 1; $i >= 0; $i--) {
            $weight = $this->getClassWeight($tagsList->item($i));
            $contentScore = ($tagsList->item($i)->hasAttribute('readability')) ? (int)$tagsList->item($i)->getAttribute('readability') : 0;

            if ($weight + $contentScore < 0) {
                $tagsList->item($i)->parentNode->removeChild($tagsList->item($i));
            } else if ($this->getCharCount($tagsList->item($i), ',') < 10) {
                /**
                 * If there are not very many commas, and the number of
                 * non-paragraph elements is more than paragraphs or other ominous signs, remove the element.
                 **/
                $p = $tagsList->item($i)->getElementsByTagName('p')->length;
                $img = $tagsList->item($i)->getElementsByTagName('img')->length;
                $li = $tagsList->item($i)->getElementsByTagName('li')->length - 100;
                $input = $tagsList->item($i)->getElementsByTagName('input')->length;

                $embedCount = 0;
                $embeds = $tagsList->item($i)->getElementsByTagName('embed');
                for ($ei = 0, $il = $embeds->length; $ei < $il; $ei++) {
                    if (preg_match($this->regexps['video'], $embeds->item($ei)->getAttribute('src'))) {
                        $embedCount++;
                    }
                }

                $linkDensity = $this->getLinkDensity($tagsList->item($i));
                $contentLength = strlen($this->getInnerText($tagsList->item($i)));
                $toRemove = false;

                if (($img > $p) && ($img > 1)) {
                    $toRemove = true;
                } else if ($li > $p && $tag != 'ul' && $tag != 'ol') {
                    $toRemove = true;
                } else if ($input > floor($p / 3)) {
                    $toRemove = true;
                } else if ($contentLength < 25 && ($img === 0 || $img > 2)) {
                    $toRemove = true;
                } else if ($weight < 25 && $linkDensity > 0.2) {
                    $toRemove = true;
                } else if ($weight >= 25 && $linkDensity > 0.5) {
                    $toRemove = true;
                } else if (($embedCount == 1 && $contentLength < 75) || $embedCount > 1) {
                    $toRemove = true;
                }

                if ($toRemove) {
                    $tagsList->item($i)->parentNode->removeChild($tagsList->item($i));
                }
            }
        }
    }

    /**
     * Clean out spurious headers from an Element. Checks things like classnames and link density.
     *
     * @param \DOMElement $e
     * @return void
     */
    public function cleanHeaders($e)
    {
        for ($headerIndex = 1; $headerIndex < 3; $headerIndex++) {
            $headers = $e->getElementsByTagName('h' . $headerIndex);
            for ($i = $headers->length - 1; $i >= 0; $i--) {
                if ($this->getClassWeight($headers->item($i)) < 0 || $this->getLinkDensity($headers->item($i)) > 0.33) {
                    $headers->item($i)->parentNode->removeChild($headers->item($i));
                }
            }
        }
    }

    public function flagIsActive($flag)
    {
        return ($this->flags & $flag) > 0;
    }

    public function addFlag($flag)
    {
        $this->flags = $this->flags | $flag;
    }

    public function removeFlag($flag)
    {
        $this->flags = $this->flags & ~$flag;
    }

    public function setFlags($flags)
    {
        $this->flags = $flags;
    }
}
