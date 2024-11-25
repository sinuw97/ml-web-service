const { postPredictHandler, getHistoriesHandler} = require('../server/handler.js');

const routes = [
    {
        method: 'POST',
        path: '/predict',
        handler: postPredictHandler,
        options: {
            payload: {
                // allow data gambar
                allow: 'multipart/form-data',
                multipart: true,
                maxBytes: 10000000,
            }
        }
    },
    {
        method: 'GET',
        path: '/predict/histories',
        handler: getHistoriesHandler
    },
    {
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return h.response({
                status: 'success',
                message: 'Hello'
            })
        }
    }
]

module.exports = routes;