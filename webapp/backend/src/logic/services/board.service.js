
import { InvalidBoardNameError } from "../../utils/errors.js";

export default class BoardService {

    constructor(models) {

        this._models = models;
    }

    async getByIdAndUserId(boardId, userId) {

        const board = await this._models.board.findByPk(boardId);

        if (!board || board.userId !== userId) {

            throw new NotFoundError();
        }

        return board.toJSON();
    }

    async getSummaryList(userId) {

        const boards = await this._models.board.findAll({
            
            where: { userId },
            include: [

                {
                    model: this._models.firmware,
                    attributes:  [ "version" ]
                }
            ],
            attributes: [ "id", "name", "isOnline", "firmwareVersion", "firmwareStatus" ]
        });

        const boardsSummary = boards.map((board) => {
            
            const sanitized = board.getSanitized();

            delete sanitized.firmware;
            delete sanitized.firmwareVersion;

            return sanitized;
        });

        return boardsSummary;
    }

    async create(name, userId) {

        const board = await this._models.board.findOne({ where: { name, userId } });

        if (board) {

            throw new InvalidBoardNameError();
        }

        const newBoard = await this._models.board.create({ name, userId });

        return newBoard.toJSON();
    }
}