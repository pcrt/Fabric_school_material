'use strict';

const { Contract } = require('fabric-contract-api')

class QuotationContract extends Contract {

	async initLedger(ctx) {
        const quotations = [
            /** example of quotation in requested state (initial state): 
             *  the Agency has requested a quotation 
             **/
            {
                ID: 'quotation1',
                type: 'shoes', 
                price: null,
                issuer: null,
                quantity: 100,
                state: 'requested'
            }
            /**
             * Other examples: 
             * created state (intermediate state): 
             * the SupplierA has provided the quotation 
             *
             * accepted state (final state): 
             * the Agency has accepted the quotation of SupplierB
             *
             * accepted state (final state): 
             *  the Agency has rejected the quotation of SupplierA
             **/
        ]

        for(const quotation of quotations) {
            const key = ctx.stub.createCompositeKey('quotations', [quotation.ID, quotation.type])
            await ctx.stub.putState(key, Buffer.from(JSON.stringify(quotation)))
            console.info(`INFO: Quotation ${quotation.ID} initialized`)
        }
    }

    async getQuotations(ctx, type) {
        const iterator = await ctx.stub.getStateByPartialCompositeKey('quotations', [type])
        const data = await this.getAllResults(iterator)
        console.log("PIPPOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
        console.log(data)
        return data
    }

    /** tx submitter: Agency */
    async requestQuotation(ctx, id, type, quantity) {
        const quotation = {
            ID: id,
            type: type,
            price: null,
            issuer: null,
            quantity: quantity,
            state: 'requested'
        }
        const key = ctx.stub.createCompositeKey('quotations', [quotation.ID, quotation.type])
        ctx.stub.putState(key, Buffer.from(JSON.stringify(quotation)))
        return JSON.stringify(quotation)
    }

    async getAllResults(iterator) {
        const allResults = []
        while (true) {
            const res = await iterator.next()
            if (res.value) {
                // if not a getHistoryForKey iterator then key is contained in res.value.key
                allResults.push(res.value.value.toString('utf8'))
            }
    
            // check to see if we have reached then end
            if (res.done) {
                // explicitly close the iterator            
                await iterator.close()
                return allResults
            }
        }
    }

}

module.exports = QuotationContract