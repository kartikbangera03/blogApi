const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.addCommentToPost = asyncHandler(async(req,res,next)=>{
    const postId =  parseInt(req.params.postId)

    const new_comment = await prisma.comment.create({
        data:{
            postId : postId ,
            commentAuthor : req.body.commentAuthor ,
            text : req.body.text
        }
    })
    // No need to provide anything but status 
    // res.status(201).json({
    //     message :"Add a Comment To A Post",
    //     new_comment
    // })

    res.sendStatus(205)
})

exports.deleteCommentFromPost = asyncHandler(async(req,res,next)=>{

    const commentId = parseInt(req.params.commentId)
    const delete_comment = await prisma.comment.delete({
        where: {
          id:commentId,
        },
      })
    // res.status(200).json({
    //     message :"Delete a Comment To A Post",
    //     delete_comment
    // })

    res.sendStatus(205)
})
