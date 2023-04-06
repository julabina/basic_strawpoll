<template>
    <Header :isLogged="logged"/>
    <main class="flex flex-col items-center bg-violet-950 min-h-screen">
        
    </main>
</template>

<script setup>
    import { onMounted, reactive, ref } from 'vue';
    import jwt from 'vue-jwt-decode';
    import { useRouter } from 'vue-router';
    import Header from '../components/Header.vue';

    const logged = ref(false);
    const router = useRouter();

    const pollData = reactive({
        id: "",
        userId: null,
        options: [],
        results: [],
        title: "",
        votePer : "",
        multipleOption: false,
        multipleMax: null,
        createdAt: "",
        username: null,
    });

    onMounted(() => {
        isLogged();
    });

    /**
     * check if user is logged
     */
    const isLogged = () => {
        let getToken = localStorage.getItem('vue_polls_token');
        if (getToken !== null) {
            let decodedToken = jwt.decode(JSON.parse(getToken).version);
            const currentDate = Math.floor(Date.now() / 1000);

            if ((decodedToken.exp - currentDate) < 0) {
                localStorage.removeItem('vue_polls_token');
            } else {
                logged.value = true;
            }
        }
    };

    /**
     * get poll data
     */
     const getPoll = () => {
        fetch(apiUrl + "/api/poll/getOne/" + route.params.id, {
            method: "GET"
        })
        .then(res => {
            if (res.status === 200) {
                res.json()
                .then(data => {
                    if(data.data) {
                        const created = new Date(data.data.createdAt);
                        
                        pollData.id = data.data.id;
                        pollData.userId = data.data.userId;
                        pollData.options = data.data.options;
                        pollData.results = data.data.results;
                        pollData.title = data.data.title;
                        pollData.votePer  = data.data.votePer;
                        pollData.multipleOption = data.data.multipleOption;
                        pollData.multipleMax = data.data.multipleMax;
                        pollData.createdAt = created.toLocaleString("fr-FR");
                        pollData.username = data.username;

                        if (data.data.votePer === 'ip') {
                            getUserIp();
                        }
                    } 
                })
                .catch(err => console.log(err));
            } else {
                router.push("/");
            }
        })
        .catch(err => console.log(err));
    };
</script>

<style scoped>
</style>