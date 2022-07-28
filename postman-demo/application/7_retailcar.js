'use strict';

/**
 * This is a Node.JS application to Approve a New User on the Network
 */

const helper = require('./contractHelper');

/*var args = process.argv.slice(2);
*/

async function main(carName, serialNo, dealerCRN, customerAadhar) {

	try {
		const carnetContract = await helper.getContractInstance();

		
		console.log('.....Requesting to Retail a car on the Network');
		const newRetailcarBuffer = await carnetContract.submitTransaction('retailcar', carName, serialNo, dealerCRN, customerAadhar);

		// process response
		console.log('.....Processing Retail car Transaction Response \n\n');
		let newRetailcar= JSON.parse(newRetailcarBuffer.toString());
		console.log(newRetailcar);
		console.log('\n\n.....Update Retail car Transaction Completed!');
		return newRetailcar;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {

		// Disconnect from the fabric gateway
		helper.disconnect();

	}
}

module.exports.execute = main;
