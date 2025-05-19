import mongoose from "mongoose";

const connectMongoDB = async() => {
    try {
        await mongoose.connect(process.env.URI_MONGODB);
        console.log("Conectado con MongoDB!");
    } catch (error) {
        console.log("Error al conectar con MongoDB");
    }
}


//Link de conexion a la DB
//mongodb+srv://cristogu:cristogu21@cluster0.n2wyf2x.mongodb.net/myEcommerce?retryWrites=true&w=majority&appName=Cluster0

export default connectMongoDB;
