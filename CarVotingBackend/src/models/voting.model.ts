
import { Schema, model } from "mongoose";
import Joi from "joi";

const votingSchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            readonly: true
        },
        licence_plate: {
            type: String,
            required: true,
            unique: false
        },
        category: {
            type: String,
            ref: "Category",
            readonly: true
        },
        ip: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    { versionKey: false },
);



const votingModel = model("voting", votingSchema, "Voting");


export default {votingModel};