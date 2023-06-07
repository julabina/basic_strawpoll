<template>
    <footer class=" flex justify-center items-center w-full border-t-2 border-white h-16 bg-violet-950">
        <section class="flex justify-between w-2/3">
            <RouterLink to="/">
                <p class="text-white">Vue-polls - 2023</p> 
            </RouterLink>
            <a class="text-white" href="https://julienlenfume.com">Codé par Julien Lenfumé</a>
        </section>
    </footer>
</template>

<script setup>
    import { RouterLink } from 'vue-router';


</script>