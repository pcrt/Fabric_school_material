'use strict';

const { Contract } = require('fabric-contract-api')

class SampleContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========')
        const cars = [
            {
                color: 'blue',
                make: 'Toyota',
                model: 'Prius',
                owner: 'Tomoko',
            },
            {
                color: 'red',
                make: 'Ford',
                model: 'Mustang',
                owner: 'Brad',
            }
        ]

        for (let i = 0; i < cars.length; i++) {
            cars[i].docType = 'car'
            await ctx.stub.putState('CAR' + i, Buffer.from(JSON.stringify(cars[i])))
            console.info('Added <--> ', cars[i])
        }
        console.info('============= END : Initialize Ledger ===========')
    }

    async queryCar(ctx, carNumber) {
        const carAsBytes = await ctx.stub.getState(carNumber) // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`)
        }
        console.log(carAsBytes.toString())
        return carAsBytes.toString()
    }

}

module.exports = SampleContract;