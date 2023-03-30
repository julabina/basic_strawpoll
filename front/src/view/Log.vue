<template> 
    <main>
        <h1>Se connecter</h1>
    </main>    
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    const logged = ref([false]);

    onMounted(() => {
        let getToken = localStorage.getItem('vue_polls_token');
    });
</script>

<style scoped>

</style>