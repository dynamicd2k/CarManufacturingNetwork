'use strict';

/**
 * This is a Node.JS application to Approve a New User on the Network
 */

const helper = require('./contractHelper');

/*var args = process.argv.slice(2);
*/

async function main(buyerCRN, carName, serialNo) {

	try {
		const carnetContract = await helper.getContractInstance();

		
		console.log('.....Requesting to Update a Shipment on the Network');
		const newShipmentUpdateBuffer = await carnetContract.submitTransaction('updateShipment', buyerCRN, carName, serialNo);

		// process response
		console.log('.....Processing Update Shipment Transaction Response \n\n');
		let newShipmentUpdate= JSON.parse(newShipmentUpdateBuffer.toString());
		console.log(newShipmentUpdate);
		console.log('\n\n.....Update Shipment Transaction Completed!');
		return newShipmentUpdate;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {

		// Disconnect from the fabric gateway
		helper.disconnect();

	}
}

module.exports.execute = main;
