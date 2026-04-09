/**
 * Shared component stubs for unit tests.
 *
 * Import the stubs you need and pass them to `global.stubs` in your mount options:
 *
 *   import { InputTextStub, ButtonStub } from '@tests/stubs'
 *
 *   mount(MyComponent, {
 *     global: { stubs: { InputText: InputTextStub, Button: ButtonStub } }
 *   })
 */

// ---------------------------------------------------------------------------
// PrimeVue stubs
// ---------------------------------------------------------------------------

/**
 * Renders a plain <input> wired to v-model so setValue() works in tests.
 * Use in place of PrimeVue's InputText component.
 */
export const InputTextStub = {
    template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    props: ['modelValue'],
    emits: ['update:modelValue']
};

/**
 * Renders a plain <input type="password"> wired to v-model so setValue() works in tests.
 * Use in place of PrimeVue's Password component.
 */
export const PasswordStub = {
    template: '<input type="password" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    props: ['modelValue'],
    emits: ['update:modelValue']
};

/**
 * Renders a plain <button> with data-testid="submit-button".
 * Supports label, disabled, loading and type props so button-state assertions work.
 * Use in place of PrimeVue's Button component.
 */
export const ButtonStub = {
    template: '<button :type="type || \'button\'" :disabled="disabled || loading" data-testid="submit-button">{{ label }}</button>',
    props: ['label', 'disabled', 'loading', 'type']
};

/**
 * Renders a <div data-testid="login-error"> with a slot so text-content assertions work.
 * Use in place of PrimeVue's Message component.
 */
export const MessageStub = {
    template: '<div data-testid="login-error"><slot /></div>',
    props: ['severity']
};

/**
 * Renders an empty <div> with declared props and emit so findComponent().props() works.
 * Use in place of PrimeVue's Select (dropdown) component.
 */
export const SelectStub = {
    props: ['options', 'modelValue', 'invalid', 'placeholder'],
    emits: ['update:modelValue'],
    template: '<div></div>'
};

// ---------------------------------------------------------------------------
// Vue Router stubs
// ---------------------------------------------------------------------------

/**
 * Renders an <a> tag that passes through its default slot.
 * Use in place of Vue Router's RouterLink / <router-link>.
 */
export const RouterLinkStub = {
    template: '<a><slot /></a>'
};

/**
 * Renders a <div data-testid="router-view-stub"> so the outlet slot can be asserted.
 * Use in place of Vue Router's RouterView / <router-view>.
 */
export const RouterViewStub = {
    template: '<div data-testid="router-view-stub" />'
};

// ---------------------------------------------------------------------------
// Custom app component stubs
// ---------------------------------------------------------------------------

/**
 * Renders an empty <div>.
 * Use in place of the FloatingConfigurator layout component.
 */
export const FloatingConfiguratorStub = {
    template: '<div />'
};

/**
 * Renders an empty <div>.
 * Use in place of the GoogleAuth component.
 */
export const GoogleAuthStub = {
    template: '<div />'
};
