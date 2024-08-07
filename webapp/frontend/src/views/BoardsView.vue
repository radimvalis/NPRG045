
<script setup>

    import { ref, onMounted } from "vue";
    import { useDisplay } from "vuetify";
    import { RouterLink } from "vue-router";
    import { useSessionStore } from "@/stores/session";

    const session = useSessionStore();

    const { smAndUp } = useDisplay();

    const boards = ref([]);

    const isLoading = ref(true);
    const noDataText = ref("No board available");

    const nameFilter = ref(null);
    const connectionFilter = ref(null);
    const firmwareFilter = ref(null);

    const connectionFilterOptions = [

        { title: "online", value: true },
        { title: "offline", value: false },
    ];

    const firmwareFilterOptions = [

        { title: "latest" },
        { title: "update available" },
        { title: "default" }
    ];

    const headers = [

        { 
            title: "Board",
            align: "start",
            key: "name"
        },
        { 
            title: "Connection",
            align: "start",
            key: "isOnline",
            filter: (status) => connectionFilter.value === null ? true : status === connectionFilter.value
        },
        {
            title: "Firmware",
            align: "start",
            key: "firmwareStatus",
            filter: (status) => firmwareFilter.value === null ? true : status === firmwareFilter.value
        }
    ];

    onMounted(async () => {

        try {

            isLoading.value = true;

            boards.value = await session.api.board.getSummaryList();
        }

        catch(error) {

            noDataText.value = "Loading failed";
        }

        finally {

            isLoading.value = false;
        }
    });

</script>

<template>

    <div
        :class='{ "mx-4": smAndUp }'
    >

        <v-sheet
            class="mx-auto"
            :class='{ "mt-5": smAndUp }'
            :max-width="1200"
            :elevation="1"
            :rounded="smAndUp"
        >

            <v-container
                fluid
            >

                <v-row>

                    <v-col
                        :cols="12"
                    >

                        <v-btn
                            :to='{ name: "NewBoard" }'
                            prepend-icon="mdi-plus"
                            variant="flat"
                            color="primary"
                        >
                        
                            Register
                    
                        </v-btn>

                    </v-col>

                    <v-col
                        :cols="12"
                        :sm="4"
                        :md="6"
                    >

                        <v-text-field
                            v-model="nameFilter"
                            density="compact"
                            variant="outlined"
                            prepend-inner-icon="mdi-magnify"
                            placeholder="Board"
                            hide-details
                            clearable
                        />

                    </v-col>

                    <v-col
                        :cols="12"
                        :sm="4"
                        :md="3"
                    >

                        <v-select
                            v-model="connectionFilter"
                            :items="connectionFilterOptions"
                            density="compact"
                            variant="outlined"
                            placeholder="Connection"
                            hide-details
                            clearable
                            chips
                        />

                    </v-col>

                    <v-col
                        :cols="12"
                        :sm="4"
                        :md="3"
                    >

                        <v-select
                            v-model="firmwareFilter"
                            :items="firmwareFilterOptions"
                            density="compact"
                            variant="outlined"
                            placeholder="Firmware"
                            hide-details
                            clearable
                            chips
                        />

                    </v-col>
                    
                </v-row>

            </v-container>

            <v-data-table
                :headers="headers"
                :items="boards"
                :loading="isLoading"
                :search="nameFilter"
                :no-data-text="noDataText"
                items-per-page-text="Boards per page:"
                loading-text="Loading boards ..."
                hover
            >

                <template #item.name="{ item }">

                    <RouterLink
                        :to='{ name: "BoardDetail", params: { id: item.id } }'
                        style="text-decoration: none; color: #336699;"
                    >
                    
                        {{ item.name }}

                    </RouterLink>

                </template>

                <template #item.isOnline="{ value }">

                    <v-chip
                        :text='value ? "online" : "offline"'
                        :color='value ? "success" : "error"'
                        :prepend-icon='value ? "mdi-check-circle-outline" : "mdi-alert-circle-outline"'
                    />

                </template>

                <template #item.firmwareStatus="{ value }">

                    <v-chip
                        :text="value"
                        :color='value === "default" ? undefined : value === "latest" ? "success" : "orange"'
                        :prepend-icon='value === "default" ? undefined : value === "latest" ? "mdi-check-circle-outline" : "mdi-update"'
                    />


                </template>

            </v-data-table>

        </v-sheet>
        
    </div>

</template>