import mongoose from "mongoose";

const discussionPostSchema = new mongoose.Schema({
    thread : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'DiscussionThread',
        required : true
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    content : {
        type : String,
        required : true
    },
    parentPost : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'DiscussionPost',
        default : null,
    }
}, {timestamps : true});

export default mongoose.model('DiscussionPost', discussionPostSchema);
