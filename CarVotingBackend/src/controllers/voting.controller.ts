import { Request, Response, Router } from "express";
import mongoose from "mongoose";

import votingModel from "../models/voting.model";




export default class votingController {
    public router = Router();
    public votingModel = votingModel.votingModel;

    constructor() {

        this.router.get("/votings", async (req, res, next) => {
            this.GetVotings(req, res).catch(next);
        });

        this.router.post("/voting/:category", async (req, res, next) => {
            this.Voting(req, res).catch(next);
        });


    }

    private Voting = async (req: Request, res: Response) => {
        const body = req.body;
        const category_id = body.category;
        console.log(req.query);
        const hasip = await this.votingModel.findOne({ ip: req.headers['x-forwarded-for']?.toString().split(',')[0] || req.ip || req.connection.remoteAddress});
        if (category_id && (!hasip || hasip.category !== category_id)) {
            try {
                body["_id"] = new mongoose.Types.ObjectId();
                body["category"] = category_id;
                body["ip"] = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.ip || req.connection.remoteAddress;
                await this.votingModel.create(body);
                res.send({ message: "OK" });
            } catch (error: any) {
                res.status(400).send({ message: error.message });
            }
        } else {
            res.status(404).send({ message: "Category not found!" });
        }
    };

    private GetVotings = async (req: Request, res: Response) => {
        const votings = await this.votingModel.aggregate(
            [
                {
                    $group: {
                        _id: "$category",
                        count: { $sum: 1 }
                    }
                }
            ]
        );
        if (votings) {
            res.send(votings);
        } else {
            res.status(404).send({ message: "Votings not found!" });
        }
    };
}