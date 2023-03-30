<template>
    <header class="flex justify-center border-b pb-5 bg-violet-950">
        <div class="flex justify-between w-2/3 mt-4">
            <div class="flex h-8 items-center text-white">
                <h2>Vue-polls</h2>
                <nav>
                    <p>Créer un sondage</p>
                </nav>
            </div>
            <div v-if="logged === true" class="flex">
                <p>ACOMPLETER</p>
            </div>
            <div v-else class="flex">
                <RouterLink to="/login">
                    <input class="h-8 px-4 rounded cursor-pointer text-white mr-1.5" type="button" value="Se connecter">
                </RouterLink>
                <RouterLink to="/signup">
                    <input class="bg-blue-600 h-8 px-4 rounded cursor-pointer text-white" type="button" value="S'enregistrer">
                </RouterLink>
            </div>
        </div>
    </header>
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