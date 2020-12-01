#!/bin/bash

# import utils
source scripts/utils.sh
source scripts/envVar.sh
export FABRIC_CFG_PATH=${PWD}/../config

requestQuotationAgencyToSupplierA() {
  # 1 = SupplierA, 2 = SupplierB, 3 = Agency
  setGlobals 3
  local ORDERER=localhost:7050
  local PEER0_ORG1=localhost:7051   # SupplierA
  local PEER0_ORG3=localhost:11051  # Agency
  local NAME_CC=quotation
  local CHANNEL="quotationchannel1"
  local TX='{"Args":["requestQuotation","quotation2","jeans","5"]}'
  
  set -x
  peer chaincode invoke -o $ORDERER --tls true --cafile $ORDERER_CA -C $CHANNEL -n $NAME_CC --peerAddresses $PEER0_ORG1 --tlsRootCertFiles $PEER0_ORG1_CA --peerAddresses $PEER0_ORG3 --tlsRootCertFiles $PEER0_ORG3_CA -c $TX
  res=$?
  { set +x; } 2>/dev/null
  cat log.txt
  verifyResult $res "invoke transaction 'requestQuotation' has failed"
  successln "invoke transaction 'requestQuotation' success"
}

getQuotations() {
  # 1 = SupplierA, 2 = SupplierB, 3 = Agency
  setGlobals 3

  local ORDERER=localhost:7050
  local PEER0_ORG1=localhost:7051   # SupplierA
  local PEER0_ORG3=localhost:11051  # Agency
  local NAME_CC=quotation
  local CHANNEL="quotationchannel1"
  local TX='{"Args":["getQuotations","jeans"]}'
  
  set -x
  peer chaincode invoke -o $ORDERER --tls true --cafile $ORDERER_CA -C $CHANNEL -n $NAME_CC --peerAddresses $PEER0_ORG1 --tlsRootCertFiles $PEER0_ORG1_CA --peerAddresses $PEER0_ORG3 --tlsRootCertFiles $PEER0_ORG3_CA -c $TX
  res=$?
  { set +x; } 2>/dev/null
  cat log.txt
  verifyResult $res "invoke transaction 'getQuotations' has failed"
  successln "invoke transaction 'getQuotations' success"
}

# CALLL YOUR METHODS :

# examples
# requestQuotationAgencyToSupplierA
# getQuotations

exit 0