import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Luxel Flight Booking API',
            version: '1.0.0',
            description: 'API documentation for the Luxel Flight Booking platform. Features flight searching, user bookings, and agent dashboard management.',
            contact: {
                name: 'Luxel Support'
            }
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development Server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your Supabase JWT token'
                }
            }
        }
    },
    apis: [
        './src/routes/*.ts', 
        './src/controllers/*.ts',
        './dist/routes/*.js',
        './dist/controllers/*.js',
        './routes/*.js',
        './controllers/*.js'
    ]
};

export const specs = swaggerJsdoc(options);
