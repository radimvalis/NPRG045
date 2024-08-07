
const ENDPOINT = {

    AUTH: {

        LOG_IN: "/auth/login",
        SIGN_UP: "/auth/signup",
        LOG_OUT: "/auth/logout",
        REFRESH_TOKENS: "/auth/refresh"
    },

    USER: {

        GET: "/user/get"
    },

    FILE: {

        DEFAULT: {

            ANY: "/file/default/:filename",
            FIRMWARE: "/file/default/firmware",
            PARTITION_TABLE: "/file/default/partition-table",
            BOOTLOADER: "/file/default/bootloader",
            CONFIG_FORM: "/file/default/config-form",
            NVS: "/file/default/nvs"
        }
    },

    BOARD: {

        GET: "/board/get",
        SUMMARY_LIST: "/board/summary-list",
        REGISTER: "/board/register"
    }
}

export { ENDPOINT };