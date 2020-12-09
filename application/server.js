const express = require('express')
const app = express()
const port = 3000
const FabNetwork = require('./index.js')

app.get('/createIdentity', async (req, res) => {
    //const { identity, organization, msp, channel, txName, txParams } = req.query // TODO

    const identity = 'Agency'
    const organization = 'agency.quotation.com'
    const msp = 'AgencyMSP'
    const channel = 'quotationchannel1'
    const txName = 'getQuotation'
    const txParams = ['quotation1']

    await FabNetwork.createIdentity(identity, organization, msp)
    await FabNetwork.createConnection(identity, organization)
    const data = await FabNetwork.submitT(channel, txName, txParams)

    res.send(data)
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})