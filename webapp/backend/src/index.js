
import { endpoint } from "shared";
import fs from "fs/promises";
import ApplicationContext from "./logic/index.js";
import getDb from "./db/index.js";
import getMqtt from "./mqtt/index.js";
import start from "./api/index.js";

(async () => {

    const db = await getDb();

    try {

        await db.authenticate();
    }
    
    catch(error) {
    
        console.error("Unable to connect to the database:", error);
        
        return;
    }

    let mqtt;

    try {

        const caBundle = await fs.readFile(process.cwd() + "/ca-bundle.crt", "utf8");

        const mqttConfig = {

            brokerUrl: "mqtts://mqtt-broker:" + process.env.MQTT_BROKER_PORT,
            caBundle: caBundle,
            username: process.env.MQTT_ADMIN_USERNAME,
            password: process.env.MQTT_ADMIN_PASSWORD
        };

        mqtt = await getMqtt(mqttConfig);
    }

    catch(error) {

        console.error("Unable to connect to the MQTT broker:", error);

        return;
    }

    const port = process.env.BACKEND_PORT || 4000;
    
    const config = {

        url: {

            server: process.env.REVERSE_PROXY_URL,
            broker: process.env.MQTT_BROKER_URL
        },

        auth: {

            accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
            refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET
        },

        cookie: {

            accessCookieName: "accessCookie",
            refreshCookieName: "refreshCookie",
            accessCookiePath: "/",
            refreshCookiePath: endpoint.auth.refreshTokens()
        },

        path: {

            dataDirectoryPath: process.cwd() + "/data",
            caBundlePath: process.cwd() + "/ca-bundle.crt"
        },

        models: db.models,

        mqtt: mqtt
    };

    const context = new ApplicationContext(config);

    await context.init();

    start(context, port);
})();