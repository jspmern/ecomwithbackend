import slugify from "slugify";
import productModel from "../model/productModel.js";
import catergoryModel from "../model/catergoryModel.js";
import {
  deleteImageFromCloudinary,
  uploadImageOnCloudinary,
} from "../helpers/cloudinaryHelper.js";
import mongoose from "mongoose";
import braintree from "braintree";
import orderModel from "../model/orderModel.js";

let gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.MERCHANT_ID,
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
});
//this is for creating the product by using multer and i am stroing in cloudinary (maybe from frontend it is not working in that case req.body replace with req.fields)
export let createProductController = async (req, res) => {
  let { name, quantity, price, description, category } = req.body;
  try {
    if (!name) {
      res.send({ message: "Name field is require" });
    }
    if (!quantity) {
      res.send({ message: "Quantity field is require" });
    }
    if (!price) {
      res.send({ message: "Price field is require" });
    }
    if (!description) {
      res.send({ message: "Description field is require" });
    }
    if (!category) {
      res.send({ message: "Category field is require" });
    }
    let images = 
    await uploadImageOnCloudinary(req.files);
    let productData = new productModel({
      name,
      quantity,
      price,
      description,
      category,
      images,
      slug: slugify(name),
    });
    let saveProduct = await productData.save();
    res.status(201).send({
      message: "Product created successfully",
      success: true,
      saveProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Somthing wrong while creating product",
      success: false,
      error,
    });
  }
};

//this is for the getproduct
export let getProductController = async (req, res) => {
  try {
    let data = await productModel
      .find({})
      .populate("category")
      .sort({ createdAt: -1 });
    res.send({
      message: "All Product",
      success: true,
      total_Count: data.length,
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Somthing wrong while Reading the data",
      success: false,
      error,
    });
  }
};
//this is for get single product
export let singleProductController = async (req, res) => {
  try {
    let { slug } = req.params;
    let product = await productModel.findOne({ slug }).populate("category");
    res
      .status(200)
      .send({ message: "Single Product is Fetched", success: true, product });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Somthing wrong while fetching data",
      error,
    });
  }
};

//this is for the getting the photo
export let imageHandlerController = async (req, res) => {
  try {
    let { pid } = req.params;
    let data = await productModel.find({ _id: pid }).select("images");
    if (!data) {
      res.status(200).send({ message: "No image is there", success: false });
    }
    res.status(200).send({ message: "Image Successfully Fetched", img: data });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Somthing wrong while fetching the image",
      success: false,
      error,
    });
  }
};

// this is for the delete product
export let deleteProductController = async (req, res) => {
  try {
    let { id } = req.params;
    let imageDoc = await productModel.findById({ _id: id });
    await deleteImageFromCloudinary(imageDoc);
    let product = await productModel
      .findByIdAndDelete({ _id: id })
      .select("-images");
    res
      .status(200)
      .send({ message: "Product delete successfully", success: true, product });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Somthing wrong while deleting",
      success: false,
      error,
    });
  }
};

//this is for the update product
export let updateProductController = async (req, res) => {
  try {
    let { name, quantity, price, description, category } = req.body;
    console.log("hello i am category", category);
    let { id } = req.params;
    if (!name) {
      return res.send({ message: "Name is require" });
    }
    if (!quantity) {
      return res.send({ message: "Quantity is require" });
    }
    if (!price) {
      return res.send({ message: "Price is require" });
    }
    if (!description) {
      return res.send({ message: "Description is require" });
    }
    if (!category) {
      return res.send({ message: "Category is require" });
    }
    let findData = await productModel.findById({ _id: id });
    //this is for destroying the image in cloud
    await deleteImageFromCloudinary(findData);
    //this is for the update image in cloudinary
    let images = await uploadImageOnCloudinary(req.files);
    let findDataforUpdate = await productModel
      .findByIdAndUpdate(
        { _id: id },
        { ...req.body, images, slug: slugify(req.body.name) },
        { new: true }
      )
      .select("-images");
    res.status(200).send({
      message: "Product Updated successfully",
      success: true,
      product: findDataforUpdate,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Somthing Error " });
  }
};
//this is for the product filteration
export let productFilterController = async (req, res) => {
  let { prices, checked } = req.body;
  try {
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (prices.length) args.price = { $gte: prices[0], $lte: prices[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, err, message: "Somthing wrong while filtering" });
  }
};

//this is for the product toatalCount
export let productTotalcountController = async (req, res) => {
  try {
    let total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      message: "All Product Count",
      success: true,
      total,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Somthing wrong while,couting the product",
      err,
      success: false,
    });
  }
};

//this is for the product according to the pagecount
export let perPageProductListController = async (req, res) => {
  try {
    let { page } = req.params;
    let pagePerCount = 6;
    let product = await productModel
      .find({})
      .skip((page - 1) * pagePerCount)
      .limit(pagePerCount)
      .sort({ createdAt: -1 });
    res.status(200).send({
      message: "All Product",
      success: true,
      total: product.length,
      product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Somthing wrong while,fetching the data",
      success: false,
      err,
    });
  }
};
//this is for the searching in the product
export let searchProductController = async (req, res) => {
  let { keyword } = req.params;
  try {
    let products = await productModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });
    res.send({
      message: "All Search Product",
      products,
      total: products.length,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Somthing wrong , while searching",
      success: false,
      err,
    });
  }
};

//this is for the similer product suggestion
export let similerProductController = async (req, res) => {
  let { p_id, c_id } = req.params;
  try {
    let product = await productModel
      .find({
        category: c_id,
        _id: { $ne: p_id },
      })
      .populate("category");
    res.status(200).send({
      message: "Similar Product",
      product,
      total: product.length,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Somthing wrong while fetching", success: false, err });
  }
};

//this is product according to category
export let categoryProductController = async (req, res) => {
  let { slug } = req.params;
  try {
    const category = await catergoryModel.findOne({ slug: slug });
    const products = await productModel.find({ category }).populate("category");
    res
      .status(200)
      .send({ success: true, message: "All Categories Product", products });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Somthing wrong , while fetching",
      err,
      success: false,
    });
  }
};

//payment
export let braintreeTokenController = async (req, res) => {
  gateway.clientToken.generate({}, (err, response) => {
    try {
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      res.status(501).send({
        success: false,
        message: "Somthing wrong while fetching token",
        err,
      });
    }
  });
};

export let brainTreePaymentController = async (req, res) => {
  try {
    let { nonce, cart } = req.body;
    let total_ammount = cart.reduce((acc, item) => {
      return acc + item.price;
    }, 0);
    gateway.transaction.sale(
      {
        amount: total_ammount,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: "somthing wrong while payment", err });
  }
};
