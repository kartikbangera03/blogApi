const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const { post } = require("../Router/mainRouter");

const prisma = new PrismaClient();

// Protected Routes

exports.getAllPosts = asyncHandler(async(req,res,err)=>{
        console.log(" GETTING ALL POSTS FOR AUTHOR ......")
        const posts = await prisma.post.findMany({
            include:{
                comments :{
                    orderBy : {
                        createdAt : 'desc'
                    }
                }
                
            },
            orderBy :{
                updatedAt : 'desc'
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

    res.sendStatus(201)
})

exports.updatePost = asyncHandler(async(req,res)=>{
    const postId =  parseInt(req.params.postId)

    if(req.body.isPublished){
        req.body.isPublished = true ? req.body.isPublished==="true" : false;
    }
    
    const updated_post = await prisma.post.update({
        where:{
            id: postId
        },
        data:req.body
    })

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

    res.sendStatus(205)
})