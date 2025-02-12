
import { Schema, model } from "mongoose";
import Joi from "joi";

const categorySchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            readonly: true
        },
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }

    },
    { versionKey: false },
);

const validate = (message: object): Joi.ValidationResult => {
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string()
    });
    return schema.validate(message);
};

const categoryModel = model("category", categorySchema, "Categories");


export default {categoryModel, validate};