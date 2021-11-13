const { join } = require('path')
const { createProxyServer } = require('http-proxy')
const express = require('express')

const app = express()

app.use(express.static(join(__dirname, './static')))

app.all('/api/*', (() => {
    const proxy = createProxyServer({
        changeOrigin: true,
        target: 'http://localhost:8080/',
    })

    proxy.on('error', (err, req, res) => {
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        res.end(err.toString())
    })

    return (req, res) => proxy.web(req, res)
})())

const PORT = 3000
app.listen(PORT, () => {
    console.log('Serving on ' + PORT)
})
