import mongoose from "mongoose";

const discussionThreadSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        unique : true
    },
    content : {
        type : String,
        required : true,
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    problem : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Problem',
        default : null,
    },
    replyCount : {
        type : Number,
        default : 0
    },
    lastActivity : {
        type : Date,
        default : Date.now,
    }
}, {timestamps : true});


export default mongoose.model('DiscussionThread', discussionThreadSchema);