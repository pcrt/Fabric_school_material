'use strict';

const { Contract } = require('fabric-contract-api')

class ShopContract extends Contract {

    async initLedger(ctx) {
        console.info('============= SHOP CONTRACT INIT METHOD CALL ===========')
    }

    /** TODO - transactions */

}

module.exports = ShopContract