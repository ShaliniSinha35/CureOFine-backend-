const crypto = require('crypto');
const axios = require('axios');

// const {salt_key, merchant_id} = require("./secret")
const salt_key = "96434309-7796-489d-8924-ab56988a6076";
const merchant_id = "PGTESTPAYUAT86";

// Function to initiate a new payment
const newPayment = async (req, res) => {
    console.log(req.body)
    try {
        const merchantTransactionId = req.body.transactionId;
        const data = {
            merchantId: merchant_id,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: req.body.MUID,
            name: req.body.name,
            amount: req.body.amount * 100, 
            redirectUrl: `https://cureofine.com/api/api/api/status/${merchantTransactionId}`,
            redirectMode: 'POST',
            mobileNumber: req.body.mobile,
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };

        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString('base64');
        const keyIndex = 1;
        const string = payloadMain + '/pg/v1/pay' + salt_key;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + keyIndex;

        const prod_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
        const options = {
            method: 'POST',
            url: prod_URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            data: {
                request: payloadMain
            }
        };

        const response = await axios.request(options);
        console.log("Payment Initiated Response:", response.data);
        
        if (response.data.success) {
            res.json({
                message: "Payment Initiated",
                result: response.data.data.instrumentResponse.redirectInfo.url,
                merchantId: response.data.data.merchantId,
                transactionId: response.data.data.merchantTransactionId
            });
        } else {
            res.status(400).json({
                message: "Payment initiation failed",
                error: response.data.message
            });
        }
    } catch (error) {
        console.error("Error initiating payment:", error);
        res.status(500).send({
            message: error.message,
            success: false
        });
    }
};

// Function to check the status of a payment

const checkStatus = async (req, res) => {
    const merchantTransactionId = req.params.txnId;
    console.log("Checking status for transaction:", merchantTransactionId);

    const keyIndex = 1;
    const string = `/pg/v1/status/${merchant_id}/${merchantTransactionId}` + salt_key;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + "###" + keyIndex;

    const options = {
        method: 'GET',
        url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchant_id}/${merchantTransactionId}`,
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': merchant_id
        }
    };

    try {
        const response = await axios.request(options);
        console.log("PhonePe Status Response:", response.data);
        console.log(response.data.success)

        if (response.data.success) {
            res.json({ status: 'success', message: 'Payment successful', paymentStatus: 'success' });
        } else {
            res.json({ status: 'failure', message: 'Payment failed', paymentStatus: 'failure' });
        }
    } catch (error) {
        console.error("PhonePe Status API Error:", error.message);
        res.status(500).json({ status: 'error', message: 'Internal server error', paymentStatus: 'error' });
    }
};


module.exports = {
    newPayment,
    checkStatus
};
