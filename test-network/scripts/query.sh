#!/bin/bash

# import utils
. scripts/envVar.sh

ORDERER=orderer.shopping.com:7050
ORDERER_DOM=orderer.shopping.com
CHANNEL=shoppingchannel

################################################################### TODO #####################################################

# producer contract v.1
makeQuotationByShop() {
    # 1 = Customer
    # 2 = Shop
    # 3 = Producer
    setGlobals 2
    local FIXED = /opt/gopath/src/github.com/hyperledger/fabric/peer/organizations
    peer chaincode invoke -o $ORDERER --tls true --cafile $FIXED/ordererOrganizations/shopping.com/orderers/$ORDERER_DOM/msp/tlscacerts/tlsca.shopping.com-cert.pem -C $CHANNEL -n producer --peerAddresses peer0.customer.shopping.com:7051 --tlsRootCertFiles $FIXED/peerOrganizations/customer.shopping.com/peers/peer0.customer.shopping.com/tls/ca.crt --peerAddresses peer0.shop.shopping.com:9051 --tlsRootCertFiles $FIXED/peerOrganizations/shop.shopping.com/peers/peer0.shop.shopping.com/tls/ca.crt --peerAddresses peer0.producer.shopping.com:11051 --tlsRootCertFiles $FIXED/peerOrganizations/producer.shopping.com/peers/peer0.producer.shopping.com/tls/ca.crt -c '{"Args":["makeQuotation","Shoes","10"]}'
}

requestQuotationByShop() {
    # 1 = Customer
    # 2 = Shop
    # 3 = Producer
    setGlobals 2



}

verifyResult() {
  if [ $1 -ne 0 ]; then
    echo "!!!!!!!!!!!!!!! "$2" !!!!!!!!!!!!!!!!"
    echo
    exit 1
  fi
}