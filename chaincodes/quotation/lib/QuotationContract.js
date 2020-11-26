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
            },
            /** example of quotation in created state (intermediate state): 
             *  the SupplierA has provided the quotation 
             **/
            {
                ID: 'quotation2',
                type: 't-shirt',
                price: 250,
                issuer: 'SupplierA',
                quantity: 100,
                state: 'created'
            },
            /** example of quotation in accepted state (final state): 
             *  the Agency has accepted the quotation of SupplierB
             **/
            { 
                ID: 'quotation3',
                type: 'jeans',
                price: 150,
                issuer: 'SupplierB',
                quantity: 20,
                state: 'accepted'
            },
            /** example of quotation in accepted state (final state): 
             *  the Agency has rejected the quotation of SupplierA
             **/
            {
                ID: 'quotation4',
                type: 'gloves',
                price: 200,
                issuer: 'SupplierA',
                quantity: 10,
                state: 'rejected'
            }
        ]

        for(const quotation of quotations) {
            await ctx.stub.putState(quotation.ID, Buffer.from(JSON.stringify(quotation)))
            console.info(`Quotation ${quotation.ID} initialized`)
        }
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
        ctx.stub.putState(id, Buffer.from(JSON.stringify(quotation)))
        return JSON.stringify(quotation)
    }

}

module.exports = QuotationContract