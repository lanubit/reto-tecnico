'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.save = (event, context, callback) => {
    const requestBody = JSON.parse(event.body);
    const brandName = requestBody.brandName;
    const modelName = requestBody.modelName;
    const manufacturing = requestBody.manufacturing;

    saveVehicle(vehicleInfo(brandName, modelName, manufacturing))
        .then(res => {
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    message: `Sucessfully  ${modelName}`,
                    candidateId: res.id
                })
            });
        })
        .catch(err => {
            console.log(err);
            callback(null, {
                statusCode: 500,
                body: JSON.stringify({
                    message: `ERROR ${modelName}`
                })
            })
        });
};


const saveVehicle = vehicle => {
    console.log('Submitting vehicle');
    const vehicleInfo = {
        TableName: process.env.VEHICLE_TABLE,
        Item: vehicle,
    };
    return dynamoDb.put(vehicleInfo).promise()
        .then(res => vehicle);
};

const vehicleInfo = (brandName, email, experience) => {
    const timestamp = new Date().getTime();
    return {
        id: uuid.v1(),
        brand: brandName,
        email: email,
        experience: experience,
        submittedAt: timestamp,
        updatedAt: timestamp,
    };
};
