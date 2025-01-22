import express from "express";
import { CommentControllerImpl } from "./CommentControllerImpl.js";
import { CommentRepositoryImpl } from "./CommentRepositoryImpl.js";
import { CommentServiceImpl } from "./CommentServiceImpl.js";
import {
    authenticateUser,
    isUserAuthenticated
} from "../../middlewares/userAuth.middleware.js";
import { catchAsycError } from "../../middlewares/catchAsyncError.js";
import { validateGetCommentsReq } from "./comment.validate.js";
const router = express.Router();

const commentRepository = new CommentRepositoryImpl();
const commentService = new CommentServiceImpl(commentRepository);
const commentCotroller = new CommentControllerImpl(commentService);

router
    .route("/comments/:commentId/like")
    .post(
        authenticateUser,
        catchAsycError(commentCotroller.likeComment.bind(commentCotroller))
    )
    .delete(
        authenticateUser,
        catchAsycError(commentCotroller.unlikeComment.bind(commentCotroller))
    );

router
    .route("/comments/:commentId/dislike")
    .post(
        authenticateUser,
        catchAsycError(commentCotroller.dislikeComment.bind(commentCotroller))
    )
    .delete(
        authenticateUser,
        catchAsycError(commentCotroller.undislikeComment.bind(commentCotroller))
    );

router
    .route("/comments/:commentId/replies")
    .get(
        isUserAuthenticated,
        catchAsycError(
            commentCotroller.getRepliesByCommentId.bind(commentCotroller)
        )
    );

router
    .route("/comments/reply")
    .post(
        authenticateUser,
        catchAsycError(commentCotroller.addReply.bind(commentCotroller))
    );

router
    .route("/comments")
    .post(
        authenticateUser,
        catchAsycError(commentCotroller.addComment.bind(commentCotroller))
    )
    .get(
        isUserAuthenticated,
        validateGetCommentsReq(),
        catchAsycError(commentCotroller.getComments.bind(commentCotroller))
    );

export const commentRouter = router;
