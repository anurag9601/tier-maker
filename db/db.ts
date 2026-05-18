import mongoose, { connections } from "mongoose"

interface I {
    isConnected?: boolean,
    connectionId?: number
};

const dbConnection: I = {};

async function connectMongoDB() {

    if (dbConnection.isConnected === true && dbConnection.connectionId) {
        console.log("Mongodb is already connected.");
        return;
    };

    const connectionString = process.env.MONGODB_CONN as string;

    await mongoose.connect(connectionString).then((connection) => {
        const connectionId = connection.connections[0].id;

        dbConnection.isConnected = true;
        dbConnection.connectionId = connectionId;
    }).catch((error) => {
        console.log("Error while connectiong mongodb", error);
    });
};

export default connectMongoDB;