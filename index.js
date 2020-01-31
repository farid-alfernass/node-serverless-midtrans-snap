const midtransClient = require('midtrans-client');

exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    let isProduction = false, serverKey = process.env.SERVER_KEY, clientKey = process.env.CLIENT_KEY;
    if (event.isProduction !== null && event.isProduction === true){
        isProduction = true;
        serverKey = process.env.SERVER_KEY_PRODUCTION;
        clientKey = process.env.CLIENT_KEY_PRODUCTION;

    }
    let snap = new midtransClient.Snap({
        isProduction : isProduction,
        serverKey : serverKey,
        clientKey : clientKey
    });

    console.log("request: " + JSON.stringify(event));

    if (event == null && event === undefined) {
        const responseBody = {
            message: "please send params"
        };
        const response = {
            statusCode: 500,
            headers: {
                "Content-Type" : "application/json"
            },
            body: responseBody
        };
        return response
    }

    // let params = JSON.parse(event.body)
    delete event[isProduction];
    let parameter = event;

    let trans = await snap.createTransaction(parameter)
        .then((transaction)=>{

            const response = {
                statusCode: 200,
                body: transaction,
            };
            return response;
        })
        .catch((e)=>{
            const responseBody = {
                message: e.message,
                response: e.ApiResponse,
            };
            const response = {
                statusCode: e.httpStatusCode,
                headers: {
                    "Content-Type" : "application/json"
                },
                body: responseBody
            };
            return response
        });

    return trans;
};
