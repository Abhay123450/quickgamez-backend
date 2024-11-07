import express from "express";
import { UserControllerImpl } from "./UserControllerImpl.js";
import { UserRepositoryImpl } from "./UserRepositoryImpl.js";
import { catchAsycError } from "../../middlewares/catchAsyncError.js";
import {
    validateAddUserReq,
    validateGetUsersReq,
    validateUsername
} from "./user.validate.js";
import { UserServiceImpl } from "./UserServiceImpl.js";
const router = express.Router();

const userRepository = new UserRepositoryImpl();
const userService = new UserServiceImpl(userRepository);
const userController = new UserControllerImpl(userService);

router
    .route("/users/my-profile")
    .get(catchAsycError(userController.getMyDetails.bind(userController)));

router
    .route("/users/check-username")
    .get(
        validateUsername(),
        catchAsycError(userController.isUserNameAvailable.bind(userController))
    );

router
    .route("/users")
    .post(
        validateAddUserReq(),
        catchAsycError(userController.addUser.bind(userController))
    )
    .get(
        validateGetUsersReq(),
        catchAsycError(userController.getUsers.bind(userController))
    );

router
    .route("/users/:userId")
    .get(catchAsycError(userController.getUserById.bind(userController)));

export const userRouter = router;
