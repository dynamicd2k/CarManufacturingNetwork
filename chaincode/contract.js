'use strict';

const {Contract} = require('fabric-contract-api');

class carmanufacturingContract extends Contract {

    constructor() {
        //Provide a custom name ot refer to thsi contract
        super('org.carmanufacturing-network.com-carnet');
        global.manufacturerOrg= 'manufacturer.carmanufacturing-network.com';
        global.dealerOrg= 'dealer.carmanufacturing-network.com';
        global.consumerOrg= 'consumer.carmanufacturing-network.com';
        global.transporterOrg= 'transporter.carmanufacturing-network.com';
    }

    validateInitiator(ctx, initiator){

        const initiatorID = ctx.clientIdentity.getX509Certificate();
        console.log(initiator);
        if(initiatorID.issuer.organizationName.trim() !== initiator){
            throw new Error('Not authorized to initiate the transaction: ' + initiatorID.issuer.organizationName + ' not authorised to initiate this transaction');
        }
    }
    /* ****** All custom functions are defined below ***** */
	
	// This is a basic user defined function used at the time of instantiating the smart contract
	// to print the success message on console
    async instantiate(ctx) {
		console.log('carmanufacturingnet Smart Contract Instantiated');
    }
    
    /**
	 * Create a register company function to register a new company on the network
	 * @param ctx - The transaction Context object
	 * @param companyCRN - CRN of the company to be registered
	 * @param companyName - Company Name
	 * @param location - Company Location
	 * @param organisationRole - Role of organisation
	 */
    async registerCompany(ctx, companyCRN, companyName, location, organisationRole){

        const companyKey =  ctx.stub.createCompositeKey('org.carmanufacturing-network.com.company',[companyCRN,companyName]);

        let companyObject={
            companyId: companyKey,
            name: companyName,
            location: location,
            organisationRole: organisationRole,
            createdAt: new Date()
        };

        let dataBuffer = Buffer.from(JSON.stringify(companyObject));
        await ctx.stub.putState(companyKey, dataBuffer);

        return companyObject;
    }

    /**
	 * Create a function to add a car on the network
	 * @param ctx - The transaction Context object
	 * @param carName - Name of the car model
	 * @param carSerialNo - Serial Number of the car
	 * @param carMfgDate - Manufacturing Date of the car
	 * @param companyCRN - Car Manufacturing company's CRN
     * @param companyName- Car manufacturing company name
	 */

    async createCar(ctx, carName, carSerialNo, carMfgDate, manufacturerCRN){

        this.validateInitiator(ctx, manufacturerOrg);

        const carKey = ctx.stub.createCompositeKey('org.carmanufacturing-network.com.car',[carName,carSerialNo]);
        const ownerKey = ctx.stub.createCompositeKey('org.carmanufacturing-network.com.owner',[manufacturerCRN]);

        let carObject={
            productId: carKey,
            name: carName,
            manufacturer: companyKey,
            manufacturingDate: carMfgDate,
            owner:ownerKey,
            state: 'CREATED',
            createdAt:new Date()
        };

        let dataBuffer = Buffer.from(JSON.stringify(carObject));
        await ctx.stub.putState(carKey, dataBuffer);
        return carObject;
    }

    /**
	 * Create a function to create a PO from dealer
	 * @param ctx - The transaction Context object
	 * @param carName - Name of the car
	 * @param carSerialNo - Serial Number of the car
	 * @param dealerCRN - Buyer CRN 
     * @param manufacturerCRN - Seller CRN
	 */
    async createPO(ctx, dealerCRN, manufacturerCRN, carName, carSerialNo){

        this.validateInitiator(ctx, dealerOrg);

        const poKey = ctx.stub.createCompositeKey('org.carmanufacturing-network.com.po',[dealerCRN,carName,carSerialNo]);
        const buyerKey = ctx.stub.createCompositeKey('org.carmanufacturing-network.com.company',[dealerCRN,carName,carSerialNo]);
        const sellerKey = ctx.stub.createCompositeKey('org.carmanufacturing-network.com.company',[manufacturerCRN,carName,carSerialNo]);
        const carKey = ctx.stub.createCompositeKey('org.carmanufacturing-network.com.car',[carName,carSerialNo]);
        
        let poObject ={
            poId: poKey,
            carName: carName,
            quantity: quantity,
            buyer: buyerKey,
            seller: sellerKey,
            createdAt: new Date()
        }

        let dataBuffer = Buffer.from(JSON.stringify(poObject));

        await ctx.stub.putState(poKey, dataBuffer);

        return poObject;

    }

