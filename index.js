const express = require('express')
var serveIndex = require('serve-index')
const app = express()
const port = 3100

app.use('/ftp', express.static('uploads'), serveIndex('uploads', {'icons': true, 'view': 'details'}))


app.use('/',require('./routes/controller'))
app.use('/email' , require('./routes/email'))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})