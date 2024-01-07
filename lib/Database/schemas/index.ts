import mongoose from "mongoose";

const TestSchema = mongoose.model('test', new mongoose.Schema({
    name: { type: String, default: "Hello world" },
    age: { type: Number, min: 18, index: true },
    bio: { type: String, match: /[a-z]/ },
    date: { type: Date, default: Date.now },
}));

export { TestSchema } 