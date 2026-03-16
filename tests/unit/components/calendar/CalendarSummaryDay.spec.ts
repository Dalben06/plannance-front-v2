import { describe, expect, it } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import CalendarSummaryDay from '@/components/calendar/CalendarSummaryDay.vue';

describe('CalendarSummaryDay', () => {
    it('expense=0: expense element not rendered', () => {
        const wrapper = shallowMount(CalendarSummaryDay, { props: { expense: 0, income: 0 } });
        const divs = wrapper.findAll('div[class*="rose"]');
        expect(divs).toHaveLength(0);
    });

    it('expense=100: expense element rendered with formatted string', () => {
        const wrapper = shallowMount(CalendarSummaryDay, { props: { expense: 100, income: 0 } });
        expect(wrapper.text()).toContain('Spent:');
        expect(wrapper.text()).toContain('$100.00');
    });

    it('income=0: income element not rendered', () => {
        const wrapper = shallowMount(CalendarSummaryDay, { props: { expense: 0, income: 0 } });
        const divs = wrapper.findAll('div[class*="emerald"]');
        expect(divs).toHaveLength(0);
    });

    it('income=50: income element rendered with formatted string', () => {
        const wrapper = shallowMount(CalendarSummaryDay, { props: { expense: 0, income: 50 } });
        expect(wrapper.text()).toContain('Income:');
        expect(wrapper.text()).toContain('$50.00');
    });

    it('both expense > 0 and income > 0: both rendered', () => {
        const wrapper = shallowMount(CalendarSummaryDay, { props: { expense: 100, income: 50 } });
        expect(wrapper.text()).toContain('Spent:');
        expect(wrapper.text()).toContain('Income:');
    });

    it('both expense=0 and income=0: neither rendered', () => {
        const wrapper = shallowMount(CalendarSummaryDay, { props: { expense: 0, income: 0 } });
        expect(wrapper.text()).not.toContain('Spent:');
        expect(wrapper.text()).not.toContain('Income:');
    });
});
