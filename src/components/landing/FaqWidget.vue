<template>
    <!-- REDESIGN: new component; replaces PricingWidget in Landing.vue; styled accordion with border cards -->
    <div id="faq" class="py-6 px-6 lg:px-20 my-2 md:my-6">
        <div class="text-center mb-10">
            <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">FAQ</div>
            <span class="text-muted-color text-2xl">Quick answers before you start.</span>
        </div>

        <div class="flex flex-col gap-4 max-w-3xl mx-auto">
            <!-- Q1 -->
            <details class="border-surface-200 dark:border-surface-600 border-2 rounded-[10px] p-4">
                <summary class="cursor-pointer font-bold text-surface-900 dark:text-surface-0 text-xl list-none">Is Plannance a budgeting app?</summary>
                <p class="text-surface-700 dark:text-surface-100 text-xl leading-normal mt-3 mb-0">It's planning-first: you schedule income/expenses on a calendar to understand cash flow before it happens.</p>
            </details>

            <!-- Q2 -->
            <details class="border-surface-200 dark:border-surface-600 border-2 rounded-[10px] p-4">
                <summary class="cursor-pointer font-bold text-surface-900 dark:text-surface-0 text-xl list-none">Can I track both income and expenses?</summary>
                <p class="text-surface-700 dark:text-surface-100 text-xl leading-normal mt-3 mb-0">Yes. Events are marked as credit (income) or debit (expense), with totals shown by day and month.</p>
            </details>

            <!-- Q3 -->
            <details class="border-surface-200 dark:border-surface-600 border-2 rounded-[10px] p-4">
                <summary class="cursor-pointer font-bold text-surface-900 dark:text-surface-0 text-xl list-none">What's the main benefit?</summary>
                <p class="text-surface-700 dark:text-surface-100 text-xl leading-normal mt-3 mb-0">Clarity. You can quickly spot tight weeks, upcoming bills, and how decisions change your month.</p>
            </details>
        </div>
    </div>
</template>
