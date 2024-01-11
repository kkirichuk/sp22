"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const port = process.env.PORT || 3000;
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = process.env.DATABASE_URL || '';
        const client = new mongodb_1.MongoClient(url);
        yield client.connect();
        const database = client.db('Database');
        const positionCollection = database.collection('positions');
        // get endpoint, to fetch all data
        app.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const databaseResponse = yield positionCollection.find().toArray();
            res.json(databaseResponse);
        }));
        // post endpoint, to create/add a new entry
        app.post("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const obj = Object.assign(Object.assign({}, req.body), { updatedAt: new Date(), createdAt: new Date() });
            const result = yield positionCollection.insertOne(obj);
            res.json(result.insertedId);
        }));
        // put endpoint, to edit an specific entry
        app.put("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            let result = { modifiedCount: 0 };
            try {
                const obj = Object.assign(Object.assign({}, req.body), { updatedAt: new Date() });
                result = yield positionCollection.updateOne({ _id: new mongodb_1.ObjectId(req.params.id) }, { $set: obj });
            }
            catch (err) {
                console.error(err);
            }
            res.json(result.modifiedCount);
        }));
        // delete endpoint, to delete a specific entry
        app.delete("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            let result = { deletedCount: 0 };
            try {
                result = yield positionCollection.deleteOne({ _id: new mongodb_1.ObjectId(req.params.id) });
            }
            catch (err) {
                console.error(err);
            }
            return res.json(result.deletedCount);
        }));
        app.listen(port, () => {
            console.log(`[server]: Server is running at http://localhost:${port}`);
        });
    });
}
run();
