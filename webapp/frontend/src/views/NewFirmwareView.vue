
<script setup>

    import { ref } from "vue";
    import { useRouter } from "vue-router";
    import { useSessionStore } from "@/stores/session";

    const router = useRouter();
    const session = useSessionStore();

    const alert = ref(false);
    const alertTitle = ref(null);
    const alertText = ref(null);

    const form = ref(null);

    const name = ref(null);
    const firmwareFile = ref(null);
    const configFormFile = ref(null);

    let firmware = null;

    const nameRules = [
                    
        (x) => !!x,
        (x) => 3 <= x.length && x.length <= 20 || "Name must be 3-20 characters",
        (x) => /^[a-z0-9-_.]+$/i.test(x) || "Only letters, numbers, -, _ and . are allowed"
    ];

    const firmwareRules = [

        () => !!firmwareFile.value,
        () => firmwareFile.value.type === "application/octet-stream" || "This is not a .bin file"
    ]

    const configFormRules = [

        () => !!configFormFile.value,
        () => configFormFile.value.type === "application/json" || "This is not a .json file" 
    ];

    async function upload() {
        
        try {

            const { valid } = await form.value.validate();

            if (valid) {

                firmware = await session.api.firmware.create(name.value, firmwareFile.value, configFormFile.value);

                router.push({ name: "FirmwareDetail", params: { id: firmware.id }, query: { new: true } });
            }
        }

        catch(error) {

            if (error.response) {

                alertTitle.value = error.response.status + ": " + error.response.statusText;
                alertText.value = error.response.data.message;
            }

            else {

                alertTitle.value = "Upload failed";
                alertText.value = "Please try the upload again"
            }

            name.value = null;
            firmwareFile.value = null;
            configFormFile.value = null;

            alert.value = true;
        }
    }

</script>

<template>

    <v-alert
        v-if="alert"
        @click:close="alert = false"
        type="error"
        :title="alertTitle"
        :text="alertText"
    />

    <v-card-main>

        <v-card-title>

            Upload your firmware

        </v-card-title>

        <v-divider/>

        <v-card-text>

            <v-form
                ref="form"
            >

                <v-text-field
                    v-model="name"
                    class="mt-2"
                    label="Firmware name"
                    variant="outlined"
                    density="compact"
                    :rules="nameRules"
                />

                <v-file-input
                    v-model="firmwareFile"
                    class="mt-2"
                    label="Firmware file"
                    variant="outlined"
                    density="compact"
                    :rules="firmwareRules"
                />

                <v-file-input
                    v-model="configFormFile"
                    class="mt-2"
                    label="Config form file"
                    variant="outlined"
                    density="compact"
                    :rules="configFormRules"
                />

            </v-form>

        </v-card-text>

        <v-card-actions>

            <v-spacer/>

            <v-btn
                @click="upload"
            >

                Upload

            </v-btn>

        </v-card-actions>

    </v-card-main>

</template>