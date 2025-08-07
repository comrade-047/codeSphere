import Problem from "../models/problem.js";
import TestCase from "../models/testCase.js";
import mongoose from 'mongoose';

// controller for fetching problems
export const getAllProblems = async(req,res) =>{
    const {cursor, limit = 20, contest} = req.query;

    try{
        // changed for the contest problem 
        const now = new Date();
        const query = {};
        if (cursor) {
            if (mongoose.Types.ObjectId.isValid(cursor)) {
                query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
            } else {
                return res.status(400).json({ message: "Invalid cursor ID" });
            }
        }

        if (contest === 'true') {
            query.hiddenUntil = { $gt: now }; 
        } else {
            query.$or = [
                { hiddenUntil: null },
                { hiddenUntil: { $lt: now } }
            ];
        }

        const problems = await Problem.find(query)
            .sort({ _id: 1 })
            .limit(parseInt(limit));

        const nextCursor = problems.length > 0 ? problems[problems.length - 1]._id : null;
        
        res.status(200).json({
            problems,
            nextCursor,
            hasMore: problems.length === parseInt(limit)
        });
    } catch (err) {
        console.error("getAllProblems error:", err);
        return res.status(500).json({ message: "Failed to fetch problems", err });
    }
};


// controller for fetching problem by id 
export const getProblemBySlug = async(req,res) => {
    // console.log("Hit getProblembySlug");
    const {slug} = req.params;
    if(!slug){
        return res.status(400).json("Invalid query");
    }

    try{
        const problem = await Problem.findOne({slug});

        if(!problem){
            return res.status(404).json({message : "Problem not found"});
        }

        return res.status(200).json({
            problem
        });
    }
    catch(err){
        return res.status(500).json({message : "Error while fetching problem"});
    }
}


// for slugifying the problem name
const slugify = (text) => text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

// for adding problems in problemset 
export const addProblem = async(req, res) => {
    const {title, description, difficulty, tags, examples, inputFormat, outputFormat, testCases, hiddenUntil} = req.body;

    if (!title || !description || !difficulty) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try{
        const existing = await Problem.findOne({slug : slugify(title)});

        if(existing){
            return res.status(409).json({message : "Problem with same title already exists"});
        }

        const newProblem = await Problem.create({
            title,
            slug : slugify(title),
            description,
            difficulty,
            tags,
            examples,
            inputFormat,
            outputFormat,
            hiddenUntil,
            createdBy : req.user?._id
        });

        await newProblem.save();

        if(Array.isArray(testCases)){
            const testCaseDocs = testCases.map((tc) => ({
                problem: newProblem._id,
                input: tc.input,
                output: tc.output,
                hidden: tc.hidden || false,
            }));

            await TestCase.insertMany(testCaseDocs);
        }

        return res.status(201).json({
            message : "Problem and test cases added successfully",
            newProblem
        });
    }
    catch(err){
        return res.status(500).json({message : "Server error", error : err.message});
    }

}