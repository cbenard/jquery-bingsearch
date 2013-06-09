<?php

// Put your Windows Azure Marketplace Bing Search API Primary Account Key here
$appKey = "";

// Put your website domains here in regex form for allowable matches.
// This isn't foolproof, but all browsers I know of do not allow you
// to change the referer header in AJAX requests. However, this could
// be exploited via server-side code easily.
$acceptReferers = array('~^https?://example.org/?~i', '~^http://localhost(:[\d]+)?/?~i');

// Set your desired url base from the Windows Azure Marketplace Bing Search API
// Example: https://api.datamarket.azure.com/Bing/Search/v1/Web
$urlBase = 'https://api.datamarket.azure.com/Bing/Search/v1/Web';

// -----------------------------------------------------------
// Don't edit below this line
// -----------------------------------------------------------

$isValid = false;
foreach ($acceptReferers as $accept)
{
    if (preg_match($accept, $_SERVER['HTTP_REFERER']))
    {
        $isValid = true;
    }
}

if (!$isValid)
{
    http_response_code(403);
    die('Forbidden: Invalid referer: ' . $_SERVER['HTTP_REFERER']);
}

// Header parsing modified from http://stackoverflow.com/a/7566440
$url = "{$urlBase}?{$_SERVER['QUERY_STRING']}";

$requestHeaders = apache_request_headers();
$requestHeadersString = "";

foreach ($requestHeaders as $key => $value)
{
    if (strcasecmp("authorization", $key) != 0 && strcasecmp("host", $key) != 0 && strcasecmp("connection", $key) != 0)
        $requestHeadersString .= $key . ': ' . $value . "\r\n";
}

$requestHeadersString .= "Authorization: Basic " . base64_encode($appKey . ':' . $appKey);

$options['http'] = array(
    'method' => "GET",
    'ignore_errors' => 1,
    'header' => $requestHeadersString
);

$context = stream_context_create($options);

$body = file_get_contents($url, NULL, $context);

$responses = parse_http_response_header($http_response_header);

$code = $responses[0]['status']['code']; // last status code

header($responses['status']['line']);

foreach ($responses[0]['fields'] as $header)
{
    header($header);
}

echo $body;

/**
 * parse_http_response_header
 *
 * @param array $headers as in $http_response_header
 * @return array status and headers grouped by response, last first
 */
function parse_http_response_header(array $headers)
{
    $responses = array();
    $buffer = NULL;
    foreach ($headers as $header)
    {
        if ('HTTP/' === substr($header, 0, 5))
        {
            // add buffer on top of all responses
            if ($buffer) array_unshift($responses, $buffer);
            $buffer = array();

            list($version, $code, $phrase) = explode(' ', $header, 3) + array('', FALSE, '');

            $buffer['status'] = array(
                'line' => $header,
                'version' => $version,
                'code' => (int) $code,
                'phrase' => $phrase
            );
            $fields = &$buffer['fields'];
            $fields = array();
            continue;
        }
        $fields[] = $header;
    }
    unset($fields); // remove reference
    array_unshift($responses, $buffer);

    return $responses;
}