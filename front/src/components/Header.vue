<template>
    <header class="flex justify-center border-b pb-5 bg-violet-950">
        <div class="flex justify-between w-2/3 mt-4">
            <div class="flex h-8 items-center text-white">
                <RouterLink class="mr-7" to="/">
                    <h2>Vue-polls</h2>
                </RouterLink>
                <nav>
                    <p class="cursor-pointer transition-colors hover:text-gray-400 hover:transition-colors">Créer un sondage</p>
                </nav>
            </div>
            <div v-if="isLogged === true" class="flex">
                <RouterLink to="/profil">
                    <input class="bg-blue-600 h-8 px-4 rounded cursor-pointer text-white transition-colors hover:bg-blue-500 hover:transition-colors" type="button" value="Profil">
                </RouterLink>
            </div>
            <div v-else class="flex">
                <RouterLink to="/login">
                    <input class="h-8 px-4 rounded cursor-pointer text-white mr-1.5 transition-colors hover:text-gray-400 hover:transition-colors" type="button" value="Se connecter">
                </RouterLink>
                <RouterLink to="/signup">
                    <input class="bg-blue-600 h-8 px-4 rounded cursor-pointer text-white transition-colors hover:bg-blue-500 hover:transition-colors" type="button" value="S'enregistrer">
                </RouterLink>
            </div>
        </div>
    </header>
</template>

<script setup>
    import { defineProps } from 'vue';

    const props = defineProps({
        isLogged: Boolean,
    });
    
</script>

<style scoped>

</style>