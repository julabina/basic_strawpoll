<template>
    <Header class="z-10 relative" :isLogged="logged"/>
    <main class="flex items-center justify-center z-0 h-screen fixed top-0 bottom-0 left-0 right-0 bg-violet-950">
        <section class="flex flex-col items-center justify-center">
            <h1 class="text-5xl text-white font-bold">404</h1>
            <RouterLink to="/">
                <input type="button" value="Retour" class="bg-blue-600 h-10 px-4 rounded cursor-pointer text-white transition-colors hover:bg-blue-500 hover:transition-colors mt-4">
            </RouterLink>
        </section>
    </main>
    <Footer class="absolute bottom-0"/>
</template>

<script setup>
    import Header from '../components/Header.vue';
    import Footer from '../components/Footer.vue';
    import jwt from 'vue-jwt-decode';
    import { ref, onMounted } from 'vue';
    import { RouterLink, useRouter } from 'vue-router';

    const router = useRouter();
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
                router.push('/login');
            } else {
                logged.value = true;
            }
        } else {
            router.push('/login');
        }
    };
</script>