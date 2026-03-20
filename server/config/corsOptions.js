const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT'],
    credentials: true,
};

export default corsOptions;
