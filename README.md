# Fabric_school_material

Bootstrapping Network
-------------------------------------------------------------------------------
For bootstrapping the network ( if is the first time we launch the toolchain )
```bash
sudo ./bootstrap.sh
```
To starting network
```bash
cd test_network/
sudo ./networks.sh
sudo ./networks.sh up createChannels
```
To deploy contracts
```bash
cd test_network/
sudo ./netowrk.sh deployCCs
sudo ./netowrk.sh deployInvoke
```
To upgrade the contract without restarting the init function ( changing the version is mandatory )
```bash
cd test_network/
sudo ./network.sh deployCCs -v 2 -s 2 -i “NA”
```

Launch Application
--------------------------------------------------------------------------------
To launch the application 
```bash
cd application/
npm install
npm start
```
if you want to use automated client offer on channel 1
```bash
cd application/
sudo node client1.js --id suppliera --org suppliera.quotation.com --msp SupplierAMSP --ch quotationchannel1
```
if you want to use automated client offer on channel 2
```bash
cd application/
sudo node client1.js --id supplierb --org supplierb.quotation.com --msp SupplierBMSP --ch quotationchannel2
```

