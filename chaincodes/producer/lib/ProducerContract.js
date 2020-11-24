'use strict';

const { Contract } = require('fabric-contract-api')

class ProducerContract extends Contract {

    async initLedger(ctx) {
        console.info('============= PRODUCER CONTRACT INIT METHOD CALL ===========')
        console.info('============= START : Initialize Ledger ===========')

        /*const products = [
            {s
                docType: 'product',
                name: 'suitcase',
                model: 'Horizone',
                quantity: 5,
                price: 10,
                owner: 'Producer',
            },
            {
                docType: 'product',
                name: 'backpack',
                model: 'Eastpack',
                quantity: 8,
                price: 25,
                owner: 'Producer',
            }
        ]

        for (let i = 0; i < products.length; i++) {
            const productKey = 'PROD' + i
            await ctx.stub.putState(productKey, Buffer.from(JSON.stringify(products[i])))
            console.info('Added <--> ', products[i])
        }*/
        console.info('============= END : Initialize Ledger ===========')
    }

    /** TODO - transactions */

}

module.exports = ProducerContract