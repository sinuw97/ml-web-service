const predictClassification = require('../services/inferenceService.js');
const { getAllHistories } = require('../services/loadData.js');
const storeData = require('../services/storeData.js');
const crypto = require('crypto');

async function postPredictHandler(request, h) {
    try {
        const { image } = request.payload;
        const { model } = request.server.app;

        if (image.length > 1000000) {
            return h.response({
                status: 'fail',
                message: 'Payload content length greater than maximum allowed: 1000000'
            }).code(413); 
        }
    
        const { label, suggestion } = await predictClassification(model, image);
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const data = {
            "id": id,
            "result": label,
            "suggestion": suggestion,
            "createdAt": createdAt
        };

        await storeData(id, data);

        return h.response({
            status: 'success',
            message: 'Model is predicted successfully',
            data
        }).code(201);

    } catch (error) {
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan dalam melakukan prediksi',
            error: error.message
        }).code(400);
    }
}

async function getHistoriesHandler(request, h) {
    try {
        const histories = await getAllHistories();

        if (histories.length === 0) {
            return h.response({
                status: 'success',
                data: [], 
            }).code(200);
        }

        return h.response({
            status: 'success',
            data: histories
        }).code(200);

    } catch (error) {
        console.error('Error fetching prediction histories:', error);
        return h.response({
            status: 'fail',
            message: 'Failed to fetch prediction histories.'
        }).code(500);
    }
}
module.exports = { postPredictHandler, getHistoriesHandler};