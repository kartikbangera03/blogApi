const { Router } = require("express");
const router = Router();

const postController = require("../Controllers/postController")
const commentController = require("../Controllers/commentController")

//REST API
router.get("/posts", postController.getPublishedPosts)

router.get("/posts/:postId" , postController.getPost)

// CRUD - CD only Comments
router.post("/posts/:postId/comments" , commentController.addCommentToPost)

module.exports = router;