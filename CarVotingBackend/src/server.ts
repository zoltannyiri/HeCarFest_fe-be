import App from "./app";

import dotenv from "dotenv";
import categoryController from "./controllers/categories.controller";
import votingController from "./controllers/voting.controller";
dotenv.config();


new App([new categoryController(), new votingController()]);  
