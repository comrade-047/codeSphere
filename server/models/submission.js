import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    problem : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Problem',
        required : true,
    },
    languages : {
        type : String,
        enum : ['python', 'cpp', 'java', 'js'],
        required : true,
    },
    code : {
        type : String,
        required : true,
    },
    verdict : {
        type : String,
        enum : ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Memory Limit Exceeded', 'Runtime Error', 'Compilation Error'],
        required : true,
    },
    testResults : [
        {
            input: String,
            expectedOutput: String,
            actualOutput: String,
            passed: Boolean,
            error: String,
        }
    ],
    executionTime : Number, // in ms
    memoryUsed : Number , // in MB
}, {timestamps : true});

export default mongoose.model('Submission',submissionSchema);