<template> 
    <Header :isLogged="logged"/>
    <main class="flex flex-col items-center bg-violet-950 min-h-screen">
        <input v-if="logged === true" @click="logout" class="bg-blue-600 w-44 h-8 rounded cursor-pointer text-white mt-48 hover:bg-blue-500 transition-colors" type="button" value="Se deconnecter">
        <section v-else>
            <div ref="errorCont" class="mt-48 w-80 mb-4 text-red-600 text-xs px-4"></div>
            <form @submit.prevent="validateLogin" class="border p-4 text-gray-100 transition-colors w-80">
                <div class="flex flex-col">
                    <label class="mt-3 mb-0.5" for="logEmail">Adresse email</label>
                    <input v-model="logInput.email" class="h-8 bg-violet-950 border border-gray-300 pl-4" type="email" id="logEmail">
                </div>
                <div class="flex flex-col">
                    <label class="mt-3 mb-0.5" for="logPassword">Mot de passe</label>
                    <input v-model="logInput.password" class="h-8 bg-violet-950 border border-gray-300 pl-4" type="password" id="logPassword">
                </div>
                <input class="bg-blue-600 h-8 rounded cursor-pointer text-white w-full mt-6 hover:bg-blue-500 transition-colors" type="submit" value="Se connecter">
            </form>
            <RouterLink class="w-80" to="/signup">
                <p class="text-right text-gray-100 mt-1 transition-colors hover:text-gray-400 hover:transition-colors">Créer un compte</p>
            </RouterLink>
        </section>
    </main>   
</template>

<script setup>
    import { onMounted, ref, reactive } from 'vue';
    import { useRouter } from 'vue-router';
    import jwt from 'vue-jwt-decode';
    import Header from '../components/Header.vue';

    const router = useRouter();
    const apiUrl = import.meta.env.VITE_API_URL;

    const logged = ref(false);
    const errorCont = ref(null);
    const logInput = reactive({
        email: "",
        password: "",
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
     * validate form before login
     */
    const validateLogin = () => {
        if (errorCont.value !== null) {
            errorCont.value.innerHTML = "";
            
            if (logInput.email === "" || logInput.password === "" || logInput.confirm === "") {
                let error = document.createElement('p');
                error.textContent = '- Tous les champs sont requis.';
                return errorCont.value.appendChild(error);
            }
            
            if (!logInput.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i)) {
                let error = document.createElement('p');
                error.textContent = '- L\' email n\'a pas un format valide.';
                return errorCont.value.appendChild(error);
            }
            
            if (!logInput.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)) {
                let error = document.createElement('p');
                error.textContent = '- Le mot de passe doit contenir minimun 1 lettre 1 chiffre 1 lettre majuscule et 8 caractères.';
                return errorCont.value.appendChild(error);
            }
            
            logUser();
        }
    };
    
    /**
     * check if user exist on database and log it if true
     */
    const logUser = () => {
        fetch(apiUrl + '/api/user/log',{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ email: logInput.email, password: logInput.password })
        })
            .then(res => {
                if (res.status === 200) {
                    res.json()
                        .then(data => {
                            const newObj = {
                                version: data.token,
                                content: data.userId
                            };
                            localStorage.setItem('vue_polls_token', JSON.stringify(newObj));
                            router.push('/');
                        })
                } else {
                    res.json()
                        .then(data => {
                            let error = document.createElement('p');
                            if (data) {
                                error.textContent = data.message;
                            } else {
                                error.textContent = '- Une erreur est survenue.';
                            }
                            return errorCont.value.appendChild(error);
                        })
                }
            })
            .catch(err => console.log(err));
    };

    /**
     * disconnect current user
     */
    const logout = () => {
        localStorage.removeItem('vue_polls_token');
        logged.value = false;
    };
</script>

<style scoped>

</style>