
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
            unique: true //ez is új!!!
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

//ez is új!!!
const getCategories = async () => {
    try {
      const categories = await categoryModel.find({}, '_id name')
        .sort({ date: -1 });
      
      if (!categories || categories.length === 0) {
        // Ha nincsenek kategóriák, létrehozzuk az alapértelmezett kategóriákat
        const defaultCategories = [
          { _id: '66fe967fdc782b1e24ede2b8', name: 'Legszebb autó' },
          { _id: '66fe9694dc782b1e24ede2ba', name: 'Legmacsósabb autó' },
          { _id: '66fe969bdc782b1e24ede2bc', name: 'Legcsajosabb autó' }
        ];
        
        await categoryModel.insertMany(defaultCategories);
        return defaultCategories;
      }
      
      return categories;
    } catch (error) {
      console.error('Hiba a kategóriák lekérésénél:', error);
      throw error;
    }
  };

const validate = (message: object): Joi.ValidationResult => {
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string()
    });
    return schema.validate(message);
};

const categoryModel = model("category", categorySchema, "Categories");


export default {categoryModel, validate};

