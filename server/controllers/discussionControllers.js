import discussionPost from "../models/discussionPost.js";
import discussionThread from "../models/discussionThread.js";

export const createThread = async(req, res) => {
    const {title, content, problemId} = req.body;

    if(!title || !content){
        return res.status(400).json({message : 'Title and content not found'});
    }

    try {
        const newThread = new discussionThread({
            title,
            content,
            author : req.user.id,
            problem : problemId || null
        })
        await newThread.save();
        
        return res.status(201).json(newThread);
    }
    catch(err){
        return res.status(500).json({message : 'Error while creating thread', error : err.message});
    }
}


export const getThreads = async(req, res) => {
    const {problemId} = req.query;

    try {
        const filter = {};
        if(problemId){
            filter.problem = problemId;
        }
        else {
            filter.problem = null;
        }

        const threads = await discussionThread.find(filter)
                        .populate('author','username profilePicUrl')
                        .sort({lastActivity : - 1});

        return res.status(200).json(threads);
    }
    catch(err){
        return res.status(500).json({message : 'Server error while fetching posts', error : err.message});
    }
}


export const getThreadsWithPosts = async(req, res) => {
    const {threadId} = req.params;

    try{
        const thread = await discussionThread.findById(threadId)
                            .populate('author','username profilePicUrl');
        
        if(!thread){
            return res.status(400).json({message : 'Discussion thread not found'});
        }

        const posts = await discussionPost.find({thread : threadId})
                            .populate('author', 'username profilePicUrl')
                            .sort({createdAt : 1});
        
        return res.status(200).json({thread, posts});
    }
    catch(err){
        return res.status(500).json({message : 'Error while fetching thread details', error : err.message});
    }
}

export const createPostInThread = async(req, res) => {
    const {threadId} = req.params;
    const {content} = req.body;

    if(!content){
        return res.status(400).json({message : 'Content is required for a reply'});
    }
    
    try{
        const thread = await discussionThread.findById(threadId);
        if(!thread){
            return res.status(404).json({message : 'Discussion thread not found'});
        }

        const newPost = new discussionPost({
            thread : threadId,
            content,
            author : req.user.id
        });

        await newPost.save();

        thread.lastActivity = new Date();
        thread.replyCount += 1;
        await thread.save();

        const populatedPost = await discussionPost.findById(newPost._id)
                                    .populate('author', 'username profilePicUrl');

        return res.status(201).json(populatedPost);
    }
    catch(err){
        return res.status(500).json({message : 'Error while creating post', error : err.message});
    }
}
