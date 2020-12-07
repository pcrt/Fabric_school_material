const { Wallets, DefaultEventHandlerStrategies, Gateway } = require('fabric-network')
const path = require('path')
const fs = require('fs');
const yaml = require('js-yaml');
const fixtures = path.resolve(__dirname, '/../test-network');
const { v4: uuidv4 } = require('uuid');


const identity = 'Agency'
//Paths in the code are relative to the folder of the fabric tutorial
const walletPath = path.resolve(__dirname, `/home/winterschool20/Desktop/Winter_school/Fabric_school_material/test-network/${identity}/wallet`)

let finalConnection = {}
let contract = {}
class test {

    constructor() {}
    //method for creating the identity related to an organization interacting with the network
    static async createIdentity() {
        try {
           
            //create new wallet
            const wallet = await Wallets.newFileSystemWallet(walletPath)
            //get identity from wallet
            const userExists = await wallet.get(identity)
            if (userExists) {
                console.log(`WARN: An identity for the client user "${identity}" already exists in the wallet`)
            }
            //get credentials (certificate and private key) from the peer organization folder
            const credPath = '/home/winterschool20/Desktop/Winter_school/Fabric_school_material/test-network/organizations/peerOrganizations/agency.quotation.com/users/User1@agency.quotation.com'
            const certificate = fs.readFileSync(path.join(credPath, '/msp/signcerts/User1@agency.quotation.com-cert.pem')).toString();
            const privateKey = fs.readFileSync(path.join(credPath, '/msp/keystore/priv_sk')).toString();
            
            const identityWallet = {
                credentials: { certificate, privateKey },
                mspId: 'AgencyMSP',
                type: 'X.509'
            }
            console.log("first function ok")

            await wallet.put(identity, identityWallet)
        } catch (err) {
            console.log(err)
        }
    }
    
    //Method for creating the connection with the blockchain
    static async createConnection(){
        try {
           
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            //get the connection profile file
            const connOrg1Path = '/home/winterschool20/Desktop/Winter_school/Fabric_school_material/test-network/organizations/peerOrganizations/agency.quotation.com/connection-org3.yaml'
            let connectionProfile = yaml.safeLoad(fs.readFileSync(connOrg1Path, 'utf8'));
            //create connection option object
            let connectionOptions = {
                identity: identity,
                wallet: wallet,
                discovery: { enabled: true, asLocalhost: true },
                eventHandlerOptions: {
                // if strategy set to null, it will not wait for any commit events to be received from peers
                    strategy: DefaultEventHandlerStrategies.MSPID_SCOPE_ALLFORTX
                }
            };
    
            
           // save connection profile and option in global object 
           // global.ConnectionProfiles[connectionID] = { connectionProfile, connectionOptions };
           finalConnection = { connectionProfile, connectionOptions }
            console.log("tutto ok seconda funzione")

        } catch (err) {
            console.log(err)
        }
    }
    
    //method for sending a transaction 
    static async submitT(){
            try {
            
                //array containing the parameters to pass to the smart contract function
                let transactionParams = ['quotation1']
                //connect to the gateway to access the blockchain
                const gateway = new Gateway();
                
                //const conn = global.ConnectionProfiles[connectionID];
                const conn = finalConnection
                await gateway.connect(conn.connectionProfile, conn.connectionOptions);
                
                //get and connect to the channel where the caincode is deployed
                const network = await gateway.getNetwork('quotationchannel1');
                //get the smart contract from the network
                contract = await network.getContract('quotation');
                let resp = null
                let listener = async (event) => {
		
			const asset = JSON.parse(event.payload.toString());
			
			console.log(`-- Contract Event Received: ${event.eventName} - ${JSON.stringify(asset.data)}`);
			
			console.log(`*** Event: ${event.eventName}:${asset.ID}`);
			
			const eventTransaction = event.getTransactionEvent();
			console.log(`*** transaction: ${eventTransaction.transactionId} status:${eventTransaction.status}`);
		
			const eventBlock = eventTransaction.getBlockEvent();
			console.log(`*** block: ${eventBlock.blockNumber.toString()}`);
		};
		// now start the client side event service and register the listener
		console.log(`--> Start contract event stream to peer in Org1`);
		await contract.addContractListener(listener);
		//test query
            	const resultBuffer = await contract.evaluateTransaction('getQuotation','quotation1');
            	
            	console.log(JSON.parse(resultBuffer.toString('utf8')));
       	 //submit transaction
                if(!transactionParams || transactionParams === '')
                    resp = await contract.submitTransaction('getQuotation');
                else
                    resp = await contract.submitTransaction('getQuotation', transactionParams);
                
                gateway.disconnect();
                console.log(resp.toString())
                contract.removeContractListener(listener);
        
            } catch (err) {
                console.log(err)
            }
    }

}

const main = async () => {
    try {
        await test.createIdentity()
        await test.createConnection()
        await test.submitT()
    } catch (error) {
        console.log(error)
    }
  

  //  await test.createConnection()
}
main()




