
import { ConflictError, NotFoundError } from "../../utils/errors.js";

export default class FirmwareService {

    constructor(models) {

        this._models = models;
    }

    async get(firmwareId, userId) {

        const firmware = await this._getByIdAndUserId(firmwareId, userId);

        return firmware.toJSON();
    }

    async getPublic(firmwareId) {

        const firmware = await this._models.firmware.findByPk(firmwareId);

        return firmware.getSanitized();
    }

    async getSummaryList(userId) {

        return await this._models.firmware.findAll({ where: { userId }, attributes: [ "id", "name", "version" ] });
    }

    async create(name, userId) {

        const firmware = await this._models.firmware.findOne({ where: { name, userId } });

        if (firmware) {

            throw new ConflictError();
        }

        const newFirmware = await this._models.firmware.create({ name, userId });

        return newFirmware.toJSON();        
    }

    async incrementVersion(firmwareId, userId) {

        const firmware = await this._getByIdAndUserId(firmwareId, userId);

        await firmware.increment("version");

        await firmware.reload();

        return firmware.toJSON();
    }

    async delete(firmwareId, userId) {

        const firmware = await this._getByIdAndUserId(firmwareId, userId);

        await firmware.destroy();
    }

    async _getByIdAndUserId(firmwareId, userId) {

        const firmware = await this._models.firmware.findByPk(firmwareId);

        if (!firmware || firmware.userId !== userId) {

            throw new NotFoundError();
        }

        return firmware;
    }
}