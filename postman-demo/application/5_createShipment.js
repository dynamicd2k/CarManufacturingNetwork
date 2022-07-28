'use strict';

/**
 * This is a Node.JS application to Approve a New User on the Network
 */

const helper = require('./contractHelper');

/*var args = process.argv.slice(2);
*/

async function main(sellerCRN ,buyerCRN, carName, serialNo, transporterCRN) {

	try {
		const carnetContract = await helper.getContractInstance();

		
		console.log('.....Requesting to create a New Shipment on the Network');
		const newShipmentBuffer = await carnetContract.submitTransaction('createShipment', sellerCRN, buyerCRN, carName, serialNo, transporterCRN);

		// process response
		console.log('.....Processing Create New Shipment Transaction Response \n\n');
		let newShipment= JSON.parse(newShipmentBuffer.toString());
		console.log(newShipment);
		console.log('\n\n.....Create New Shipment Transaction Completed!');
		return newShipment;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {

		// Disconnect from the fabric gateway
		helper.disconnect();

	}
}

module.exports.execute = main;
