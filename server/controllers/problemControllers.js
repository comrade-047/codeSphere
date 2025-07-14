import Problem from "../models/problem.js";

// controller for fetching problems
export const getAllProblems = async(req,res) =>{
    const {cursor, limit = 20} = req.query;

    try{
        const query = cursor ? {_id : {$lt: cursor}} : {};

        const problems = await Problem.find(query).sort({_id : -1}).limit(parseInt(limit)); // getting the problems within a limit for pagination

        const nextCursor = problems.length > 0 ? problems[problems.length - 1]._id : null;
        
        res.status(200).json({
            problems,
            nextCursor,
            hasMore : problems.length == parseInt(limit)
        });
    }
    catch(err){
        return res.status(500).json({message : "Failed to fetch problems", err});
    }
}

// controller for fetching problem by id 
export const getProblemBySlug = async(req,res) => {
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
    const {title, description, difficulty, tags, testCases} = req.body;

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
            testCases
        });

        await newProblem.save();
        return res.status(201).json({
            message : "Problem added successfully",
            newProblem
        });
    }
    catch(err){
        return res.status(500).json({message : "Server error", error : err.message});
    }

}