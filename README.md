Chainyard Car Manufacturing Demo:

To setup the network please install following prerequisites and follow the commands:

Prerequisites:

1. Hyperledger Fabric Binaries
2. Docker for contanerisation of images
3. NPM and Node framework
4. Postman or ARC to test the API endpoints

Once prerequisites are met, follow the document as below.

1. Install Hyeperledger Fabric binaries required to setup and run the network:

    To perform this, we will move to network subfolder in our project dir using command: cd network

2. Download & Install Fabric binaries from given url: 

    curl -sSL https://bit.ly/2ysbOFE | bash -s

    Point the binaries to execution context $PATH:

    export PATH= ~/network/fabric-samples/bin:$PATH

3. Go one level up in directory tree using command: 'cd..' to come to the parent directory.

    Run following command to automatically generate cryptomaterials for Orgs and crypto-configuration files for OrdererOrgs and PeerOrgs:

    sh fabric.sh

    This will setup and run containers from the fabric binary images and Org volumes generated in crypto-configuration folder.

Next tasks are to:

1. ssh into the cli container:

    docker exec -it cli /bin/bash 

2. create channel:

    peer channel create -o orderer.carmanufacturing-network.com:7050 -c car-man-channel -f ./channel-artifacts/channel.tx

3. add peers to the channel:

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

Once all peers join the channel, we ssh into the chaincode container and run the Node API backend:

1. ssh into chaincode container:

    docker exec -it chaincode /bin/bash					

2. Install npm dependencies:

    npm install

    Run the node application in development mode:

    npm run start-dev

Now we will install chaincode on peer containers.

1. ssh into the cli container:

    docker exec -it cli /bin/bash 

2. Point to the maunfacturer peer0:

    CORE_PEER_LOCALMSPID="manufacturerMSP"
    CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.carmanufacturing-network.com/users/Admin@manufacturer.carmanufacturing-network.com/msp
    CORE_PEER_ADDRESS=peer0.manufacturer.carmanufacturing-network.com:7051

3. Install chaincode on peer0 of manufacturer:

    peer chaincode install -n carnet -v 1.0 -l node -p /opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/

4. Once chaincode is installed on peer0 of manufacturer, we instantiate the network instance from peer0 of manufacturer to call  chaincode commands:
					
    peer chaincode instantiate -o orderer.carmanufacturing-network.com:7050 -C car-man-channel -n carnet -l node -v 1.0 -c '{"Args":["org.carmanufacturing-network.com-carnet:instantiate"]}' -P "OR('manufacturerMSP.member')"	

—--------------------------------—------------------------------------—--------------------------------—-------------------------

To Call backend APIs, open Postamn and import the postman collection: Car-Network.postman_collection.json

Steps to call backend APIs to interact with Chaincode:

1. In addToWallet API, key certificatePath and privateKeyPath should be assigned the certificate path value and privateKeyPath value of the peer that we want to call the chaincode function from, in this case, we use manufacturer peer.

Once added, a POST call on addToWallet API will update the peer credentials.

2. Calling RegisterCompany-1, RegisterCompany-2 & RegisterCompany-3 APIs will add manufacturer , dealer and transporterdetails to the network.

3. Calling AddCar will create an entry for a car manufactured.

4. Calling createPO and createShipment will raise a PO and create a shipment request respectively.

5. Once the car is delivered to dealer, dealer calls updateShipment to set the Car State from 'CREATED' to 'READY_FOR_SALE'.

6. A dealer can then call reatilsCar API to update the Car State to 'SOLD' and owner of the car as the Customer Adhaar number.

Note: The Postman collection can be run to automatically execute the above described API functions.

