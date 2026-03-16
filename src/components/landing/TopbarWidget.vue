<script setup lang="ts">
// REDESIGN: updated nav targets and labels; Login→About, Register→Start now
function smoothScroll(id: string) {
    document.body.click();
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}
</script>

<template>
    <!-- REDESIGN: replaced SAKAI SVG logo + text with Plannance brand name -->
    <div class="flex items-center p-4 m-4">
        <img src="/plannance.svg" alt="" srcset="" class="mr-2 w-8 shrink-0" />
        <span class="text-surface-900 dark:text-surface-0 font-extrabold text-2xl tracking-tight">Plannance</span>
    </div>
    <!-- <img src="/plannance.svg" alt="" srcset="" class="mr-2 w-8 shrink-0" />
    <a class="flex items-center p-4" href="#">
        <span class="text-surface-900 dark:text-surface-0 font-extrabold text-2xl tracking-tight">Plannance</span>
    </a> -->
    <Button
        class="lg:hidden!"
        text
        severity="secondary"
        rounded
        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
    >
        <i class="pi pi-bars text-2xl!"></i>
    </Button>
    <div class="items-center bg-surface-0 dark:bg-surface-900 grow justify-between hidden lg:flex absolute lg:static w-full left-0 top-full px-12 lg:px-0 z-20 rounded-border">
        <!-- REDESIGN: updated nav labels and scroll targets -->
        <ul class="list-none p-0 m-0 flex lg:items-center select-none flex-col lg:flex-row cursor-pointer gap-8">
            <li>
                <a @click="smoothScroll('hero')" class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                    <span>Home</span>
                </a>
            </li>
            <li>
                <a @click="smoothScroll('features')" class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                    <span>Features</span>
                </a>
            </li>
            <li>
                <a @click="smoothScroll('steps')" class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                    <span>How it works</span>
                </a>
            </li>
            <li>
                <a @click="smoothScroll('faq')" class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                    <span>FAQ</span>
                </a>
            </li>
        </ul>
        <!-- REDESIGN: Login→About (/about), Register→Start now (/calendar) -->
        <div class="flex border-t lg:border-t-0 border-surface py-4 lg:py-0 mt-4 lg:mt-0 gap-2">
            <!-- <Button label="About" text as="router-link" to="/about" rounded></Button> -->
            <Button label="Start now" as="router-link" to="/home/calendar" rounded></Button>
        </div>
    </div>
</template>
