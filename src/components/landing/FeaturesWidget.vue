<template>
    <!-- REDESIGN: updated title/subtitle; replaced 9 SAKAI cards with 6 Plannance feature cards; removed testimonial block -->
    <div id="features" class="py-6 px-6 lg:px-20 mt-8 mx-0 lg:mx-20">
        <div class="grid grid-cols-12 gap-4 justify-center">
            <div class="col-span-12 text-center mt-20 mb-6">
                <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">What you can do with Plannance</div>
                <span class="text-muted-color text-2xl">Build a plan you can actually follow: schedule money events and make decisions with confidence.</span>
            </div>

            <!-- REDESIGN: Card 1 — Cash-flow calendar -->
            <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
                <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(187, 199, 205, 0.2)), linear-gradient(180deg, rgba(145, 226, 237, 0.2), rgba(195, 227, 250, 0.2))">
                    <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                        <div class="flex items-center justify-center bg-cyan-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                            <i class="pi pi-fw pi-calendar text-2xl! text-cyan-700"></i>
                        </div>
                        <h5 class="mb-2 text-surface-900 dark:text-surface-0">Cash-flow calendar</h5>
                        <span class="text-surface-600 dark:text-surface-200">See every credit and debit mapped to its day.</span>
                    </div>
                </div>
            </div>

            <!-- REDESIGN: Card 2 — Smart categories -->
            <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
                <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(253, 228, 165, 0.2), rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(172, 180, 223, 0.2))">
                    <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                        <div class="flex items-center justify-center bg-yellow-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                            <i class="pi pi-fw pi-tag text-2xl! text-yellow-700"></i>
                        </div>
                        <h5 class="mb-2 text-surface-900 dark:text-surface-0">Smart categories</h5>
                        <span class="text-surface-600 dark:text-surface-200">Tag events so totals break down by category.</span>
                    </div>
                </div>
            </div>

            <!-- REDESIGN: Card 3 — Monthly snapshot -->
            <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pb-8 mt-6 lg:mt-0">
                <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(172, 180, 223, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(160, 210, 250, 0.2))">
                    <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                        <div class="flex items-center justify-center bg-indigo-200" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                            <i class="pi pi-fw pi-chart-bar text-2xl! text-indigo-700"></i>
                        </div>
                        <div class="mt-3 mb-1 text-surface-900 dark:text-surface-0 text-xl font-semibold">Monthly snapshot</div>
                        <span class="text-surface-600 dark:text-surface-200">Income vs expense summary at a glance.</span>
                    </div>
                </div>
            </div>

            <!-- REDESIGN: Card 4 — Recurring bills -->
            <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
                <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 210, 204, 0.2), rgba(160, 210, 250, 0.2)), linear-gradient(180deg, rgba(187, 199, 205, 0.2), rgba(145, 210, 204, 0.2))">
                    <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                        <div class="flex items-center justify-center bg-teal-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                            <i class="pi pi-fw pi-refresh text-2xl! text-teal-700"></i>
                        </div>
                        <div class="mt-6 mb-1 text-surface-900 dark:text-surface-0 text-xl font-semibold">Recurring bills</div>
                        <span class="text-surface-600 dark:text-surface-200">Set it once; auto-populate every period.</span>
                    </div>
                </div>
            </div>

            <!-- REDESIGN: Card 5 — Goals & reminders -->
            <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
                <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(251, 199, 145, 0.2), rgba(246, 158, 188, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(246, 158, 188, 0.2))">
                    <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                        <div class="flex items-center justify-center bg-orange-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                            <i class="pi pi-fw pi-flag text-2xl! text-orange-700"></i>
                        </div>
                        <div class="mt-6 mb-1 text-surface-900 dark:text-surface-0 text-xl font-semibold">Goals &amp; reminders</div>
                        <span class="text-surface-600 dark:text-surface-200">Mark milestones and get notified in time.</span>
                    </div>
                </div>
            </div>

            <!-- REDESIGN: Card 6 — Private by default -->
            <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pb-8 mt-6 lg:mt-0">
                <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(187, 199, 205, 0.2), rgba(145, 210, 204, 0.2)), linear-gradient(180deg, rgba(187, 199, 205, 0.2), rgba(212, 162, 221, 0.2))">
                    <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                        <div class="flex items-center justify-center bg-slate-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                            <i class="pi pi-fw pi-lock text-2xl! text-slate-700"></i>
                        </div>
                        <div class="mt-6 mb-1 text-surface-900 dark:text-surface-0 text-xl font-semibold">Private by default</div>
                        <span class="text-surface-600 dark:text-surface-200">Your data stays yours — no sharing, no ads.</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
