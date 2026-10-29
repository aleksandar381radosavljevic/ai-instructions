# Vue

- Files: `Name.vue` (script setup with TypeScript, template, `<style scoped>`) with `Name.test.ts` next to it.
- Props with `defineProps<{ ... }>()` and defaults through destructuring; events with `defineEmits<{ ... }>()`; `defineModel` for two-way bindings.
- Visual options are a union-typed prop (`variant: 'primary' | 'secondary'`), not an `enum` (decision 0010).
- Attributes fall through to the root element by default; keep it the native element, or set `inheritAttrs: false` and bind `$attrs` deliberately.
- For a dialog, menu, combobox, tabs or popover, start from the Reka UI primitive and style it with tokens; don't rebuild focus and keyboard handling.
- Expose a template ref only through `defineExpose`, and only when callers need it.
- Tests use Vitest and Vue Test Utils: `mount`, then select by element and accessible name, text or `data-test`, never by styling classes; check `emitted()` for events.
