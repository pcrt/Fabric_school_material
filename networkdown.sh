#!/bin/bash

# Remove hyperledger docker containers
function clearContainers() {
  CONTAINER_IDS=$(docker ps -a | awk '($2 ~ /hyperledger.*/) {print $1}')
  if [ -z "$CONTAINER_IDS" ] || [ "$CONTAINER_IDS" == " " ]; then
    echo "---- No containers available for deletion ----"
  else
    docker rm -f $CONTAINER_IDS
  fi
}

# Delete all unused docker volumes
function removeVolumes() {
  echo
  echo "Your current volumes:"
  docker volume ls
  echo
  echo "WARNING! Skip this command if you have your volumes"
  docker volume prune
}

# Delete all unused docker networks
function removeNetwork() {
  echo
  echo "Your current networks:"
  docker network ls
  echo
  echo "WARNING! Skip this command if you have your networks"
  docker network prune
}

# Tear down running network
function networkDown() {
    # stop containers
    docker-compose -f $COMPOSE_FILE_BASE down --volumes --remove-orphans
    #Delete any ledger backups
    docker run -v $PWD/test-network:/tmp/test-network --rm hyperledger/fabric-tools:$IMAGETAG rm -Rf /tmp/test-network/ledgers-backup

    #Cleanup the chaincode containers
    clearContainers
    #Cleanup volumes
    removeVolumes
    #Cleanup network
    removeNetwork

    # remove orderer block and other channel configuration transactions and certs
    rm -rf test-network/system-genesis-block/*.block 
    rm -rf test-network/organizations/peerOrganizations 
    rm -rf test-network/organizations/ordererOrganizations

    # remove channel and script artifacts
    rm -rf test-network/channel-artifacts test-network/log.txt
}

# default image tag
IMAGETAG="latest"
# use this as the default docker-compose yaml definition
COMPOSE_FILE_BASE=test-network/docker/docker-compose-test-net.yaml

networkDown
exit 0
