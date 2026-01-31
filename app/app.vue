<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  background: var(--surface-canvas);
}

/* Dark theme fixes for design system tokens */
:root {
  --selectButton-background-hover: #1a2244;
  --selectButton-background-selected: #2a3a6a;
  --selectButton-text-selected: #ffffff;
  --selectButton-border-color-default: #1a2244;
  --selectButton-border-color-hover: #2a3a6a;
  --selectButton-border-color-selected: #4a6aff;
  --selectButton-background-disabled: #0d1225;
  --selectButton-border-color-disabled: #1a2244;
  --dataTable-body-background-striped: #0d1225;
}
</style>
