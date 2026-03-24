<script setup lang="ts">
import InputLabelGroup from "@/shared/ui/InputLabelGroup.vue";
import { type GotohParameters } from "../../../api/src/core/core/sequenceAlignment/gotohAlgorithm";

import { ref } from "vue";
import CodeBlock from "@/shared/ui/CodeBlock.vue";
const params = ref<
  { a: string; b: string } & Omit<GotohParameters, "scoringMatrix">
>({
  a: "MVHLTPEEKSAVTALWGKVNVDEVGGEALGRLLVVYPWTQRFFESFGDLSTPDAVMGNPKVKAHGKKVLGAFSDGLAHLDNLKGTFATLSELHCDKLHVDPENFRLLGNVLVCVLAHHFGKEFTPPVQAAYQKVVAGVANALAHKYH",
  b: "MVLSAADKTNVKAAWSKVGGHAGEYGAEALERMFLGFPTTKTYFPHFDLSHGSAQVKAHGKKVGDALTLAVGHLDDLPGALSNLSDLHAHKLRVDPVNFKLLSHCLLSTLAVHLPNDFTPAVHASLDKFLSSVSTVLTSKYR",
  gapOpen: -11,
  gapExtend: -1,
  lambda: 0.3176,
  k: 0.134,
});
const loading = ref(false);
const algorithmResult = ref<{
  alignedA: string;
  alignedB: string;
  maxScore: number;
  eValue: number;
  bitScore: number;
} | null>(null);

const align = async () => {
  loading.value = true;
  const paramsToSend: Record<string, string> = {
    a: params.value.a,
    b: params.value.b,
    gapOpen: String(params.value.gapOpen),
    gapExtend: String(params.value.gapExtend),
    lambda: String(params.value.lambda),
    k: String(params.value.k),
  };

  const queryParams = new URLSearchParams(paramsToSend).toString();
  try {
    const response = await fetch(`http://localhost:3000/gotoh?${queryParams}`);
    const result = await response.json();
    algorithmResult.value = result;
  } catch (error) {
    console.error("Error fetching alignment result:", error);
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <div>
    <h1>Genetic Algorithm Implementation</h1>
    <h3>Configure Parameters</h3>
    <InputLabelGroup
      label="Sequence A (Example: Human Hemoglobin)"
      v-model="params.a"
      placeholder="Enter first sequence"
    />
    <InputLabelGroup
      label="Sequence B (Example: Horse Hemoglobin)"
      v-model="params.b"
      placeholder="Enter second sequence"
    />
    <InputLabelGroup
      label="Gap Open Penalty"
      v-model="params.gapOpen"
      placeholder="Enter gap open penalty"
    />
    <InputLabelGroup
      label="Gap Extend Penalty"
      v-model="params.gapExtend"
      placeholder="Enter gap extend penalty"
    />
    <InputLabelGroup
      label="Lambda"
      v-model="params.lambda"
      placeholder="Enter lambda parameter"
    />
    <InputLabelGroup
      label="K"
      v-model="params.k"
      placeholder="Enter k parameter"
    />
    <button
      class="mt-4 px-4 py-2 bg-accent text-white rounded hover:bg-accent-dark disabled:opacity-50"
      @click="align"
      :disabled="loading"
    >
      {{ loading ? "Aligning..." : "Align Sequences" }}
    </button>
    <div v-if="!loading && algorithmResult" class="mt-6">
      <h3 class="mt-6">Alignment Result</h3>
      <div>
        <CodeBlock
          :code="`${algorithmResult?.alignedA}
${algorithmResult?.alignedB}`"
          language="plaintext"
          class="max-w-8xl"
        />

        <p><strong>Max Score:</strong> {{ algorithmResult?.maxScore }}</p>
        <p><strong>E-value:</strong> {{ algorithmResult?.eValue }}</p>
        <p>
          E-value is a measure of statistical significance. "In a search space
          of this size, how many times would I see a score this high just by
          pure luck?" E-value should be as close to zero as possible.
        </p>
        <p><strong>Bit Score:</strong> {{ algorithmResult?.bitScore }}</p>
        <p>
          A Bit Score of n means the alignment is 2n times more likely to be a
          real biological match than a random coincidence
        </p>
      </div>
    </div>
  </div>
</template>
