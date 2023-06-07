<template>
    <footer class=" flex justify-center items-center border-t-2 border-white h-16 bg-violet-950 w-full">
        <section class="flex justify-between w-full lg:w-2/3 px-4 lg:px-0">
            <RouterLink to="/">
                <p class="text-white">Vue-polls - 2023</p> 
            </RouterLink>
            <a class="text-white" target="_blank" rel="noopener" href="https://julienlenfume.com">Codé par Julien Lenfumé</a>
        </section>
    </footer>
</template>

<script setup>
    import { RouterLink } from 'vue-router';


</script>