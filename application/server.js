const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 3000
const FabNetwork = require('./index.js')

app.use(express.static('public'))
app.use(bodyParser())

app.post('/submitTX', async (req, res) => {
    const data = req.body
    const identity = data.identity
    const organization = data.organization
    const msp = data.msp
    const channel = data.channel
    const txName = data.txName
    const txParams = data.txParams

    await FabNetwork.createIdentity(identity, organization, msp)
    await FabNetwork.createConnection(identity, organization)
    const resultTx = await FabNetwork.submitT(channel, txName, txParams)

    res.send(resultTx)
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})