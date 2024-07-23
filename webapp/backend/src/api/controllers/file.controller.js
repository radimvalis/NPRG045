
import asyncCatch from "../middlewares/error.middleware.js";

export default function FileController(context) {

    this.getDefault = asyncCatch(async (req, res) => {

        const path = context.file.getDefaultPath(req.params["filename"]);

        res.sendFile(path);
    });
}