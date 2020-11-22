import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler'

/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 * 2. we will return an error message on exception in your Response rather
 *    than the default 404.html page.
 */
const DEBUG = false

addEventListener('fetch', (event) => {
  try {
    event.respondWith(handleEvent(event))
  } catch (e) {
    if (DEBUG) {
      return event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500,
        })
      )
    }
    event.respondWith(new Response('Internal Error', { status: 500 }))
  }
})

const IP_MAP = [
  '95.217.185.139',
  '212.129.21.56',
  '45.146.6.82',
  '46.4.143.48',
  '51.89.1.61',
  '194.156.98.193',
  '185.105.238.209',
  '45.91.250.221',
  '185.25.204.60',
  '94.154.1.7',
  '185.120.77.165',
  '88.119.179.10',
  '178.17.171.235',
  '185.209.161.169',
  '185.213.209.92',
  '185.159.82.88',
  '93.170.128.167',
  '139.99.75.183',
  '185.29.8.135',
  '179.43.148.195',
  '185.169.54.231',
  '45.9.250.137',
  '185.86.77.126',
  '192.157.233.160',
  '5.253.30.82',
  '172.246.126.50',
]

function getStatusForIp(ip) {
  let idx = IP_MAP.indexOf(ip)
  if (idx === -1) idx = 18
  return parseInt(`4${idx.toString().padStart(2, '0')}`)
}

async function handleEvent(event) {
  const request = event.request
  if (
    request.headers.has('user-agent') &&
    request.headers.get('user-agent') == 'CheckHost (https://check-host.net/)'
  ) {
    let reportUrl =
      request.headers.has('referer') && request.headers.get('referer')
    if (reportUrl) {
      let kvRes = await __CHECKHOST.get(reportUrl)
      if (kvRes === null) {
        await __CHECKHOST.put(reportUrl, 'handled')
        await fetch(DISCORD_WEBHOOK, {
          headers: {
            'content-type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            content: `Someone tried testing **pxl.blue** on check-host.net: Report url: <${reportUrl}>`,
          }),
        })
      }
    }
    return new Response('No.', {
      status: getStatusForIp(request.headers.get('cf-connecting-ip')),
    })
  }

  const url = new URL(event.request.url)
  let options = {}

  /**
   * You can add custom logic to how we fetch your assets
   * by configuring the function `mapRequestToAsset`
   */
  // options.mapRequestToAsset = handlePrefix(/^\/docs/)

  try {
    if (DEBUG) {
      // customize caching
      options.cacheControl = {
        bypassCache: true,
      }
    }
    return await getAssetFromKV(event, options)
  } catch (e) {
    // if an error is thrown try to serve the asset at 404.html
    if (!DEBUG) {
      /*try {
        let notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: (req) =>
            new Request(`${new URL(req.url).origin}/404.html`, req),
        })

        return new Response(notFoundResponse.body, {
          ...notFoundResponse,
          status: 404,
        })
      } catch (e) {}*/
    }
    return await getAssetFromKV(event, {
      mapRequestToAsset: (req) =>
        new Request(`${new URL(req.url).origin}/index.html`, req),
    })

    //return new Response(e.message || e.toString(), { status: 500 })
  }
}

/**
 * Here's one example of how to modify a request to
 * remove a specific prefix, in this case `/docs` from
 * the url. This can be useful if you are deploying to a
 * route on a zone, or if you only want your static content
 * to exist at a specific path.
 */
function handlePrefix(prefix) {
  return (request) => {
    // compute the default (e.g. / -> index.html)
    let defaultAssetKey = mapRequestToAsset(request)
    let url = new URL(defaultAssetKey.url)

    // strip the prefix from the path for lookup
    url.pathname = url.pathname.replace(prefix, '/')

    // inherit all other props from the default request
    return new Request(url.toString(), defaultAssetKey)
  }
}
