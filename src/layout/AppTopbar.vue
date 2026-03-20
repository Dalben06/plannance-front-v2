<script setup lang="ts">
import { useCalendarEventModal } from '@/composable/calendar/useCalendarEventModal';
import { useLayout } from '@/layout/composables/layout';
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import AppConfigurator from './AppConfigurator.vue';

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();
const { openForCreate } = useCalendarEventModal();
const profileMenu = ref<{ toggle: (event: Event) => void } | null>(null);
const auth = useAuthStore();
const menuItems = [
    {
        label: 'Profile',
        items: [
            {
                label: 'Settings',
                icon: 'pi pi-cog'
            },
            {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                command: async () => {
                    auth.logout();
                    await router.push({ path: '/home' });
                }
            }
        ]
    }
];

function toggleProfileMenu(event: Event) {
    profileMenu.value?.toggle(event);
}
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/home" class="layout-topbar-logo">
                <img src="/plannance.svg" alt="" srcset="" class="m-8 w-8 shrink-0 mx-auto" />
                <span>Plannance</span>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
                <div class="relative">
                    <button
                        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'p-anchored-overlay-enter-active', leaveToClass: 'hidden', leaveActiveClass: 'p-anchored-overlay-leave-active', hideOnOutsideClick: true }"
                        type="button"
                        class="layout-topbar-action layout-topbar-action-highlight"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <AppConfigurator />
                </div>
            </div>

            <button
                class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'p-anchored-overlay-enter-active', leaveToClass: 'hidden', leaveActiveClass: 'p-anchored-overlay-leave-active', hideOnOutsideClick: true }"
            >
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action" title="Add Event" @click="openForCreate">
                        <i class="pi pi-plus"></i>
                        <span>Add Event</span>
                    </button>
                    <router-link type="button" class="layout-topbar-action" to="/home/calendar">
                        <i class="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </router-link>
                    <button type="button" class="layout-topbar-action" @click="toggleProfileMenu">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                    <Menu ref="profileMenu" :model="menuItems" :popup="true" />
                </div>
            </div>
        </div>
    </div>
</template>
