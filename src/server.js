const app = require('./app');
const { connectAllPublishers } = require('./events');

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Initialize connections before accepting web traffic
        await connectAllPublishers();
        
        app.listen(PORT, () => {
            console.log(`Server started at port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to connect to Kafka:', err);
        process.exit(1);
    }
}

startServer();