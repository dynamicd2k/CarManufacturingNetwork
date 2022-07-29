cryptogen generate --config=./crypto-config.yaml

configtxgen -profile OrdererGenesis -channelID chainyard-sys-channel -outputBlock ./channel-artifacts/genesis.block

configtxgen -profile carmanufacturingChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID chainyard-sys-channel

configtxgen -profile carmanufacturingChannel -outputAnchorPeersUpdate ./channel-artifacts/manufacturerMSPanchors.tx -channelID car-man-channel -asOrg manufacturerMSP

configtxgen -profile carmanufacturingChannel -outputAnchorPeersUpdate ./channel-artifacts/dealerMSPanchors.tx -channelID car-man-channel -asOrg dealerMSP

configtxgen -profile carmanufacturingChannel -outputAnchorPeersUpdate ./channel-artifacts/transporterMSPanchors.tx -channelID car-man-channel -asOrg transporterMSP 

configtxgen -profile carmanufacturingChannel -outputAnchorPeersUpdate ./channel-artifacts/consumerMSPanchors.tx -channelID car-man-channel -asOrg consumerMSP						

docker-compose -f ./docker-compose.yml up -d