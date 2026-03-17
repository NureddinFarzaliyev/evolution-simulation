<template>
  <div class="code-block-container">
    <div v-if="label" class="code-label">{{ label }}</div>
    <pre
      :class="[`language-${language}`, 'custom-scrollbar']"
    ><code ref="codeElement">{{ code.trim() }}</code></pre>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Prism from "prismjs";
// Basic Prism TS support
import "prismjs/components/prism-typescript";

interface Props {
  code: string;
  language?: string;
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  language: "typescript",
  label: "",
});

const codeElement = ref<HTMLElement | null>(null);

const highlight = () => {
  if (codeElement.value) {
    Prism.highlightElement(codeElement.value);
  }
};

onMounted(highlight);
watch(() => props.code, highlight);
</script>

<style scoped>
.code-block-container {
  background-color: var(--color-bg-secondary);
  border: 1px solid rgba(200, 169, 107, 0.2); /* Subtle accent border */
  border-radius: 8px;
  margin: 1.5rem 0;
  overflow: hidden;
}

.code-label {
  font-family: var(--font-primary);
  color: var(--color-accent);
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid rgba(200, 169, 107, 0.1);
  text-transform: uppercase;
  letter-spacing: 0.1rem;
}

pre {
  margin: 0;
  padding: 1.25rem;
  overflow-x: auto;
  background: transparent !important; /* Let container handle BG */
}

code {
  font-family:
    "Fira Code", "Courier New", monospace; /* Monospace for code, not serif */
  font-size: 0.8rem;
  line-height: 1.5;
  color: var(--color-text-primary);
  text-shadow: none;
}

/* Custom Scrollbar for that Primary BG feel */
.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: var(--color-bg-primary);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-accent);
}

/* Prism Overrides to match your @theme */
:deep(.token.comment),
:deep(.token.prolog),
:deep(.token.doctype),
:deep(.token.cdata) {
  color: var(--color-text-secondary);
  font-style: italic;
}

:deep(.token.function),
:deep(.token.class-name) {
  color: var(--color-accent);
}

:deep(.token.keyword),
:deep(.token.operator) {
  color: #d49a7a; /* A slightly warmer shift of your accent for logic */
}

:deep(.token.string),
:deep(.token.char) {
  color: #a8b38d; /* A muted sage to complement the gold */
}

:deep(.token.number),
:deep(.token.boolean) {
  color: var(--color-accent);
  font-weight: bold;
}
</style>
