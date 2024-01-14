import catergoryModel from "../model/catergoryModel.js";
import slugify from "slugify";

//this is for creating category
export let createCategoryController = async (req, res) => {
  try {
    let { name } = req.body;
    if (!name) {
      return res.status(500).send({ message: "Name fileld is required" });
    }
    //check existing category
    let existingCategory = await catergoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        message: "Category is already existing",
        success: false,
      });
    }
    //if it is not existing then create category
    let newCategory = await new catergoryModel({
      name,
      slug: slugify(name),
    }).save();
    res
      .status(201)
      .send({ message: "Category is created", success: true, newCategory });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in category",
      success: false,
      error,
    });
  }
};
//this is for update category
export let updateCategoryController = async (req, res) => {
  try {
    let { name } = req.body;
    let { id } = req.params;
    if (!name) {
      return res.send({ message: "Name field is required" });
    }
    let findData = await catergoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res
      .status(200)
      .send({
        message: "Category is successfully updated",
        success: true,
        findData,
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Somthing Wrong", success: false, error });
  }
};
//this is for the getAll category
export let getAllCategoryController = async (req, res) => {
  try {
    let findData = await catergoryModel.find({});
    res
      .status(200)
      .send({ message: "All category", success: true, category: findData });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        message: "Somthing wrong while fetching the data",
        success: false,
        error,
      });
  }
};

//this is for the single category
export let singleCategoryController = async (req, res) => {
  try {
    let { slug } = req.params;
    let detailsCategory = await catergoryModel.findOne({ slug });
    res
      .status(200)
      .send({
        message: "successfully getting the category",
        success: true,
        detailsCategory,
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Somthing Error while getting category" });
  }
};

//this is for the delete category
export let deleteCategoryController = async (req, res) => {
  try {
    let { id } = req.params;
    let updateData = await catergoryModel.findByIdAndDelete(id);
    res
      .status(200)
      .send({ message: "Category deleted Successfully", success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        message: "Somthing wrong while deleting category",
        success: false,
        error,
      });
  }
};
