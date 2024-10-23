const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const { post } = require("../Router/mainRouter");

const prisma = new PrismaClient();

// Protected Routes

exports.getAllPosts = asyncHandler(async(req,res,err)=>{
        console.log(" GETTING ALL POSTS FOR AUTHOR ......")
        const posts = await prisma.post.findMany({
            include:{
                comments :true
            }
        })

        console.log("REQUEST OBJECT IN GET ALL POSTS : ")
        console.log(req.user)
    
        res.status(200).json({
            posts
        })
    
})

exports.addPost = asyncHandler(async(req,res)=>{

    const newPost = await prisma.post.create({
        data:{
            authorId : req.user.id,
            title : req.body.title,
            body : req.body.body,
            imageUrl : req.body.imageUrl,
        }
    })

    // console.log(newPost);

    // res.status(201).json({
    //     newPost
    // })

    res.sendStatus(201)
})

exports.updatePost = asyncHandler(async(req,res)=>{
    const postId =  parseInt(req.params.postId)

    // console.log("REQUEST BODY ....")
    // console.log(req.body)
    if(req.body.isPublished){
        req.body.isPublished = true ? req.body.isPublished==="true" : false;
    }
    
    const updated_post = await prisma.post.update({
        where:{
            id: postId
        },
        data:req.body
    })
    // console.log("UPDATED POST .......")
    // console.log(updated_post)
    // console.log(req.user)
    // Should return just the status and nothing else 
    // res.status(200).json({
    //     message :"Update a Posts - Title , Text , PublishedStatus",
    //     updated_post
    // })

    res.sendStatus(205)
})


exports.deletePost = asyncHandler(async(req,res)=>{
    const postId =  parseInt(req.params.postId)

    //Delete All Comments 
    const deleteComments = await prisma.comment.deleteMany({
        where :{
            postId : postId
        }
    })

    //Delete Post
    const delete_post = await prisma.post.delete({
        where: {
          id:postId,
        },
      })

       // Should return just the status and nothing else 
    // res.status(200).json({
    //     message :"Delete A Post",
    //     delete_post
    // })

    res.sendStatus(205)
})