## Description

Small caching proxy service for [Contentful](http://contentful.com)'s [Content
Delivery
API](https://www.contentful.com/developers/docs/references/content-delivery-api/)
(CDA) written for and using Zeit.co's [micro](https://github.com/zeit/micro).

## Installation

This project uses yarn, so run the following from the terminal:

``` bash
$ yarn
```

You can also install via npm by running

``` bash
$ npm install
```

## Usage

Because micro **requires** Node.js 6.0.0 or above, the same is true for this
project.

### Configuration

Copy `config.json.example` to `config.json`. Specify the `accessToken` and,
should you plan to use the Contentful Preview API (CPA), also specify the
`previewToken`. To use the preview API set `preview` to true. To not use HTTPS
when querying Contentful, set `secure` to `true`.

By default, the proxy will use the CDA over HTTPS.

### Start

Running

``` bash
$ yarn start
```
from the terminal will start the server on port `3000` listening at `localhost`.

You can also start the proxy by installing micro globally and running

``` bash
$ micro
```

with any of micro's standard options.

### Caching

The proxy will cache any responses from Contentful using the full URL including
query params as key. Cached values never expire and are used for both, the
response body and headers, when responding to subsequent requests. To clear the
cache, for example using Contentful's post-publishing hooks, send a `DELETE`
request to the service.



