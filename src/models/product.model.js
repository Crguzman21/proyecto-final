import mongoose from "mongoose";
import  paginate  from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
    title: { type: String, unique: true, required: true }, 
    description: { type: String, index: "text", required: true }, 
    code: { type: String, required: true }, 
    price: { type: Number, required: true }, 
    stock: { type: Number, required: true }, 
    category: { type: String, index: true, required: true },
    thumbnail: { type: String, required: false }, 

    status: {
        type: Boolean,
        default: true,
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
}); 

productSchema.plugin(paginate);

const Product = mongoose.model("Product", productSchema);

export default Product;