Small authentication and caching proxy service for [Contentful](http://contentful.com)'s [Content Delivery API](https://www.contentful.com/developers/docs/references/content-delivery-api/) (CDA) written for and using Zeit.co's [micro](https://github.com/zeit/micro). Useful for front-end's connecting to Contentful and for people who have problems with their request cap.

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

Copy `config.json.example` to `config.json` and specify the required options listed below.

| Option         | Note                   | Description                              |
| -------------- | ---------------------- | ---------------------------------------- |
| `accessToken`  | **String** *required*  | The space's access token for the production CDA. |
| `previewToken` | **String** *optional*  | The space's access token for the CPA.    |
| `preview`      | **Boolean** *optional* | Should the CPA be proxied? If set to true, make sure the `previewToken` is specified. |
| `spaceId`      | **String** *optional*  | The ID of you space. If specified, you won't have to set `/spaces/{spaceId}` in your requests. |
| `secure`       | **Boolean** *optional* | Should the proxy use HTTPS and verify Contentful's SSL certificate. |

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



