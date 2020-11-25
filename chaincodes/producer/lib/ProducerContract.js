'use strict';

const { Contract } = require('fabric-contract-api')

class ProducerContract extends Contract {

	async initLedger(ctx) {
        const producer = {
            ID: 'producer1', // ID of the producer
            Types: [ // Product types that can be purchased at the producer
                { name: 'Shoes', price: 50 },
                { name: 'T-shirt', price: 10 },
                { name: 'Jeans', price: 25 }
            ]
        }
 
        await ctx.stub.putState(producer.ID, Buffer.from(JSON.stringify(producer)))
        console.info(`Producer ${producer.ID} initialized`)
    }

    async getWorldState(ctx) {
        return await ctx.stub.getState('producer1')
    }

    async requestQuotation(ctx, requiredType, quantity) {
        const producer = await ctx.stub.getState('producer1')
        const productType = await this.checkAvailability(requiredType, producer.Types) 
        if(!productType) {
            throw new Error(`The producer ${producer.ID} has not this product type`) 
        }

        const quotation = productType.price * quantity
        return quotation
    }

    // By the shop
    async buyStock(ctx, productID, quantity) {
        // submitter identity = shop
        // collection private (producer - shop
        const producer = await ctx.stub.getState('producer1')
        let productToBuy = await ctx.stub.getState(productID)
        const productType = await this.checkAvailability(productToBuy.Type, producer.Types)
        if(!productType) {
            throw new Error(`The producer ${producer.ID} has not this product type`) 
        }
        
        productToBuy.Quantity += quantity,

        await ctx.stub.putState(productToBuy.ID, Buffer.from(JSON.stringify(productToBuy)))
        return productToBuy
    }

    checkAvailability(requiredType, types) {
        for(const type of types) {
            if(type.name === requiredType) return type
        }
        return
    }
}

module.exports = ProducerContract