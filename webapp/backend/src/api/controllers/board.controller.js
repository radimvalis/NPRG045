
import asyncCatch from "../middlewares/error.middleware.js";

export default function BoardController(context) {

    this.register = asyncCatch(async (req, res) => {

        const board = await context.board.create(req.body.name, req.userId);

        await context.file.createBoardDir(board.id);

        await context.file.createDefaultNVS(req.body, board.id);

        res.json(board).end();
    });
}