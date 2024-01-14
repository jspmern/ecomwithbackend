import mongoose from "mongoose";
let productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    price: {
      type: Number,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    images: [
      {
        url: {
          type: String,
        },
        public_id: {
          type: String,
        },
      }
    ],
    shipping: {
      type: Boolean,
      require: true,
      default:'yes'
    },
    quantity:{
        type:Number,
        require:true
    },
    category: {
        type: mongoose.ObjectId,
        ref: "category",
        required: true,
      },
  },
  { timestamps: true }
);

export default mongoose.model('Product',productSchema)