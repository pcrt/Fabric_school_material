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

requestQuotation() {
  # 1 = SupplierA, 2 = SupplierB, 3 = Agency
  setGlobals 3

  local ORDERER=localhost:7050
  local PEER0_ORG1=localhost:7051   # SupplierA
  local PEER0_ORG3=localhost:11051  # Agency
  local NAME_CC=quotation
  local CHANNEL="quotationchannel1"
  local TX='{"Args":["requestQuotation","quotation2","jeans","25"]}'
  
  set -x
  peer chaincode invoke -o $ORDERER --tls true --cafile $ORDERER_CA -C $CHANNEL -n $NAME_CC --peerAddresses $PEER0_ORG1 --tlsRootCertFiles $PEER0_ORG1_CA --peerAddresses $PEER0_ORG3 --tlsRootCertFiles $PEER0_ORG3_CA -c $TX
  res=$?
  { set +x; } 2>/dev/null
  cat log.txt
  verifyResult $res "invoke transaction 'requestQuotation' has failed"
  successln "invoke transaction 'requestQuotation' success"
}

getQuotation(){
  # 1 = SupplierA, 2 = SupplierB, 3 = Agency
  IDENTITY=$1
  CHANNEL=$2
  setGlobals ${IDENTITY}
  
  local ORDERER=localhost:7050
  local PEER0_ORG3=localhost:11051  # Agency
  local NAME_CC=quotation
  local CHANNEL="quotationchannel"${CHANNEL}
  local TX='{"Args":["getQuotation","quotation1"]}'
	set -x
  
  case $1 in
  1)
  	local PEER0_ORG1=localhost:7051   # SupplierB 7051 per suppliera 9051 per B
  	peer chaincode invoke -o $ORDERER --tls true --cafile $ORDERER_CA -C $CHANNEL -n $NAME_CC --peerAddresses $PEER0_ORG1 --tlsRootCertFiles $PEER0_ORG1_CA --peerAddresses $PEER0_ORG3 --tlsRootCertFiles $PEER0_ORG3_CA -c $TX;;
  2)
  	local PEER0_ORG2=localhost:9051   # SupplierB 7051 per suppliera 9051 per B
  	peer chaincode invoke -o $ORDERER --tls true --cafile $ORDERER_CA -C $CHANNEL -n $NAME_CC --peerAddresses $PEER0_ORG2 --tlsRootCertFiles $PEER0_ORG2_CA --peerAddresses $PEER0_ORG3 --tlsRootCertFiles $PEER0_ORG3_CA -c $TX;;
   esac
   res=$?
  { set +x; } 2>/dev/null
  cat log.txt
  verifyResult $res "invoke transaction 'getQuotations' has failed"
  successln "invoke transaction 'getQuotation' success"
}

provideQuotation(){
setGlobals 1

  local ORDERER=localhost:7050
  local PEER0_ORG1=localhost:7051   # SupplierA
  local PEER0_ORG3=localhost:11051  # Agency
  local NAME_CC=quotation
  local CHANNEL="quotationchannel1"
  local TX='{"Args":["provideQuotation","quotation1","500"]}'
	set -x
  peer chaincode invoke -o $ORDERER --tls true --cafile $ORDERER_CA -C $CHANNEL -n $NAME_CC --peerAddresses $PEER0_ORG1 --tlsRootCertFiles $PEER0_ORG1_CA --peerAddresses $PEER0_ORG3 --tlsRootCertFiles $PEER0_ORG3_CA -c $TX
  res=$?
  { set +x; } 2>/dev/null
  cat log.txt
  verifyResult $res "invoke transaction 'getQuotations' has failed"
  successln "invoke transaction 'provideQuotation' success"
}

acceptQuotation(){

# 1 = SupplierA, 2 = SupplierB, 3 = Agency
setGlobals 3

  local ORDERER=localhost:7050
  local PEER0_ORG1=localhost:7051   # SupplierA
  local PEER0_ORG3=localhost:11051  # Agency
  local NAME_CC=quotation
  local CHANNEL="quotationchannel1"
  local TX='{"Args":["acceptQuotation","quotation1","accepted"]}'
	set -x
  peer chaincode invoke -o $ORDERER --tls true --cafile $ORDERER_CA -C $CHANNEL -n $NAME_CC --peerAddresses $PEER0_ORG1 --tlsRootCertFiles $PEER0_ORG1_CA --peerAddresses $PEER0_ORG3 --tlsRootCertFiles $PEER0_ORG3_CA -c $TX
  res=$?
  { set +x; } 2>/dev/null
  cat log.txt
  verifyResult $res "invoke transaction 'accept' has failed"
  successln "invoke transaction 'accept' success"
}


#getQuotation

#getQuotation
#provideQuotation
acceptQuotation
getQuotation 1 1
getQuotation 2 2
#requestQuotation
#getQuotation


exit 0
