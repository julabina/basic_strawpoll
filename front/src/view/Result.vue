<template>
    <Header :isLogged="logged"/>
    <main class="flex flex-col items-center bg-violet-950 min-h-screen">
        <section class="border text-gray-100 p-5 rounded w-2/3 mt-32">
            <h1 class="text-gray-50 font-bold text-2xl mb-7 pl-0.5">{{ pollData.title }}</h1>
            <div class="w-full">
                <div v-for="(result, ind) in results.resultPercent" class="mb-4">
                    <div class="flex justify-between w-full mb-0.5 pl-0.5">
                        <p class="first-letter:uppercase">{{ results.resultOptions[ind] }}</p>
                        <p>{{ result.value }}% ({{ results.resultNumbers[ind] }} Voix)</p>
                    </div>
                    <div class="bg-gray-500 bg-opacity-25 w-full rounded-full">
                        <div :style="'width:' + result.value + '%;background-color:' + result.color +  ';'" class="h-5 rounded-full"></div>
                    </div>
                </div>
            </div>
            <div class="border-t border-gray-100 border-opacity-25 mt-7">
                <p class="pl-0.5 mt-4 text-gray-400">{{ totalVote }} Voix</p>
            </div>
        </section>
    </main>
    <Footer/>
</template>

<script setup>
    import { onMounted, reactive, ref } from 'vue';
    import jwt from 'vue-jwt-decode';
    import { useRoute, useRouter } from 'vue-router';
    import Header from '../components/Header.vue';
    import Footer from '../components/Footer.vue';

    const apiUrl = import.meta.env.VITE_API_URL;

    const router = useRouter();
    const route = useRoute();
    const logged = ref(false);
    const totalVote = ref(0);

    const results = reactive({
        resultPercent: [],
        resultOptions: [],
        resultNumbers: [],
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

                        calculResult();
                    } 
                })
                .catch(err => console.log(err));
            } else {
                router.push("/");
            }
        })
        .catch(err => console.log(err));
    };

    const calculResult = () => {
        const data = pollData;
        const total = data.results.reduce((a, b) => parseInt(a) + parseInt(b), 0);
        const percent = 100 / total;
        let finalResult = [];
        let sortedOptions = [];
        let sortedNumbers = [];

        totalVote.value = total;
        
        for (let i = 0; i < data.results.length; i++) {
            const randomColor = Math.floor(Math.random()*16777215).toString(16);
            const newObj = {
                value: Math.round((parseInt(data.results[i]) * percent) * 100) / 100,
                index: i,
                color: '#' + randomColor
            };
            finalResult.push(newObj);
        }
        
        const sortedResultsArr = finalResult.sort((a, b) => b.value - a.value);

        for (let i = 0; i < sortedResultsArr.length; i++) {
            sortedOptions.push(data.options[sortedResultsArr[i].index]);
            sortedNumbers.push(data.results[sortedResultsArr[i].index]);
        }

        results.resultPercent = sortedResultsArr;
        results.resultOptions = sortedOptions;
        results.resultNumbers = sortedNumbers;
    };
</script>

<style scoped>
</style>