import slugify from "slugify";
import productModel from "../model/productModel.js";
import {
  deleteImageFromCloudinary,
  uploadImageOnCloudinary,
} from "../helpers/cloudinaryHelper.js";
//this is for creating the product by using multer and i am stroing in cloudinary (maybe from frontend it is not working in that case req.body replace with req.fields)
export let createProductController = async (req, res) => {
  let { name, quantity, price, description, category } = req.body;
  let images = [];
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
    let images = await uploadImageOnCloudinary(req.files);
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
      .select("-images")
      .limit(12)
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
    let product = await productModel
      .findOne({ slug })
      .select("-images")
      .populate("category");
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
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Somthing Error " });
  }

  let { name, quantity, price, description, category } = req.body;
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
    .findByIdAndDelete(
      { _id: id },
      { ...req.body, images, slug: slugify(req.body.name) },
      { new: true }
    )
    .select("-images");
  res
    .status(200)
    .send({
      message: "Product Updated successfully",
      success: true,
      product: findDataforUpdate,
    });
};
