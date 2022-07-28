
export PATH=/Users/rogueguy/Chainyard/network/fabric-samples/bin:$PATH
cryptogen generate --config=./crypto-config.yaml
configtxgen -profile OrdererGenesis -channelID chainyard-sys-channel -outputBlock ./channel-artifacts/genesis.block
configtxgen -profile carmanufacturingChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID chainyard-sys-channel

configtxgen -profile carmanufacturingChannel -outputAnchorPeersUpdate ./channel-artifacts/manufacturerMSPanchors.tx -channelID car-man-channel -asOrg manufacturerMSP

configtxgen -profile carmanufacturingChannel -outputAnchorPeersUpdate ./channel-artifacts/dealerMSPanchors.tx -channelID car-man-channel -asOrg dealerMSP

configtxgen -profile carmanufacturingChannel -outputAnchorPeersUpdate ./channel-artifacts/transporterMSPanchors.tx -channelID car-man-channel -asOrg transporterMSP 
configtxgen -profile carmanufacturingChannel -outputAnchorPeersUpdate ./channel-artifacts/consumerMSPanchors.tx -channelID car-man-channel -asOrg consumerMSP						
docker-compose -f ./docker-compose.yml up -d
docker exec -it cli /bin/bash 
peer channel create -o orderer.carmanufacturing-network.com:7050 -c car-man-channel -f ./channel-artifacts/channel.tx
CORE_PEER_LOCALMSPID="manufacturerMSP"
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.carmanufacturing-network.com/users/Admin@manufacturer.carmanufacturing-network.com/msp
CORE_PEER_ADDRESS=peer0.manufacturer.carmanufacturing-network.com:7051
peer channel join -b car-man-channel.block
CORE_PEER_ADDRESS=peer1.manufacturer.carmanufacturing-network.com:8051
peer channel join -b car-man-channel.block
CORE_PEER_LOCALMSPID="transporterMSP"
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/transporter.carmanufacturing-network.com/users/Admin@transporter.carmanufacturing-network.com/msp
CORE_PEER_ADDRESS=peer0.transporter.carmanufacturing-network.com:13051
peer channel join -b car-man-channel.block
CORE_PEER_ADDRESS=peer1.transporter.carmanufacturing-network.com:14051
peer channel join -b car-man-channel.block
CORE_PEER_LOCALMSPID="dealerMSP"
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/dealer.carmanufacturing-network.com/users/Admin@dealer.carmanufacturing-network.com/msp
CORE_PEER_ADDRESS=peer0.dealer.carmanufacturing-network.com:9051
peer channel join -b car-man-channel.block
CORE_PEER_ADDRESS=peer1.dealer.carmanufacturing-network.com:10051
peer channel join -b car-man-channel.block
CORE_PEER_LOCALMSPID="consumerMSP"
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/consumer.carmanufacturing-network.com/users/Admin@consumer.carmanufacturing-network.com/msp
CORE_PEER_ADDRESS=peer0.consumer.carmanufacturing-network.com:11051
peer channel join -b car-man-channel.block
CORE_PEER_ADDRESS=peer1.consumer.carmanufacturing-network.com:12051
peer channel join -b car-man-channel.block						
docker exec -it chaincode /bin/bash					
npm install
npm run start-dev						
Installing chaincode using Install command on chaincode container:		
docker exec -it cli /bin/bash 
CORE_PEER_LOCALMSPID="manufacturerMSP"
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.carmanufacturing-network.com/users/Admin@manufacturer.carmanufacturing-network.com/msp
CORE_PEER_ADDRESS=peer0.manufacturer.carmanufacturing-network.com:7051
peer chaincode install -n carnet -v 1.0 -l node -p /opt/gopath/src/github.com/hyperledger/fabric/ peer/chaincode/ 					
Invoke:						
peer chaincode instantiate -o orderer.carmanufacturing-network.com:7050 -C car-man-channel -n carnet -l node -v 1.0 -c '{"Args":["org.carmanufacturing-network.com-carnet:instantiate"]}' -P "OR('manufacturerMSP.member')"	
_______—------------------------------------________________________—--------------------------------	