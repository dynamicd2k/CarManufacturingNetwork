const express = require('express');
const app = express();
// const cors = require('cors');
const port = 3000;

// Import all function modules

const addToWallet = require('./1_addToWallet.js');
const registerCompany = require('./2_registerCompany.js');
const addcar = require('./3_addCar.js');
const createPO = require('./4_createPO.js');
const createShipment = require('./5_createShipment.js');
const updateShipment = require('./6_updateShipment.js');
const retailcar = require('./7_retailcar.js');
const viewHistory = require('./8_viewHistory.js');
const viewcarCurrentState = require('./9_viewCarCurrentState.js');

// Define Express app settings
// app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.set('title', 'carmanufacturing Network App');

app.get('/', (req, res) => res.send('Hello Manufacturer'));

app.post('/addToWallet', (req, res) => {
    addToWallet.execute(req.body.certificatePath, req.body.privateKeyPath, req.body.iL, req.body.id, req.body.org).then (() => {
        console.log('User Credentials added to wallet');
        const result = {
            status: 'success',
            message: 'User credentials added to wallet'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.post('/registerCompany', (req, res) => {
    registerCompany.execute(req.body.companyCRN, req.body.companyName, req.body.location, req.body.organisationRole).then (() => {
        console.log('Register New Company on the Network');
        const result = {
            status: 'success',
            message: 'Register New Company request submitted on the Network'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.post('/addcar', (req, res) => {
    addcar.execute(req.body.carName, req.body.serialNo, req.body.mfgDate, req.body.companyCRN, req.body.companyName).then (() => {
        console.log('Add car on the Network');
        const result = {
            status: 'success',
            message: 'Add car request submitted on the Network'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.post('/createPO', (req, res) => {
    createPO.execute(req.body.buyerCRN, req.body.sellerCRN, req.body.carName, req.body.serialNo).then (() => {
        console.log('Create PO on the Network');
        const result = {
            status: 'success',
            message: 'Create PO request submitted on the Network'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.post('/createShipment', (req, res) => {
    createShipment.execute(req.body.sellerCRN, req.body.buyerCRN, req.body.carName, req.body.serialNo, req.body.transporterCRN).then (() => {
        console.log('Create Shipment on the Network');
        const result = {
            status: 'success',
            message: 'Create Shipment request submitted on the Network'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.post('/updateShipment', (req, res) => {
    updateShipment.execute(req.body.buyerCRN, req.body.carName, req.body.serialNo).then (() => {
        console.log('Update Shipment on the Network');
        const result = {
            status: 'success',
            message: 'Update Shipment request submitted on the Network'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.post('/retailcar', (req, res) => {
    retailcar.execute(req.body.carName, req.body.serialNo, req.body.dealerCRN, req.body.customerAadhar).then (() => {
        console.log('Retail car on the Network');
        const result = {
            status: 'success',
            message: 'Retail car request submitted on the Network'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.get('/viewHistory', (req, res) => {
    viewHistory.execute(req.body.carName, req.body.serialNo).then (() => {
        console.log('View History on the Network');
        const result = {
            status: 'success',
            message: 'View History request submitted on the Network'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.get('/viewcarCurrentState', (req, res) => {
    viewcarCurrentState.execute(req.body.carName, req.body.serialNo).then (() => {
        console.log('View Current State of car on the Network');
        const result = {
            status: 'success',
            message: 'View Current State of car request submitted on the Network'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});


app.listen(port, () => console.log(`Distributed CAR Manufacturer App listening on port ${port}!`));



// const express = require('express');
// const app = express();
// const port = 7053;
// app.use(express.json()); // for parsing application/json
// app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// app.set('title', 'App');
// app.get('/', (req,res) => res.send('Hello world'));
// app.post('/sum', (req,res) => {
// // Printing the request submitted by the user on the console
// console.log(req.body);
// // Taking two numbers as input from user, storing them in keys x1 and x2 and calculating the sum
// var sum = Number(req.body.x1) + Number(req.body.x2);
// // Sending back the response
// res.send(sum.toString());
// });
// app.listen(port, () => console.log(`Listening on port ${port}!`));
