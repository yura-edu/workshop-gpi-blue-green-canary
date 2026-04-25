const http = require('http')

const PORT = process.env.PORT || 3000
const FORCE_UNHEALTHY = process.env.FORCE_UNHEALTHY === 'true'

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('X-App-Version', '2.0.0')

  if (req.url === '/health') {
    if (FORCE_UNHEALTHY) {
      res.writeHead(500)
      res.end(JSON.stringify({ ok: false, reason: 'FORCE_UNHEALTHY is set' }))
    } else {
      res.writeHead(200)
      res.end(JSON.stringify({ ok: true }))
    }
    return
  }

  if (req.url === '/api/version') {
    res.writeHead(200)
    res.end(JSON.stringify({ version: '2.0.0', features: ['new-feature'] }))
    return
  }

  res.writeHead(404)
  res.end(JSON.stringify({ error: 'Not found' }))
})

server.listen(PORT, () => {
  console.log(`app-v2 listening on port ${PORT}`)
})
