const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide product name"],
    maxlength: 100,
  },
  price: {
    type: Number,
    required: [true, "Please provide product price"],
    maxlength: 5,
  },
  description: {
    type: String,
    required: [true, "Please provide product description"],
    maxlength: 150,
  },
  photos: [
    {
      id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please select a category"],
    enum: {
      values: ["short", "long", "sweatshirt", "hoodies"],
      message: "please select a category",
    },
  },
  brand:{
    type: String,
    required: [true, "Please add a brand"]
  },

  rating:{
    type: Number,
    default:0
  },
  numberOfReviews:{
    type:Number,
    default:0
  },
    reviews:[
        {
            user:{
                type: mongoose.Schema.ObjectId,
                ref:'User',
                required: true
            },
            name:{
                type:String,
                required:true,
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required: true,
    },

    createdAt:{
        type:Date,
        default:Date.now,
    }
});


module.exports  = mongoose.model("Product",productSchema);