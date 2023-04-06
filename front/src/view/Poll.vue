<template>
    <Header :isLogged="logged"/>
    <main class="flex flex-col items-center bg-violet-950 min-h-screen">
        <section class=" flex flex-col items-center w-2/3">
            <div v-if="notLogPoll.status === true" class="bg-red-600 bg-opacity-30 p-5 rounded w-2/3 mt-10">
                <p class="text-red-700">Ce sondage à une durée temporaire, expiration  {{ notLogPoll.exp }}</p>
                <p class="text-red-700">Pour obtenir les droits d'administration sur ce sondage, <RouterLink class="underline" to="/signup">Créer un compte gratuit</RouterLink>.</p>
            </div>
            <div ref="errorCont" class="mt-10 w-2/3 mb-4 text-red-600 text-xs px-5"></div>
            <div class="border text-gray-100 p-5 rounded w-2/3">
                <h1 class="font-bold text-lg">{{ pollData.title }}</h1>
                <h2 class="text-gray-500 mt-1">Par <span v-if="pollData.userId === null">invité</span><span v-else>{{ pollData.username }}</span> - Créé le {{ pollData.createdAt }}</h2>
                <div class="mt-7">
                    <p class="mb-3">Votre réponse <span class="text-sm italic" v-if="pollData.multipleOption === true && pollData.multipleMax < pollData.options.length">- {{ pollData.multipleMax }} réponses maximum</span>:</p>
                    <ul v-if="pollData.multipleOption === false">
                        <li v-for="(option, ind) in pollData.options" class="flex items-center mb-2">
                            <input v-model="voteValue" :id="'voteRadio-' + ind" type="radio" :value="ind" name="voteRadio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500">
                            <label :for="'voteRadio-' + ind" class="mb-1 ml-2 text-sm font-medium text-gray-50">{{ option }}</label>
                        </li>
                    </ul>
                    <ul v-else>
                        <li v-for="(option, ind) in pollData.options" class="flex items-center mb-2">
                            <input v-model="checkedVote" :id="'voteCheck' + ind" type="checkbox" :value="ind" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500">
                            <label :for="'voteCheck' + ind" class="mb-1 ml-2 text-sm font-medium text-gray-50">{{ option }}</label>
                        </li>
                    </ul>
                    <div class="mt-9">
                        <input @click="vote" class="bg-blue-600 h-9 px-4 rounded cursor-pointer w-28 text-white transition-colors hover:bg-blue-500 hover:transition-colors" type="button" value="Votez">
                        <RouterLink :to="'/sondage/' + route.params.id + '/results'">
                            <input class="border border-gray-500 h-9 px-4 rounded cursor-pointer w-28 text-gray-300 ml-6 transition-all hover:border-2 hover:transition-all" type="button" value="Résultats">
                        </RouterLink>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>

<script setup>
    import { onMounted, reactive, ref } from 'vue';
    import Header from '../components/Header.vue';
    import { useRoute, useRouter } from 'vue-router';
    import jwt from 'vue-jwt-decode';

    const router = useRouter();
    const route = useRoute();
    const apiUrl = import.meta.env.VITE_API_URL;

    const logged = ref(false);
    const voteValue = ref('');
    const errorCont = ref(null);
    const checkedVote = ref([]);
    const userIp = ref(null);
    const userId = ref(null);

    const notLogPoll = reactive({
        status: false,
        exp: "",
    });
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
        isPollUserID();
        isLogged();
        getPoll();
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
                userId.value = JSON.parse(getToken).content;
            }
        }
    };

    /**
     * check if poll as a user
     */
    const isPollUserID = () => {
        let getPollItem = localStorage.getItem('vue_poll_temp');

        if (getPollItem !== null && JSON.parse(getPollItem).id === route.params.id) {
            const currentDate = Math.floor(Date.now() / 1000);

            if ((JSON.parse(getPollItem).exp - currentDate) < 0) {
                localStorage.removeItem('vue_poll_temp');
            } else {
                    notLogPoll.status = true;
                    const timeExp = JSON.parse(getPollItem).exp * 1000;
                    const dateFormat = new Date(timeExp);
                    notLogPoll.exp = "le "+ dateFormat.getDate()+
                                        "/"+(dateFormat.getMonth()+1)+
                                        "/"+dateFormat.getFullYear()+
                                        " "+dateFormat.getHours()+
                                        ":"+dateFormat.getMinutes()+
                                        ":"+dateFormat.getSeconds();
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

    /**
     * get user ip
     */
    const getUserIp = () => {
        fetch('https://api.ipify.org?format=json', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'GET'
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.ip);
                userIp.value = data.ip;
            })
            .catch(err => {
                console.log(err);
            });  
    };

    /**
     * to vote
     */
    const vote = () => {
        let error = document.createElement('p');
        errorCont.value.innerHTML = "";

        if (voteValue.value === '' && pollData.multipleOption === false) {
            error.textContent = '- Aucune réponse sélectionnée.';
            return errorCont.value.appendChild(error);
        } else if (checkedVote.value.length === 0 && pollData.multipleOption === true) {
            error.textContent = '- Aucune réponse sélectionnée.';
            return errorCont.value.appendChild(error);
        } else if (pollData.multipleOption === true && checkedVote.value.length > pollData.multipleMax) {
            error.textContent = `- Le maximum de réponses autorisé est de ${pollData.multipleMax}.`;
            return errorCont.value.appendChild(error);
        }

        let value = null;

        if (pollData.multipleOption === true) {
            value = checkedVote.value;
        } else {
            value = [voteValue.value];
        }

        if ((userIp.value !== null && pollData.votePer === 'ip') || (pollData.votePer === "account" && logged.value === true && userId.value !== null) || pollData.votePer === 'not') {
            fetch(apiUrl + "/api/poll/vote/" + route.params.id, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ value, content: pollData.options[value], ip: userIp.value, userId: userId.value })
            })
            .then(res => {
                if (res.status === 200) {
                    router.push('/sondage/' + route.params.id + '/results');  
                } else {
                    res.json()
                        .then(data => {
                            if (data.message) {
                                error.textContent = data.message;
                                errorCont.value.appendChild(error);
                            }
                        })
                        .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));
        } else if (pollData.votePer === "ip") {
            error.textContent = "- Impossible d'accéder à l'adresse ip, désactiver votre bloqueur de pub peut régler le problème.";
            errorCont.value.appendChild(error);
        } else if (pollData.votePer === "account" && logged.value === false) {
            const a = document.createElement('a');
            a.setAttribute('href', '/login');
            const linkContent = document.createElement('p');
            linkContent.textContent = "Se connecter";
            linkContent.classList.add('underline');
            a.appendChild(linkContent);
            error.textContent = '- Vous devez être connecté pour voter. ';
            error.appendChild(a);
            errorCont.value.appendChild(error);
        } else {
            error.textContent = '- Un problème est survenu.';
            errorCont.value.appendChild(error);
        }
    };
</script>

<style scoped>

</style>