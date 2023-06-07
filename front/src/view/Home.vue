<template>
    <Header class="z-20" :isLogged="logged"/>
    <main class="-z-10 flex justify-center py-10 sm:py-0 px-2 sm:px-0 sm:fixed top-0 bottom-0 left-0 right-0 bg-violet-950 min-h-screen sm:min-h-0">
        <section class="flex flex-col items-center sm:absolute sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 bg-violet-900 w-full sm:w-2/3 py-5 sm:px-20 sm:py-28 rounded-lg">
            <h1 class="font-bold text-5xl text-gray-50 text-center sm:text-start">Créer votre sondage</h1>
            <h2 class="font-bold text-5xl text-blue-300 mt-1 mb-4">Facilement</h2>
            <p class="text-gray-50 w-2/3 text-lg text-center sm:text-start">Vous voulez connaitre les disponibilités de vos amis ou connaitre l'avis de vos collègues sur le nouveau projet ? Créez un sondage et connaissez la réponse à toutes vos questions.</p>
            <div class="mt-7">
                <RouterLink to="/create">
                    <input class="bg-gray-50 h-10 w-48 px-4 rounded cursor-pointer text-blue-600 mr-3 transition-colors hover:bg-gray-300 hover:transition-colors" type="button" value="Créer un sondage">
                </RouterLink>
                <RouterLink to="/sigin">
                    <input v-if="logged === false" class="bg-blue-600 h-10 w-48 px-4 rounded cursor-pointer text-white transition-colors hover:bg-blue-500 hover:transition-colors" type="button" value="S'inscrire">
                </RouterLink>
            </div>
        </section>
    </main>
    <Footer class="sm:absolute bottom-0" />
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import Header from '../components/Header.vue';
    import Footer from '../components/Footer.vue';
    import jwt from 'vue-jwt-decode';

    const logged = ref(false);

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
</script>

<style scoped>

</style>