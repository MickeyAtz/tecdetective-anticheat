import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Tec Detective API',
            version: '1.0.0',
            description: 'API para el monitoreo de exámenes - ITJMM',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    // fíjate en los corchetes [] aquí abajo
    apis: ['./routes/*.js'],
};

export const swaggerDocs = swaggerJsDoc(swaggerOptions);
export { swaggerUi };
