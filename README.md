jQuery.bingsearch
=================

Introduction
------------

I needed to use the new [Windows Azure Marketplace Bing Search API][1] (great
name Microsoft) because Google [deprecated its old search API and charges for
the new search][5]. Bing still lets you do 5000 queries a month for free, which
is more than enough for my site search.

This jQuery plugin lets you do Bing Web Searches in a very easy fashion in
jQuery style.

[1]: <http://datamarket.azure.com/dataset/bing/search>

[5]: <http://stackoverflow.com/questions/6405942/google-search-api-site-limit>

Requirements
------------

This library requires [jQuery][7] and [jQuery-base64][6] (from @carlo).

[6]: <https://github.com/carlo/jquery-base64>

[7]: <http://jquery.com/>

Usage
-----

### App Key

Get an app key by following step 1 on [this page][8].

[8]: <http://blog.jongallant.com/2012/07/bing-search-api-azure-csharp.html>

### HTML

`<script type="text/javascript" src="js/jquery.bingsearch-min.js"></script>`

### Javascript

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
$.bingSearch({
	// Required (unless you use urlBase) by Bing Search API
	appKey: 'Put your Windows Azure Marketplace Bing Search API Primary Account Key here'
	// Optional (defaults to the Bing Search API Web Results Query).
	// Additional information: This feature allows you to proxy through a server-side
	//                         script in order to hide your API key, which is exposed to the
	//                         world if you set it client-side in appKey. An example PHP
	//                         script is included (searchproxy.php).
	urlBase: 'searchproxy.php',
	// Optional (defaults to 1): Page Number
	pageNumber: parseInt($('#pageNumber').val()),
	// Optional (defaults to 10): Page Size
	pageSize: 10,
	limitToSite: 'chrisbenard.net',
	query: 'query text here',
	limitToSite: 'example.org'
	// Optional (defaults to false): Print console logging information about search results
	debug: false,
	// Optional: Function is called after search results are retrieved, but before the interator is called
	beforeSearchResults: function(data) {
		// Use data.hasMore, data.resultBatchCount
	},
	// Optional: Function is called once per result in the current batch
	searchResultIterator: function(data) {
		// Use data.ID, data.Title, data.Description, data.Url, data.DisplayUrl, data.Metadata.Type (check for undefined)
	},
	// Optional: Function is called after search results are retrieved and after all instances of the interator are called
	afterSearchResults: function(data) {
		// Use data.hasMore, data.resultBatchCount
	},
	// Optional: Called when there is an error retrieving results
	fail: function(data) {
		// data contains an error message
	}
});
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Limitations
-----------

Unfortunately, the Bing Search API does not return the total count, so creating
a pagination interface is impossible unless you just want forward and backward.
If you want this, just keep track of the page numbers, and check if
`data.hasMore` in the before/after events. If true, then you can show a next
button. If you are on page 1, don't show a previous button.

Example
-------

An example will be here hosted on github pages when I'm done.

Pull Requests
-------------

I know this plugin can be extended in a lot of ways, like composite searches,
image searches, etc, but I only need regular web search. Please feel free to
fork it, add anything you'd like (in the scope of the library) and issue a pull
request. As long as it's in the same style and it passes JSHint with the options
in the plugin's JSHint comment, I will probably accept it.

License
-------

[The MIT License (MIT)][2]

[2]: <http://opensource.org/licenses/MIT>

Copyright (c) 2013 [Chris Benard][3]

[3]: <http://chrisbenard.net>

[http://github.com/cbenard/jquery-bingsearch][4]

[4]: 

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
