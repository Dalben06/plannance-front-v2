import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import StatsWidget from '@/components/dashboard/StatsWidget.vue';

describe('StatsWidget', () => {
    it('renders correctly', () => {
        const wrapper = mount(StatsWidget);
        expect(wrapper.exists()).toBe(true);
    });

    it('displays Orders stat', () => {
        const wrapper = mount(StatsWidget);
        expect(wrapper.text()).toContain('Orders');
    });

    it('displays Revenue stat', () => {
        const wrapper = mount(StatsWidget);
        expect(wrapper.text()).toContain('Revenue');
    });

    it('displays Customers stat', () => {
        const wrapper = mount(StatsWidget);
        expect(wrapper.text()).toContain('Customers');
    });

    it('displays Comments stat', () => {
        const wrapper = mount(StatsWidget);
        expect(wrapper.text()).toContain('Comments');
    });
});
