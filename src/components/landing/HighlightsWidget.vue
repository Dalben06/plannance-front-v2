<script setup lang="ts">
// REDESIGN: repurposed from "Highlights" to "How It Works"; replaced demo images with step cards + CTA
</script>

<template>
    <!-- REDESIGN: id changed highlights→steps; full content replacement with 3-col step cards and CTA banner -->
    <div id="steps" class="py-6 px-6 lg:px-20 mx-0 my-12 lg:mx-20">
        <div class="text-center mb-16">
            <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">How it works</div>
            <span class="text-muted-color text-2xl">Start simple. Add events. See your month instantly.</span>
        </div>

        <!-- 3-column step cards -->
        <div class="grid grid-cols-12 gap-8 mb-16">
            <!-- Step 1 -->
            <div class="col-span-12 lg:col-span-4 flex flex-col items-center text-center gap-4">
                <div class="flex items-center justify-center bg-primary text-white font-bold text-2xl rounded-full" style="width: 3.5rem; height: 3.5rem">1</div>
                <h3 class="text-surface-900 dark:text-surface-0 text-2xl font-semibold">Add your first event</h3>
                <p class="text-surface-700 dark:text-surface-100 text-xl leading-normal" style="max-width: 320px">Create an income or expense event with a date and amount.</p>
            </div>

            <!-- Step 2 -->
            <div class="col-span-12 lg:col-span-4 flex flex-col items-center text-center gap-4">
                <div class="flex items-center justify-center bg-primary text-white font-bold text-2xl rounded-full" style="width: 3.5rem; height: 3.5rem">2</div>
                <h3 class="text-surface-900 dark:text-surface-0 text-2xl font-semibold">Review your month</h3>
                <p class="text-surface-700 dark:text-surface-100 text-xl leading-normal" style="max-width: 320px">See day-by-day cash flow and monthly totals instantly.</p>
            </div>

            <!-- Step 3 -->
            <div class="col-span-12 lg:col-span-4 flex flex-col items-center text-center gap-4">
                <div class="flex items-center justify-center bg-primary text-white font-bold text-2xl rounded-full" style="width: 3.5rem; height: 3.5rem">3</div>
                <h3 class="text-surface-900 dark:text-surface-0 text-2xl font-semibold">Improve and repeat</h3>
                <p class="text-surface-700 dark:text-surface-100 text-xl leading-normal" style="max-width: 320px">Turn one-time events into recurring items and keep refining.</p>
            </div>
        </div>

        <!-- CTA banner -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl border border-surface-200 dark:border-surface-600 bg-surface-50 dark:bg-surface-800 p-8">
            <div>
                <div class="text-surface-900 dark:text-surface-0 text-2xl font-semibold mb-1">Ready to plan your next month?</div>
                <p class="text-surface-700 dark:text-surface-100 text-xl leading-normal m-0">Jump into the calendar and create your first credit or debit event.</p>
            </div>
            <Button label="Open calendar" as="router-link" to="home/calendar" rounded class="text-xl! px-6! shrink-0"></Button>
        </div>
    </div>
</template>
