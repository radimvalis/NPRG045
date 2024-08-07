
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { ENDPOINT } from "shared";

import authCookieMiddleware from "./middlewares/auth.cookie.middleware.js";
import refreshCookieMiddleware from "./middlewares/refresh.cookie.middleware.js";

import AuthController from "./controllers/auth.controller.js";
import UserController from "./controllers/user.controller.js";
import FileController from "./controllers/file.controller.js";
import BoardController from "./controllers/board.controller.js";

export default function start(context, port) {

    const authController = new AuthController(context);
    const userController = new UserController(context);
    const fileController = new FileController(context);
    const boardController = new BoardController(context);

    const app = express();

    app.use(cors());
    app.use(cookieParser())
    app.use(express.json());

    // Unprotected endpoints

    app.post(ENDPOINT.AUTH.LOG_IN, authController.logIn);
    app.post(ENDPOINT.AUTH.SIGN_UP, authController.signUp);
    app.get(ENDPOINT.AUTH.REFRESH_TOKENS, refreshCookieMiddleware(context), authController.refreshTokens);

    // Protected endpoints

    app.use(authCookieMiddleware(context));

    app.get(ENDPOINT.AUTH.LOG_OUT, authController.logOut);
    app.get(ENDPOINT.USER.GET, userController.get);
    app.get(ENDPOINT.FILE.DEFAULT.ANY, fileController.getDefault);
    app.post(ENDPOINT.FILE.DEFAULT.NVS, fileController.getDefaultNVS);
    app.post(ENDPOINT.BOARD.GET, boardController.get);
    app.get(ENDPOINT.BOARD.SUMMARY_LIST, boardController.getSummaryList);
    app.put(ENDPOINT.BOARD.REGISTER, boardController.register);

    //

    app.listen(port, () => {

        console.log(`Backend app listening on port ${port}`);
    });
}