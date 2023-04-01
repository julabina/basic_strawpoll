<template>
    <Header :isLogged="logged"/>
    <main class="flex flex-col items-center bg-violet-950 min-h-screen">
        
    </main>
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import jwt from 'vue-jwt-decode';
    import { useRouter } from 'vue-router';
    import Header from '../components/Header.vue';

    const logged = ref(false);
    const router = useRouter();

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

<style scoped>
</style>