     /**
	 * Create a function to create a shipment
	 * @param ctx - The transaction Context object
     * @param manufacturerCRN - Manufacturer CRN
     * @param dealerCRN - Dealer CRN
	 * @param carName - Name of the car
	 * @param carSerialNo = Serial No of car
     * @param transporterCRN - Transporter CRN
	 */
    async createShipment(ctx, manufacturerCRN, dealerCRN, carName, carSerialNo, transporterCRN){

        this.validateInitiator(ctx, manufacturerOrg);

        const shipmentKey = ctx.stub.createCompositeKey('org.carmanufacturing-network.com.shipment',[dealerCRN,carName,carSerialNo]);
        const poKey = ctx.stub.createCompositeKey('org.carmanufacturing-network.com.po',[dealerCRN,carName,carSerialNo]);

        let shipmentObject={
                    shipmentId:shipmentKey,
                    creator:manufacturerCRN,
                    carName: carName,
                    carSerialNo: carSerialNo,
                    transporter: transporterCRN,
                    poId: poKey,
                    status: 'in-transit'
                };

                let dataBuffer= Buffer.from(JSON.stringify(shipmentObject));

                await ctx.stub.putState(shipmentKey,dataBuffer);
        
        return shipmentObject;
    }

     /**
	 * Create a function to update a shipment
	 * @param ctx - The transaction Context object
     * @param dealerCRN = Dealer CRN
	 * @param carName - Name of the car
	 * @param carSerialNo = Serial No of car
	 */
    async updateShipment(ctx, dealerCRN, carName, carSerialNo){

        this.validateInitiator(ctx, dealerOrg);

        //Update Shipment object
        const shipmentKey= ctx.stub.createCompositeKey('org.carmanufacturing-network.com.shipment',[dealerCRN,carName,carSerialNo]);

        let shipmentBuffer = await ctx.stub.getState(shipmentKey).catch(err=>console.log(err));

        let shipmentObject = JSON.parse(shipmentBuffer.toString());

        shipmentObject.status = 'Delivered to dealer';

        let dataBuffer= Buffer.from(JSON.stringify(shipmentObject));

        await ctx.stub.putState(shipmentKey,dataBuffer);

        //Update car owner object

        const carKey = ctx.stub.createCompositeKey('org.carmanufacturing-network.com.car',[carName,carSerialNo]);

        let carBuffer = await ctx.stub.getState(carKey).catch(err=>console.log(err));

        let carObject = JSON.parse(carBuffer.toString());

        const ownerKey = ctx.stub.createCompositeKey('org.carmanufacturing-network.com.owner',[dealerCRN]);

        carObject.owner= ownerKey;
        carObject.state= 'READY_FOR_SALE';

        await ctx.stub.putState(carKey, carObject);

        return carObject;
    }

    /**
	 * Create a function to retail car
	 * @param ctx - The transaction Context object
	 * @param carName - Name of the car
	 * @param carSerialNo - Serial No of car
	 * @param dealerCRN - CRN of dealer
     * @param customerAdhaar - Adhaar number of customer car is to be sold to.
	 */
    async retailcar(ctx, carName, carSerialNo, dealerCRN, customerAdhaar){

        this.validateInitiator(ctx, dealerOrg);

        const carKey = ctx.stub.createCompositeKey('org.carmanufacturing-network.com.car',[carName,carSerialNo]);

        let carBuffer = await ctx.stub.getState(carKey).catch(err=>console.log(err));

        let carObject = JSON.parse(carBuffer.toString());

        const ownerKey = ctx.stub.createCompositeKey('org.carmanufacturing-network.com.owner',[dealerCRN]);

        if(carObject.owner !== ownerKey){
            throw new Error('dealer not authorized to retail the car');
        }

        else
        carObject.owner = customerAdhaar;
        carObject.state = 'SOLD';

        await ctx.stub.putState(carKey, Buffer.from(JSON.stringify(carObject)));

        return carObject;

    }
     /**
	 * Create a function to view History of car
	 * @param ctx - The transaction Context object
	 * @param carName - Name of the car
	 * @param serialNo - Serial No of car
	 */

    async viewHistory(ctx, carName, carSerialNo){

		const carKey = ctx.stub.createCompositeKey('org.carmanufacturing-network.com.car',[carName,carSerialNo]);

		let history = await ctx.stub.getHistoryForKey(carKey).catch(err=>console.log(err));

		let results = await this.getAllResults(history);

		return results;
	}

     /**
	 * Create a function to view current state of car
	 * @param ctx - The transaction Context object
	 * @param carName - Name of the car
	 * @param serialNo - Serial No of car
	 */
	async viewcarCurrentState(ctx, carName, carSerialNo){

		const carKey = ctx.stub.createCompositeKey('org.carmanufacturing-network.com.car',[carName,carSerialNo]);

		let carBuffer = await ctx.stub.getState(carKey).catch(err=>console.log(err));

		let carObject = JSON.parse(carBuffer.toString());

		return carObject;
	}

    async getAllResults(iterator) {
		const allResults = [];
		while (true) {
		  const res = await iterator.next();
   
		  if (res.value) {
			// if not a getHistoryForKey iterator then key is contained in res.value.key
			allResults.push(res.value.value.toString('utf8'));
		  }
   
		  // check to see if we have reached then end
		  if (res.done) {
			// explicitly close the iterator
			await iterator.close();
			return allResults;
		  }
		}
	   }
}
module.exports = carmanufacturingContract;