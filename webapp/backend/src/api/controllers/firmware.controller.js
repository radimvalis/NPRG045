
import asyncCatch from "../middlewares/error.middleware.js";

export default function FirmwareController(context) {

    this.create = asyncCatch(async (req, res) => {

        const hasConfig = typeof req.files[1] !== "undefined";

        let firmware = await context.firmware.create(req.body.name, req.userId, hasConfig);

        await context.file.createFirmwareDir(firmware.id);

        try {

            await Promise.all([

                context.file.saveFirmware(firmware.id, req.files[0]),
                hasConfig ? context.file.saveConfigForm(firmware.id, req.files[1]) : Promise.resolve()
            ]);

            const sizeB = req.files[0].size;

            firmware = await context.firmware.setSizeB(firmware.id, req.userId, sizeB);
        }

        catch(e) {

            const firmwareId = firmware.id;

            await context.firmware.delete(firmwareId, req.userId);

            await context.file.deleteFirmwareDir(firmwareId);

            throw e;
        }

        res.json(firmware).end();
    });

    this.getAll = asyncCatch(async (req, res) => {

        const firmwares = await context.firmware.getAll(req.userId);

        res.json(firmwares).end();
    });

    this.getOne = asyncCatch(async (req, res) => {

        const firmware = await context.firmware.getOne(req.params.id);

        res.json(firmware).end();
    });

    this.update = asyncCatch(async (req, res) => {

        let updatedFirmware = await context.firmware.incrementVersion(req.body.firmwareId, req.userId);

        try {

            await context.file.saveFirmware(updatedFirmware.id, req.file);

            updatedFirmware = await context.firmware.setSizeB(updatedFirmware.id, req.userId, req.file.size);
        }

        catch(e) {

            await context.firmware.decrementVersion(req.body.firmwareId, req.userId);

            throw e;
        }

        res.json(updatedFirmware).end();
    });

    this.delete = asyncCatch(async (req, res) => {

        await context.firmware.delete(req.params.id, req.userId);

        if (await context.firmware.tryForceDelete(req.params.id)) {

            await context.file.deleteFirmwareDir(req.params.id);
        }

        res.status(200).end();
    });
}