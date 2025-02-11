import express from 'express';
import cors from "cors";
import mongoose from "mongoose";

export default class App {
    public app: express.Application;

    private mongoUrl: string = process.env.MONGO_DB_URL ?? "mongodb+srv://hecarfest:admin@cluster0.0rvby.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    constructor(controllers: any[]) {
        this.app = express();
        this.app.use(express.json());
        this.app.use(cors());

        this.connectToTheDatabase().then(() => {
            this.listen()
        });

        controllers.forEach(controller => {
            this.app.use("/api", controller.router);
        });

    }

    public listen(): void {
        this.app.listen(8000, () => {
            console.log("The application is available on port 8000!");
        })
    }

    private async connectToTheDatabase() {
        mongoose.set("strictQuery", true);
        try {
            await mongoose.connect(this.mongoUrl ?? "", { connectTimeoutMS: 10000 });
        } catch (error: any) {
            console.log({ message: error.message });
          }

    }
}
