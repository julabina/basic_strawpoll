<template>
    <Header :isLogged="logged"/>
    <main class="flex flex-col items-center bg-violet-950 min-h-screen">
        <h1 class="font-bold text-3xl text-gray-50 mt-8 mb-10">Créer un sondage</h1>
        <section class=" flex flex-col items-center w-2/3 mb-24">
            <div ref="errorCont" class="w-2/3 mb-4 text-red-600 text-xs px-4"></div>
            <form @submit.prevent="validateCreate" class="border p-4 text-gray-100 transition-colors w-2/3">
                <div class="flex flex-col mb-8">
                    <label class="mt-3 mb-0.5" for="createTitle">Titre</label>
                    <input v-model="inputs.title" class="h-9 bg-violet-950 border border-gray-300 pl-4" type="text" id="createTitle">
                </div>
                <div class="flex flex-col">
                    <p class="mt-3 mb-0.5">Option de réponse</p>
                    <div v-for="(option, index) in inputs.options" :key="'createOption' + index" class="flex flex-col">
                        <div class="flex justify-between mb-2">
                            <div class="flex flex-col w-6">
                                <input @click="() => upOption(index)" class="text-xs bg-violet-950 border border-gray-300 cursor-pointer transition-colors hover:bg-violet-800 hover:transition-colors" type="button" value="▲">
                                <input @click="() => downOption(index)" class="text-xs bg-violet-950 border border-gray-300 cursor-pointer transition-colors hover:bg-violet-800 hover:transition-colors" type="button" value="▼">
                            </div>
                            <input class="h-9 w-full bg-violet-950 border border-gray-300 pl-4" v-model="inputs.options[index]" :placeholder="'Option ' + (index + 1)" type="text">
                            <input @click="() => removeOption(index)" type="button" value="X" class="h-9 w-9 font-bold bg-violet-950 border border-gray-300 cursor-pointer transition-colors hover:bg-violet-800 hover:transition-colors">
                        </div>
                    </div>
                    <div class="flex items-center mt-3 mb-6">
                        <div @click="addOption" class="flex bg-gray-50 h-9 text-gray-900 items-center px-2 rounded-sm transition-colors cursor-pointer hover:bg-gray-300 hover:transition-colors">
                            <p class="text-3xl mr-1">+</p>
                            <p>Ajouter une option</p>
                        </div>
                        <div v-if="otherDisplay === true" class="flex">
                            <p class="mx-3">ou</p>
                            <p @click="addOtherOption" class="text-blue-600 transition-colors cursor-pointer hover:text-blue-500 hover:transition-colors">"Autres"</p>
                        </div>
                    </div>
                    <div class="border-b border-gray-100 border-opacity-10 my-6"></div>
                </div>
                <div class="flex w-full justify-center py-6">
                    <div class="flex justify-center items-center flex-col w-1/2">
                        <div class="flex">
                            <p class="mr-4">Autoriser plusieurs choix</p>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input v-model="multipleOptions" type="checkbox" value="" class="sr-only peer">
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <div class="flex items-center mt-3" v-if="multipleOptions === true">
                            <label for="mulptipleNumberSelect" class="mr-8">Réponses maximum</label>
                            <select v-model="inputs.multipleMax" class="text-gray-900 h-9 mt-1 pl-2 pr-7 rounded-sm cursor-pointer" id="mulptipleNumberSelect">
                                <option v-for="(opt, ind) in inputs.options" :value="ind + 1">{{ ind + 1 }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="border-l border-gray-100 border-opacity-10"></div>
                    <div class="flex justify-center w-1/2">
                        <div class="flex flex-col">
                            <label for="createSelect">Vérification des doublons</label>
                            <select v-model="selected" class="text-gray-900 h-9 mt-1 pl-2 pr-7 rounded-sm cursor-pointer" id="createSelect">
                                <option v-for="option in selectOptions" :value="option.value">{{ option.text }}</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class=""></div>
                <div class="border-b border-gray-100 border-opacity-10 my-6"></div>
                <div class="flex justify-center">
                    <input class="bg-blue-600 h-11 rounded cursor-pointer text-white w-72 mt-6 mb-5 hover:bg-blue-500 transition-colors" type="submit" value="Créer un sondage">
                </div>
            </form>
            <p v-if="logged === false" class="text-red-600 text-xs mt-9">ATTENTION, vous ne pouvez créé qu'un seul sondage sans être connecté !</p>
        </section>
    </main>
</template>

<script setup>
    import { onMounted, ref, reactive } from 'vue';
    import jwt from 'vue-jwt-decode';
    import { useRouter } from 'vue-router';
    import Header from '../components/Header.vue';

    const router = useRouter();
    const apiUrl = import.meta.env.VITE_API_URL;

    const logged = ref(false);
    const otherDisplay = ref(true);
    const multipleOptions = ref(false);
    const errorCont = ref(null);
    const selected = ref('ip');
    const userId = ref('');
    const inputs = reactive({
        title: "",
        options: ["", ""],
        multipleMax: 2,
    });
    const selectOptions = reactive([
        { text: "Adresse IP", value: "ip" },
        { text: "Une voix par compte", value: "account" },
        { text: "Pas de vérification", value: "not" },
    ]);

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
                userId.value = JSON.parse(getToken).content;
                logged.value = true;
            }
        }
    };

    /**
     * validate inputs before create poll
     */
    const validateCreate = () => {
        errorCont.value.innerHTML = "";

        const optionsArr = inputs.options;

        if (inputs.title === "") {
            let error = document.createElement('p');
            error.textContent = '- Le titre ne peut pas être vide.';
            errorCont.value.appendChild(error);
        } else if (!inputs.title.match(/^[\w éèêëàâäîïçù\,\.\?\!\€\$\"\'\-\(\)]*$/i)) {
            let error = document.createElement('p');
            error.textContent = '- Le titre ne doit contenir uniquement que des lettres, des chiffres et (,.?!€$"\'-_).';
            errorCont.value.appendChild(error);
        }
        
        for (let i = 0; i < optionsArr.length; i++) {
            if (optionsArr[i] === "") {
                let error = document.createElement('p');
                error.textContent = '- Toutes les options de réponse doivent être remplies.';
                errorCont.value.appendChild(error);
                break;
            } else if (!optionsArr[i].match(/^[\w éèêëàâäîïçù\,\.\?\!\€\$\"\'\-\(\)]*$/i)) {
                let error = document.createElement('p');
                error.textContent = '- Les options de réponse ne doivent contenir uniquement que des lettres, des chiffres et (,.?!€$"\'-_).';
                errorCont.value.appendChild(error);
                break;
            }
        }
        
        if (errorCont.value.innerHTML === "") {
            createPoll();
        }
    };

    /**
     * create poll on database
     */
    const createPoll = () => {
        let max = null;
        let user = null;

        if (multipleOptions.value === true) {
            max = inputs.multipleMax;
        }
        if (logged.value === true) {
            user = userId.value;
        }

        fetch(apiUrl + "/api/poll/create", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ title: inputs.title, options: inputs.options, double: selected.value, multiple: multipleOptions.value, multipleMax : max, user: user})
        })
            .then(res => {
                if (res.status === 201) {
                    res.json()
                        .then(data => {
                            console.log(data);
                            if (data.log === false) {
                                const newObj = {
                                    exp : (Math.floor(Date.now() / 1000) + 85000),
                                    id : data.data
                                };
                                localStorage.setItem('vue_poll_temp', JSON.stringify(newObj));
                            }

                            if (data.data) {
                                router.push('/sondage/' + data.data);
                            } else {
                                router.push('/');
                            }
                        })
                        .catch(err => console.log(err));
                } else {
                    res.json()
                        .then(data => {
                            let error = document.createElement('p');
                            if (data.message) {
                                error.textContent = '- ' + data.message;
                            } else {
                                error.textContent = '- ';
                            }
                            errorCont.value.appendChild(error);
                        })
                        .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));
    };

    /**
     * add one option to the options array
     */
    const addOption = () => {
        const arr = inputs.options;
        arr.push('');
        inputs.options = arr;
    };
    
    /**
     * add other option to the options array
     */
    const addOtherOption = () => {
        const arr = inputs.options;
        if (!arr.includes('Autres')) {
            const other = 'Autres';
            arr.push(other);
            inputs.options = arr;
            otherDisplay.value = false;
        }
    };

    /**
     * remove one option to the options array
     * 
     * @param {*} ind 
     */
    const removeOption = (ind) => {
        const arr = inputs.options;
        if (arr.length > 1) {   
            const arrFiltered = arr.filter((el, elInd) => {
                return elInd !== ind;
            });
            inputs.options = arrFiltered;
            if (!arrFiltered.includes('Autres') && otherDisplay.value === false) {
                otherDisplay.value = true;
            }
        }
    };

    /**
     * up option index to the option array
     * 
     * @param {*} ind 
     */
    const upOption = (ind) => {
        if (ind !== 0) {
            const arr = inputs.options;
            let newArr = [];
            
            for (let i = 0; i < arr.length; i++) {
                if (ind - 1 === i) {
                    newArr.push(arr[ind]);
                }
                
                if (ind !== i) {
                    newArr.push(arr[i]);
                }
            }
            
            inputs.options = newArr;
        }
    };

    /**
     * down option index to the option array
     * 
     * @param {*} ind 
     */
    const downOption = (ind) => {
        const arr = inputs.options;

        if (ind !== (arr.length - 1)) {
            let newArr = [];
            
            for (let i = 0; i < arr.length; i++) {
                if (ind !== i) {
                    newArr.push(arr[i]);
                }
                
                if (ind + 1 === i) {
                    newArr.push(arr[ind]);
                }
            }
            
            inputs.options = newArr;
        }
    };
</script>

<style scoped>

</style>