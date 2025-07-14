import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        unique : true,
        trim : true,
    },
    slug : {
        type : String,
        required : true,
        unique : true,
    },
    description : {
        type : String,
        required : true,
    },
    difficulty : {
        type : String,
        enum : ['Easy', 'Medium', "Hard"],
        required : true,
    },
    tags : {
        type : [String],
        default : []
    },
    examples : [
        {
            input : {
                type : String
            },
            output : {
                type : String
            },
            explaination : {
                type : String
            }
        }
    ],
    inputFormat : {
        type : String,
    },
    outputFormat : {
        type : String,
    },
    testCases : [
        {
            input : {
                type : String,
                required : true 
            },
            output : {
                type : String,
                required : true
            },
            hidden : {
                type : Boolean,
                default : false
            }
        }
    ],
    timeLimit : {
        type : Number, // milliseconds
        default : 1000,
    },
    memoryLimit : {
        type : Number, // in MB
        default : 256
    },
    submissions : {
        type : Number,
        default : 0
    },
    successfulSubmissions : {
        type : Number,
        default : 0,
    }, 
    acceptanceRate : {
        type : Number,
        default : 0,
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    }
}, {timestamps : true});

export default mongoose.model('Problem', problemSchema);