require('dotenv').config();
const Hapi = require('@hapi/hapi');
const routes = require('../server/route.js');
const loadModel = require('../services/loadModel.js');
const InputError = require('../exceptions/inputError.js');

const init = async () => {
    const server = Hapi.server({
        host: 'localhost',
        port: 8080,
        routes: {
            cors: {
              origin: ['*'],
            },
        },
    });
    
    // Load model
    const model = await loadModel();
    server.app.model = model;
    // Server route
    server.route(routes);

    server.ext('onPreResponse', function (request, h) {
        const response = request.response;

        if (response instanceof InputError) {
             const newResponse = h.response({
                 status: 'fail',
                 message: `${response.message} Silakan gunakan foto lain.`
             })
             newResponse.code(response.statusCode)
             return newResponse;
        }
        if (response.isBoom) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message
            })
            newResponse.code(response.statusCode)
            return newResponse;
        }
        return h.continue;
    });

    await server.start();

    console.log(`Server start at: ${server.info.uri}`);
};

init();