'use strict';

/**
 * This is a Node.JS application to Approve a New User on the Network
 */

const helper = require('./contractHelper');

/*var args = process.argv.slice(2);
*/

async function main(carName, serialNo) {

	try {
		const carnetContract = await helper.getContractInstance();

		
		console.log('.....Requesting to View current state of a car on the Network');
		const newStateBuffer = await carnetContract.submitTransaction('viewcarCurrentState', carName, serialNo);

		// process response
		console.log('.....Processing View current state of a car Transaction Response \n\n');
		let newState= JSON.parse(newStateBuffer.toString());
		console.log(newState);
		console.log('\n\n.....View current state of a car Transaction Completed!');
		return newState;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {

		// Disconnect from the fabric gateway
		helper.disconnect();

	}
}

module.exports.execute = main;
