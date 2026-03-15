<script setup lang="ts">
// REDESIGN: calendar card replaces demo image; dark mode via scoped style
</script>

<template>
    <!-- REDESIGN: replaced SAKAI placeholder text + image with Plannance copy + calendar card; dark mode via scoped style -->
    <div id="hero" class="flex flex-col pt-6 px-6 lg:px-20 overflow-hidden">
        <div class="mx-6 md:mx-20 mt-0 md:mt-6 flex flex-col lg:flex-row gap-12 items-center justify-between">
            <!-- Left: copy block -->
            <div class="flex-1 max-w-xl">
                <!-- Brand pill -->
                <div class="inline-flex items-center rounded-full border border-surface-300 dark:border-surface-600 px-4 py-1 mb-6 text-sm font-medium text-surface-700 dark:text-surface-200 bg-surface-0/60 dark:bg-surface-900/60">
                    Plannance — financial calendar
                </div>
                <h1 class="text-5xl font-bold text-gray-900 dark:text-surface-0 leading-tight mb-4">Your finances, planned like a calendar.</h1>
                <p class="font-normal text-2xl leading-normal text-gray-700 dark:text-surface-200 mb-8">Plan your money. See your cash flow. Stay ahead.</p>
                <div class="flex gap-4 mb-8">
                    <Button label="Start now" as="router-link" to="home/calendar" rounded class="text-xl! px-4!"></Button>
                    <Button label="Learn more" as="router-link" to="/about" text rounded severity="secondary" class="text-xl! px-4!"></Button>
                </div>
                <!-- Bullet list -->
                <ul class="list-none p-0 m-0 flex flex-col gap-3">
                    <li class="flex items-center gap-3 text-gray-700 dark:text-surface-200 text-lg">
                        <i class="pi pi-check-circle text-primary text-xl"></i>
                        Credits &amp; debits, day-by-day
                    </li>
                    <li class="flex items-center gap-3 text-gray-700 dark:text-surface-200 text-lg">
                        <i class="pi pi-check-circle text-primary text-xl"></i>
                        Monthly income/expense totals
                    </li>
                    <li class="flex items-center gap-3 text-gray-700 dark:text-surface-200 text-lg">
                        <i class="pi pi-check-circle text-primary text-xl"></i>
                        Recurring bills &amp; reminders
                    </li>
                </ul>
            </div>

            <!-- Right: calendar preview card -->
            <div class="flex-1 flex justify-center md:justify-end pb-8">
                <div class="rounded-3xl border border-surface-200 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 p-4 shadow-2xl w-full max-w-sm">
                    <!-- Calendar header -->
                    <div class="flex items-center justify-between mb-3 px-1">
                        <span class="font-semibold text-surface-900 dark:text-surface-0 text-sm">March 2026</span>
                        <div class="flex gap-1">
                            <i class="pi pi-chevron-left text-surface-400 text-xs cursor-pointer"></i>
                            <i class="pi pi-chevron-right text-surface-400 text-xs cursor-pointer"></i>
                        </div>
                    </div>
                    <!-- Day labels -->
                    <div class="grid grid-cols-7 mb-1">
                        <template v-for="d in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="d">
                            <div class="text-center text-xs text-surface-400 font-medium py-1">{{ d }}</div>
                        </template>
                    </div>
                    <!-- Calendar cells (5 rows × 7) -->
                    <div class="grid grid-cols-7 gap-y-1">
                        <template v-for="cell in 35" :key="cell">
                            <div
                                class="flex items-center justify-center text-xs rounded-md h-8 cursor-pointer"
                                :class="[
                                    cell === 15 ? 'bg-primary text-white font-bold' : 'text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800',
                                    [6, 7, 13, 14, 20, 21, 27, 28].includes(cell) ? 'text-surface-400' : ''
                                ]"
                            >
                                {{ cell <= 31 ? cell : '' }}
                            </div>
                        </template>
                    </div>
                    <!-- Stats row -->
                    <div class="flex justify-between mt-4 pt-3 border-t border-surface-200 dark:border-surface-700 text-xs">
                        <div class="flex flex-col items-center gap-0.5">
                            <span class="text-green-600 font-bold">+$4,200</span>
                            <span class="text-surface-400">Income</span>
                        </div>
                        <div class="flex flex-col items-center gap-0.5">
                            <span class="text-red-500 font-bold">-$2,980</span>
                            <span class="text-surface-400">Expenses</span>
                        </div>
                        <div class="flex flex-col items-center gap-0.5">
                            <span class="text-surface-900 dark:text-surface-0 font-bold">$1,220</span>
                            <span class="text-surface-400">Balance</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* REDESIGN: dark mode hero background override — inline gradient is light-only */
:global(.app-dark) #hero {
    background: radial-gradient(ellipse at 80% 10%, rgba(96, 165, 250, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(167, 139, 250, 0.3) 0%, transparent 50%), #0b1220 !important;
    clip-path: ellipse(150% 87% at 93% 13%);
}
</style>
