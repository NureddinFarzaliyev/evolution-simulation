<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  label: string;
  modelValue: string | number;
  type?: "text" | "number";
  id?: string;
  placeholder?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit(
    "update:modelValue",
    props.type === "number" ? Number(target.value) : target.value,
  );
}
</script>
<template>
  <div class="flex flex-col">
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      :type="type || 'text'"
      :placeholder="placeholder"
      :value="modelValue"
      @input="onInput"
    />
  </div>
</template>
