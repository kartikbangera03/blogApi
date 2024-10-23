const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getPublishedPosts = asyncHandler(async(req,res)=>{
    const publishedPosts = await prisma.post.findMany({
        where:{
            isPublished:true
        },
        include:{
            comments : true
        }
    });
    res.status(200).json({
        publishedPosts
    })
})

exports.getPost = asyncHandler(async(req,res)=>{
    const postId =  parseInt(req.params.postId);
    const singlePost = await prisma.post.findUnique({
        where :{
            id : postId
        }
    })
    // Null if no such record exists;

    if(!singlePost){
        res.sendStatus(404)
    }else{
        res.status(200).json({
            singlePost 
        })
    }
})


