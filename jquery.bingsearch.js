/*
 * The MIT License (MIT)
 * Copyright (c) 2013 Chris Benard
 * http://github.com/cbenard/jquery-bingsearch
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
*/
/*! jQuery-bingsearch | (c) 2013 Chris Benard | http://github.com/cbenard/jquery-bingsearch#license */
/*jshint laxbreak: true, forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, jquery:true, indent:4, maxerr:50, devel:true, nomen:false, onevar:false, white:false */
(function($) {
    "use strict";

    $.bingSearch = function(options) {
        var defaultUrlBase = 'https://api.datamarket.azure.com/Bing/Search/v1/Web';
        var settings = $.extend({
                pageNumber: 1,
                pageSize: 10,
                debug: false,
                urlBase: defaultUrlBase
            }, options);

        if (!settings.appKey && settings.urlBase === defaultUrlBase) {
            console.error('Bing Search: Missing app key which is required if you are not overriding urlBase');
        }
        if (!settings.query) {
            console.error('Bing Search: Missing query');
        }
        if (!(settings.fail
                || settings.beforeSearchResults
                || settings.searchResultIterator
                || settings.afterSearchResults)) {
            console.error('Bing Search: Missing at least one result function');
        }

        if ((settings.appKey || settings.urlBase !== defaultUrlBase)
            && settings.query
            && (settings.fail
                || settings.beforeSearchResults
                || settings.searchResultIterator
                || settings.afterSearchResults))
        {
            if (settings.limitToSite) {
                settings.query += ' site:' + settings.limitToSite;
            }

            var url = settings.urlBase + '?$format=json&$top='
                    + parseInt(settings.pageSize, 10)
                    + '&$Skip=' + (parseInt(settings.pageSize, 10) * (settings.pageNumber - 1))
                    + "&Query='" + settings.query + "'";

            var authHeader = "Basic " + $.base64.encode(settings.appKey + ":" + settings.appKey);

            if (settings.debug) {
                console.log('Bing Search: Using URL: ' + url);
                console.log('Bing Search: Sending Authorization header: ' + authHeader);
            }

            // Allow cross-site
            $.support.cors = true;
            $.ajax({
                beforeSend: function (xhr) {  
                    xhr.setRequestHeader("Authorization", authHeader);  
                },
                url: url,
                error:  function(xhr, statusText, ex) {
                            if (settings.fail) {
                                settings.fail(ex.message);
                            }
                            else {
                                console.error(ex.message);
                            }
                        },
                dataType: 'json',
                success: function(data) {
                    if (!data || !data.d || !data.d.results) {
                        var errorMessage = "Bing Search: Data was empty or didn't contain results.";
                        if (settings.fail) {
                            settings.fail(errorMessage);
                        }
                        else {
                            console.error(errorMessage);
                        }
                        return;
                    }

                    var beforeClientData = {
                        hasMore: data.d.__next !== undefined,
                        resultBatchCount: data.d.results.length
                    };

                    if (settings.beforeSearchResults) {
                        settings.beforeSearchResults(beforeClientData);
                    }

                    if (settings.searchResultIterator) {
                        for (var i = 0; i < data.d.results.length; i++) {
                            var cur = data.d.results[i];
                            var curMetadata = null;
                            if (cur.__metadata && cur.__metadata.type) {
                                curMetadata = { 'ResultType': cur.__metadata.type };
                            }

                            // Map to DTO in case Bing changes the API
                            var curClient = {
                                'ID': cur.ID,
                                'Title': cur.Title,
                                'Description': cur.Description,
                                'Url': cur.Url,
                                'DisplayUrl': cur.DisplayUrl,
                                'Metadata': curMetadata
                            };

                            if (settings.debug) {
                                console.log("Bing Search: Result: \nID: " + (curClient.ID || 'null')
                                    + "\nTitle: " + (curClient.Title || 'null')
                                    + "\nDescription: " + (curClient.Description || 'null')
                                    + "\nUrl: " + (curClient.Url || 'null')
                                    + "\nDisplayUrl: " + (curClient.DisplayUrl || 'null')
                                    + "\nMetadata.ResultType: " + (curClient.Metadata && curClient.Metadata.ResultType ? curClient.Metadata.ResultType : 'null'));
                            }

                            settings.searchResultIterator(curClient);
                        }
                    }

                    if (settings.afterSearchResults) {
                        settings.afterSearchResults(beforeClientData);
                    }
                }
            });
        }

        return this;
    };
 
}( jQuery ));