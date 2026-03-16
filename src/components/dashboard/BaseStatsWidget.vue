<script lang="ts" setup>
export type StatsWidgetProps = {
    title: string;
    value: string;
    icon: string;
    color?: string;
    subInfo?: string;
};

defineProps<{
    items: StatsWidgetProps[];
    isLoading?: boolean;
}>();

function getIconClasses(icon: string, color?: string): string {
    const baseClasses = 'text-lg';
    const colorClass = color ? `text-${color}-500` : 'text-primary-500';
    return `${baseClasses} ${colorClass} ${icon}`;
}
</script>

<template>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3" v-for="item in items" :key="item.title">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">{{ item.title }}</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ item.value }}</div>
                </div>
                <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i :class="getIconClasses(item.icon, item.color)"></i>
                </div>
            </div>
            <span class="text-primary font-medium">{{ item.subInfo }}</span>
        </div>
    </div>
</template>
