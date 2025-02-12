import { Request, Response, Router } from "express";
import mongoose from "mongoose";

import categoriesModel from "../models/categories.model";




export default class categoryController {
    public router = Router();
    public categoryModel = categoriesModel.categoryModel;

    constructor() {

        this.router.get("/category", async (req, res, next) => {
            this.GetCategory(req, res).catch(next);
        });

        this.router.post("/category", (req, res, next) => {
            this.NewCategory(req, res).catch(next);
        });

        this.router.put("/category/:id", async (req, res, next) => {
            this.UpdateCategory(req, res).catch(next);
        });


    }

    private NewCategory = async (req: Request, res: Response) => {
        const body = req.body;
        const { error } = categoriesModel.validate(body);
        if (error) {
            res.status(400).send({ message: error.details[0].message });
            return;
        }
        try {
            body["_id"] = new mongoose.Types.ObjectId();

            const newCategory = new this.categoryModel(body);
            await newCategory.save();
            res.send({ message: "OK" });
        } catch (error: any) {
            res.status(400).send({ message: error.message });
        }
    }

    private UpdateCategory = async (req: Request, res: Response) => {
        const body = req.body;
        const id = req.query.id;
        const category = await this.categoryModel.findOne({ _id: id });
        if (category) {
            await this.categoryModel.replaceOne({ _id: id }, category, { runValidators: true });
            res.send({ message: "OK" });
        } else {
            res.status(404).send({ message: "Category not found!" });
        }
    };

    private GetCategory = async (req: Request, res: Response) => {
        const category = await this.categoryModel.find();
        if (category) {
            res.send({ data: category, count: category.length });
        } else {
            res.status(404).send({ message: "Category not found!" });
        }
    };
}