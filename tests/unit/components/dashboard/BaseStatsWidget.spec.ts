import { describe, expect, it } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import BaseStatsWidget from '@/components/dashboard/BaseStatsWidget.vue';

const sampleItems = [
    { title: 'Expenses', value: '$500.00', icon: 'pi pi-chart-bar', color: 'red' },
    { title: 'Income', value: '$1000.00', icon: 'pi pi-arrow-up', color: 'green' },
    { title: 'Budget', value: '$4000.00', icon: 'pi pi-chart-pie', color: 'violet' }
];

describe('BaseStatsWidget', () => {
    it('renders correct number of items from items prop', () => {
        const wrapper = shallowMount(BaseStatsWidget, { props: { items: sampleItems } });
        const cards = wrapper.findAll('.card');
        expect(cards).toHaveLength(sampleItems.length);
    });

    it('renders each item title', () => {
        const wrapper = shallowMount(BaseStatsWidget, { props: { items: sampleItems } });
        expect(wrapper.text()).toContain('Expenses');
        expect(wrapper.text()).toContain('Income');
        expect(wrapper.text()).toContain('Budget');
    });

    it('renders each item value', () => {
        const wrapper = shallowMount(BaseStatsWidget, { props: { items: sampleItems } });
        expect(wrapper.text()).toContain('$500.00');
        expect(wrapper.text()).toContain('$1000.00');
    });

    it('getIconClasses with color: contains text-red-500 and icon class', () => {
        const wrapper = shallowMount(BaseStatsWidget, { props: { items: sampleItems } });
        const icon = wrapper.find('i');
        expect(icon.classes().join(' ')).toContain('text-red-500');
        expect(icon.classes().join(' ')).toContain('pi-chart-bar');
    });

    it('getIconClasses without color: contains text-primary-500', () => {
        const itemsNoColor = [{ title: 'Test', value: '$0', icon: 'pi pi-star' }];
        const wrapper = shallowMount(BaseStatsWidget, { props: { items: itemsNoColor } });
        const icon = wrapper.find('i');
        expect(icon.classes().join(' ')).toContain('text-primary-500');
    });

    it('renders empty state with no items', () => {
        const wrapper = shallowMount(BaseStatsWidget, { props: { items: [] } });
        expect(wrapper.findAll('.card')).toHaveLength(0);
    });
});
