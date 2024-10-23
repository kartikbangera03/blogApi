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

    res.sendStatus(205)
})

exports.deleteCommentFromPost = asyncHandler(async(req,res,next)=>{

    const commentId = parseInt(req.params.commentId)
    const delete_comment = await prisma.comment.delete({
        where: {
          id:commentId,
        },
      })

    res.sendStatus(205)
})
