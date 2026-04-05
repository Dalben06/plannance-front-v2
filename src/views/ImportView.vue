<script lang="ts" setup>
import ImportPendingTable from '@/components/import/ImportPendingTable.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

function goToRegister() {
    router.push({ name: 'import-register' });
}
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 flex justify-end">
            <Button label="New Import" icon="pi pi-upload" data-testid="new-import-button" @click="goToRegister" />
        </div>
        <div class="col-span-12">
            <ImportPendingTable />
        </div>
    </div>
</template>
