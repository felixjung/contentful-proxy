const LRUCache = require('lru-cache')
const httpProxy = require('http-proxy')
const { send, json, sendError } = require('micro')
const config = require('./config.json')

const cache = new LRUCache({ maxAge: 1000 * 60 * 60 * 24 }) // cache for 1 day

function createProxyFn(config) {
  const proxy = createContentfulProxy(config)

  return (req, res) => {
    if (req.method === 'DELETE') {
      clearCache()
      send(res, 200)
      return
    }

    if (cache.has(req.url)) {
      const cached = cache.get(req.url)
      addHeaders(res, cached.headers)
      send(res, 200, cached.data)
      return
    }

    proxy.web(req, res)
  }
}

function addHeaders(res, headers) {
  for (let header in headers) {
    if (Object.prototype.hasOwnProperty.call(headers, header)) {
      res.setHeader(header, headers[header])
    }
  }
}

function clearCache() {
  cache.reset()
}

function createContentfulProxy(config) {
  const prependPath = config.hasOwnProperty('spaceId')
  const target = getContentfulUrl(config)
  const token = getAuthToken(config)
  const secure = Boolean(config.secure)

  const options = {
    target,
    changeOrigin: true,
    xfwd: true,
    secure,
    preserveHeaderKeyCase: true,
    headers: { Authorization: `Bearer ${token}` }
  }

  return httpProxy.createProxyServer(options)
    .on('proxyRes', cacheResponse)
    .on('error', handleError)
}

async function cacheResponse(proxyRes, { url: key }) {
  const { status, statusText, headers } = proxyRes
  const data = await json(proxyRes)
  cache.set(key, { status, statusText, headers, data })
}

function getAuthToken({ accessToken, previewToken, preview = false }) {
  const hasPreviewToken = Boolean(previewToken)
  if (!hasPreviewToken && preview) {
    const errorMsg = 'Please provide preview API token to use the preview API.'
    throw new Error(errorMsg)
    process.exit(1)
  }
  return preview ? previewToken : accessToken
}

function getContentfulUrl({ preview = false, secure = true, spaceId = '' }) {
  const path = spaceId ? `spaces/${spaceId}` : ''
  const protocol = secure ? 'https' : 'http'
  const host = preview ? 'preview.contentful.com' : 'cdn.contentful.com'
  return `${protocol}://${host}/${path}`
}

function handleError(err, req, res) {
  sendError(req, res, err)
}

module.exports = createProxyFn(config)
