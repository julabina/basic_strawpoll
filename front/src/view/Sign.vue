<template> 
    <main class="flex flex-col items-center bg-violet-950 min-h-screen">
        <div id="signError" class="mt-48 w-80 mb-4 text-red-600 text-xs px-4"></div>
        <form @submit="validateSign" class="border p-4 text-gray-100 transition-colors w-80">
            <div class="flex flex-col">
                <label class="mt-3 mb-0.5" for="logEmail">Adresse email</label>
                <input v-model="signInput.email" class="h-8 bg-violet-950 border border-gray-300 pl-4" type="email" id="logEmail">
            </div>
            <div class="flex flex-col">
                <label class="mt-3 mb-0.5" for="logPassword">Mot de passe</label>
                <input v-model="signInput.password" class="h-8 bg-violet-950 border border-gray-300 pl-4" type="password" id="logPassword">
            </div>
            <div class="flex flex-col">
                <label class="mt-3 mb-0.5" for="logConfirmPassword">Confirmation mot de passe</label>
                <input v-model="signInput.confirm" class="h-8 bg-violet-950 border border-gray-300 pl-4" type="password" id="logConfirmPassword">
            </div>
            <input class="bg-blue-600 h-8 rounded cursor-pointer text-white w-full mt-6 hover:bg-blue-500 transition-colors" type="submit" value="Créer un compte">
        </form>
    </main>    
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    const apiUrl = import.meta.env.VITE_API_URL;

    const logged = ref([false]);
    const signInput = ref({
        email: "",
        password: "",
        confirm: ""
    });

    onMounted(() => {
        let getToken = localStorage.getItem('vue_polls_token');
    });

    /**
     * validate form before sign up
     * 
     * @param {*} e 
     */
    const validateSign = (e) => {
        e.preventDefault();
        const errorCont = document.getElementById('signError');

        errorCont.innerHTML = "";
        
        if (signInput.value.email === "" || signInput.value.password === "" || signInput.value.confirm === "") {
            let error = document.createElement('p');
            error.textContent = '- Tous les champs sont requis.';
            return errorCont.appendChild(error);
        }
        
        if (signInput.value.password !== signInput.value.confirm) {
            let error = document.createElement('p');
            error.textContent = '- Les mots de passe doivent être identiques.';
            return errorCont.appendChild(error);
        }

        if (!signInput.value.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i)) {
            let error = document.createElement('p');
            error.textContent = '- L\' email n\'a pas un format valide.';
            return errorCont.appendChild(error);
        }
        if (!signInput.value.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/) || !signInput.value.confirm.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)) {
            let error = document.createElement('p');
            error.textContent = '- Le mot de passe doit contenir minimun 1 lettre 1 chiffre 1 lettre majuscule et 8 caractères.';
            return errorCont.appendChild(error);
        }

        signUp();
    };

    /**
     * create account on database
     */
    const signUp = () => {
        const errorCont = document.getElementById('signError');

        fetch(apiUrl + '/api/user/sign',{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ email: signInput.value.email, password: signInput.value.password })
        })
            .then(res => {
                if (res.status === 201) {

                } else {
                    res.json()
                        .then(data => {
                            const error = document.createElement('p');
                            if (data.message) {
                                error.textContent = "- " + data.message;
                            } else {
                                error.textContent = "- Une erreur est survenue.";
                            }
                            errorCont.appendChild(error);
                        })
                }
            })
    };
</script>

<style scoped>

</style>