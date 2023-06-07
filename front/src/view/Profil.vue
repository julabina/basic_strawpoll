<template>
    <Header :isLogged="logged"/>
    <main class="flex flex-col items-center bg-violet-950 min-h-screen">
        <p @click="logout" class="w-2/3 text-end text-gray-400 mt-4 cursor-pointer transition-colors hover:transition-colors hover:text-gray-200">Se deconnecter</p>
        <section v-if="tempPoll !== null">
            <h1 class="text-lg text-white font-semibold mt-8 text-center mb-8">Sondage temporaire</h1>

            <div class="mb-12">
                <input @click="acceptTempPoll" type="button" value="Enregistrer ce sondage" class="bg-blue-600 h-10 px-4 rounded cursor-pointer text-white transition-colors hover:bg-blue-500 hover:transition-colors mr-2">
                <RouterLink :to="'/sondage/' + tempPoll">
                    <input type="button" value="Voir le sondage" class="bg-blue-600 h-10 px-4 rounded cursor-pointer text-white transition-colors hover:bg-blue-500 hover:transition-colors mr-2">
                </RouterLink>
                <input @click="deleteTempPoll" type="button" value="Supprimer ce sondage" class="bg-blue-600 h-10 px-4 rounded cursor-pointer text-white transition-colors hover:bg-blue-500 hover:transition-colors mr-2">
            </div>
        </section>
        <section class="flex flex-col items-center w-screen">
            <h1 class="text-lg text-white font-semibold mt-8">{{ polls.length > 0 ? 'Vos sondages' : 'Aucun sondage pour le moment' }}</h1>
            <RouterLink v-if="polls.length === 0" to="/create">
                <input type="button" value="Créer votre premier sondage" class="bg-blue-600 h-10 mt-12 px-4 rounded cursor-pointer text-white transition-colors hover:bg-blue-500 hover:transition-colors">
            </RouterLink>
            <div v-else class="w-3/5 mt-14">
                <div class="flex items-center w-full justify-between border-2 border-white mb-3 p-4 rounded-sm" v-for="(poll, ind) in polls">
                    <h2 class="font-semibold text-white">{{ poll.title }}</h2>
                    <div class="overflow-hidden">
                        <RouterLink :to="'/sondage/' + poll.id">
                            <input class="bg-blue-600 h-10 px-4 rounded cursor-pointer text-white transition-colors hover:bg-blue-500 hover:transition-colors mr-2" type="button" value="Sondage">
                        </RouterLink>
                        <RouterLink :to="'/sondage/' + poll.id + '/results'">
                            <input class="bg-blue-600 h-10 px-4 rounded cursor-pointer text-white transition-colors hover:bg-blue-500 hover:transition-colors" type="button" value="Resultat">
                        </RouterLink>
                    </div>
                </div>
            </div>
        </section>
    </main>
    <Footer/>
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import jwt from 'vue-jwt-decode';
    import { useRouter } from 'vue-router';
    import Header from '../components/Header.vue';
    import Footer from '../components/Footer.vue';

    const apiUrl = import.meta.env.VITE_API_URL;

    const logged = ref(false);
    const userId = ref(null);
    const tempPoll = ref(null);
    const polls = ref([]);
    const router = useRouter();

    onMounted(() => {
        isLogged();
        isTempPoll();
        getAllPolls();
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
                router.push('/login');
            } else {
                logged.value = true;
                userId.value = JSON.parse(getToken).content;
            }
        } else {
            router.push('/login');
        }
    };

    /**
     * check if temporary poll is in the local storage
     */
    const isTempPoll = () => {
        const getTemp = localStorage.getItem('vue_poll_temp');
        
        if (getTemp !== null) {
            let parsedTemp = JSON.parse(getTemp);

            const currentDate = Math.floor(Date.now() / 1000);
            if ((parsedTemp.exp - currentDate) < 0) {
                localStorage.removeItem('vue_poll_temp');
            } else if(parsedTemp.id !== undefined || parsedTemp.id !== null) {
                tempPoll.value = parsedTemp.id;
            }
        }
    };

    /**
     * get all user polls
     */
    const getAllPolls = () => {
        fetch(apiUrl + "/api/poll/getAll/" + userId.value, {
            method: 'GET',
        })
            .then(res => {
                if (res.status === 200) {
                    res.json()
                        .then(data => {
                            polls.value = data.data;
                            console.log(data);
                        })
                        .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));
    };

    const acceptTempPoll = () => {
        fetch(apiUrl + "/api/poll/acceptTemp/" + tempPoll.value, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify({ userId: userId.value })
        })
            .then(res => {
                if (res.status === 201) {
                    localStorage.removeItem('vue_poll_temp');
                    tempPoll.value = null;
                    getAllPolls();
                }
            })
    };

    const deleteTempPoll = () => {
        fetch(apiUrl + "/api/poll/deleteTemp/" + tempPoll.value, {
            method: 'DELETE',
        })
            .then(res => {
                if (res.status === 201 || res.status === 404) {
                    localStorage.removeItem('vue_poll_temp');
                    tempPoll.value = null;
                }
            })
    };

    const logout = () => {
        localStorage.removeItem('vue_polls_token');
        router.push('/login');
    };
</script>

<style scoped>
</style>