'use strict';

/**
 * This is a Node.JS application to Approve a New User on the Network
 */

const helper = require('./contractHelper');

/*var args = process.argv.slice(2);
*/

async function main(carName, serialNo, mfgDate, companyCRN) {

	try {
		const carnetContract = await helper.getContractInstance();

		
		console.log('.....Requesting to Add New car on the Network');
		const newcarBuffer = await carnetContract.submitTransaction('createCar', carName, serialNo, mfgDate, companyCRN);

		// process response
		console.log('.....Processing Add New car Transaction Response \n\n');
		let newcar= JSON.parse(newcarBuffer.toString());
		console.log(newcar);
		console.log('\n\n.....Add New car Transaction Completed!');
		return newcar;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {

		// Disconnect from the fabric gateway
		helper.disconnect();

	}
}

module.exports.execute = main;
