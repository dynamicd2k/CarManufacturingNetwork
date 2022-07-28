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

		
		console.log('.....Requesting to View History of car on the Network');
		const newHistoryBuffer = await carnetContract.submitTransaction('viewHistory', carName, serialNo);

		// process response
		console.log('.....Processing View History of car Transaction Response \n\n');
		let newHistory= JSON.parse(newHistoryBuffer.toString());
		console.log(newHistory);
		console.log('\n\n.....View History of car Transaction Completed!');
		return newHistory;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {

		// Disconnect from the fabric gateway
		helper.disconnect();

	}
}

module.exports.execute = main;
