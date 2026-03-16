<script setup lang="ts">
// REDESIGN: replaced SAKAI SVG + 4-column link grid with Plannance brand + copyright + 2 buttons
const year = new Date().getFullYear();
</script>

<template>
    <!-- REDESIGN: simplified footer — brand, copyright, About + Start buttons; removed link columns -->
    <div class="py-8 px-6 mx-0 lg:mx-20 border-t border-surface-200 dark:border-surface-700">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <!-- Brand + copyright -->
            <div class="text-center md:text-left">
                <div class="font-extrabold text-2xl tracking-tight text-surface-900 dark:text-surface-0">Plannance</div>
                <div class="mt-1 text-sm text-surface-600 dark:text-surface-200">© {{ year }} Plannance. All rights reserved.</div>
            </div>
            <!-- Navigation buttons -->
            <div class="flex gap-3">
                <!-- <Button label="About" text as="router-link" to="/about" rounded severity="secondary"></Button> -->
                <Button label="Start" as="router-link" to="/home/calendar" rounded></Button>
            </div>
        </div>
    </div>
</template>
