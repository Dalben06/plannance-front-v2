import { createPinia, setActivePinia } from 'pinia';
import { shallowMount, type ComponentMountingOptions } from '@vue/test-utils';
import type { Component } from 'vue';

export function createTestPinia() {
    const pinia = createPinia();
    setActivePinia(pinia);
    return pinia;
}

export function mountWithPinia<T extends Component>(component: T, opts: ComponentMountingOptions<T> = {}) {
    return shallowMount(component, {
        ...opts,
        global: {
            plugins: [createTestPinia()],
            ...opts.global
        }
    });
}
