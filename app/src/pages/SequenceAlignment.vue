<script setup lang="ts">
import CodeBlock from "@/shared/ui/CodeBlock.vue";
import NextChapterBlock from "@/shared/ui/NextChapterBlock.vue";
import ResourceIndicator from "@/shared/ui/ResourceIndicator.vue";
</script>

<template>
  <div>
    <h1>Sequence Alignment</h1>
    <h3>Dynamic Programming</h3>
    <p>
      In order to understand the basis of algorithms used for sequence
      alignment, we need to understand the concept of dynamic programming.
    </p>
    <p>
      Dynamic programming is a computational approach to problem solving that
      essentially works the problem backwards Although it is not particularly
      difficult to solve the problem of finding nth element of Fibonacci
      sequence with a straightforward recursive algorithm, finding the it by a
      recursive approach is very inefficient. Using a standard recursive
      algorithm, determination of the 10th value of the Fibonacci sequence would
      require 109 steps, the formal complexity of the recursive approach to the
      Fibonacci sequence is exponential. Given the first two values, we can
      easily determine the 3rd value, 0 + 1 = 1. The 4th value is the sum of the
      already determined 2nd and 3rd values and therefore is 1 + 1 = 2. At this
      point it is trivial to keep moving forward until one reaches the 10th
      value (5th value = 1 + 2 = 3; 6th value = 2 + 3 = 5; 7th value = 3 + 5 =
      8; 8th value = 5 + 8 = 13; 9th value = 8 + 13 = 21, and 10th value = 13 +
      21 = 34). By avoiding the redundant determination of the lower values, the
      dynamic programming approach takes only 10 steps. That is, the complexity
      is linear, requiring only n steps. <ResourceIndicator number="10" />
    </p>
    <h3>Levenshtein Distance</h3>
    <p>
      Another example of a problem that can be solved by dynamic programming is
      the problem of determining the Levenshtein distance between two strings.
      The Levenshtein distance is the minimum number of single-character edits
      (insertions, deletions, or substitutions) required to change one string
      into the other.
    </p>
    <p>
      If we have the string "horse", and we want to translate it into "ros", the
      minimum number of operations to do it is 3: horse -> rorse, rorse -> rose,
      rose -> ros. <ResourceIndicator number="11" />
    </p>
    <p>
      When we are doing character comparisons we are going to check the
      tranformation distance for every cross-section of substrings between
      strings. <ResourceIndicator number="11" />
    </p>
    <p>Situation 1:</p>
    <CodeBlock
      code="A = 'behyam'
B = 'ephrem'
A[0,5] -> B[0,5]"
      language="text"
    />
    <p>
      A simple example when we try to transform substring `[0,5]` from "behyam"
      to substring `[0,5]` from "ephrem". Both of them are same. So, substring
      transformation from A[0,5] to B[0,5] will have the same edit distance with
      the substring transformation from `A[0,4]` to `B[0,4]`, because we do
      nothing on the last symbol. <ResourceIndicator number="11" />
    </p>
    <p>Situation 2:</p>
    <CodeBlock
      code="A = 'beny'
B = 'eph'
A[0,3] -> B[0,2]"
      language="text"
    />
    <p>
      This situation can be handled by firstly trying to transform "ben" to "ep"
      by dropping mismatching characters at the end, then adding the necessary h
      to the end. This is called replacement, because we replace the y with the
      h. <ResourceIndicator number="11" />
    </p>
    <p>Situation 3:</p>
    <CodeBlock
      code="a = 'beny'
b = 'eph'
a[0,3] -> b[0,2]"
      language="text"
    />
    <p>
      We can also transform the whole A to the substring of B while discarding
      the mismatch ("ep"), then insert the h at the end.<ResourceIndicator
        number="11"
      />
    </p>
    <p>Situation 4:</p>
    <CodeBlock
      code="a = 'beny'
b = 'eph'
a[0,3] -> b[0,2]"
      language="text"
    />
    <p>
      We can tranform "ben" to "eph" and perform a deletion.
      <ResourceIndicator number="11" />
    </p>
    <p>
      All these are methods to transform strings and resolve mismatches. The
      question here is choosing the minimum cost transformation to find the edit
      distance. Then, we can use DP (Dynamic Progamming) tables. Dynamic tables
      help us to solve problems with the help of dividing it into subproblems.
      This is the same as using previous values instead of recursively
      calculating every time, when we calculate Fibonacci nth number with the
      help of dynamic programming. For solving this problem, we can create a DP
      with the empty strings + all symbols in our strings in vertical and
      horizontal line. Then, each cell in our table will be a subproblem which
      contributes to solving the whole problem which is on the bottom-right end
      of the table. For example, for a string transformation `"benyam" ->
      "ephrem"` a `(2,3)` cell will be `"b" -> "ep"`. Then, considering the cost
      for every operation possible, we fill out the table. For example, `(1,4)`
      cell will be `"" -> "eph"` which requires 3 insertion operators. After
      filling out first row and first column, we choose the minimum operation
      for substring with using the table below, and add 1 to it. Also, when we
      want to fill a cell with same symbols in each side, we should write the
      top-left cell's value in it, because same cells don't add up to the number
      of operations and just inherit the substring without considering these
      characters. As mentioned before, the final answer to the question will be
      the number on the bottom-rightmost cell.
      <ResourceIndicator number="11" />
    </p>
    <p>Time and Space complexity:</p>
    <CodeBlock
      lang="text"
      code="a = A.length()
b = B.length()
Time: O(ab)
Space: O(ab)"
    />
    <h3>Sequence Alignment</h3>
    <p>
      Sequence alignment is a fundamental procedure (implicitly or explicitly)
      conducted in any biological study that compares two or more biological
      sequences (whether DNA, RNA, or protein). It is the procedure by which one
      attempts to infer which positions (sites) within sequences are
      **homologous**, that is, which sites share a common evolutionary history.
      To be able to compare potential sequence alignments, one needs to be able
      to determine a value (or score) that estimates the quality of each
      alignment. In the simplest case, three scores are specified: 1. The
      benefit of aligning a pair of sites that contain the same character
      (state) in both sequences. 2. The cost of aligning a pair of sites that
      contain different characters in the sequences. 3. The cost of aligning a
      character in one sequence with a gap in the other sequence. Depending on
      how one defines the scores, the eventual goal could be to find the
      alignment that maximizes the benefit or to find the alignment that
      minimizes the cost. In computer science, one simple, cost-based scoring
      function is the **edit distance**, that is, the minimum number of changes
      necessary to convert one sequence into another. In this case, the goal of
      alignment is to minimize the edit distance. It is impossible to evaluate
      all possible alignments. First elegant solution to the alignment problem:
      Needleman-Wunsch algorithm. Pairwise sequence alignment is more
      complicated than calculating the Fibonacci sequence, but the same
      principle is involved. The dynamic programming solution works by starting
      with the optimal alignment of the smallest possible subsequences (nothing
      in sequence x aligned to nothing in sequence y) and progressively
      determining the optimal score for longer and longer sequences by adding
      sites one at a time. <ResourceIndicator number="12" />
      <ResourceIndicator number="13" /><ResourceIndicator number="14" />
    </p>
    <h3>Global vs. Local Alignment</h3>
    <p>
      Global Alignment Algorithm assumes that the entirety of the sequences are
      sequentially homologous and tries to align all of the sites optimally
      withing the sequences. This assumption may be incorrect as a result of
      large-scale sequence rearrangement and genome shuffling For example,
      Sequences ABCDEF and ABEDCF cannot be properly aligned because the
      homologous sections of the sequences are not in the same order. Although
      each section of the first sequence is homologous with a section of the
      second sequence, they cannot be globally aligned, because of the
      rearrangement. An alternative approach to global alignment is **local
      alignment**. In a local alignment, subsections of the sequences are
      aligned without reference to global patterns. This allows the algorithm to
      align regions separately regardless of overall order within the sequence
      and to align similar regions while allowing highly divergent regions to
      remain unaligned. Early approaches for local alignment were developed by
      Sankoff (1972) and Sellers (1979, 1980), but the basic local alignment
      procedure most widely used was proposed by **Smith and Waterman** (1981b).
      It is a simple adaptation to the standard Needleman–Wunsch algorithm.
      <ResourceIndicator number="10" />
    </p>
    <h3>Scoring Systems</h3>
    <p>
      In previous sections, we have discussed the concept of levenstein
      distance. While calculating distance, every change is treated as the same.
      Changing an "A" to "B" or changing "C" to "Z" have the same cost. This may
      work mathematically, but it is not biologically correct. Because not all
      substitutions are equally likely in evolution. In real biology, replacing
      Leucine wih Isoleusine is common but replacing Tryptophan with Glycine is
      rare. Some mutations are tolerated, others are destructive.
    </p>
    <p>
      In order to implement a more biologically realistic scoring system, we can
      use a substitution matrix. A substitution matrix is a statistical
      calculation of how likely a mutation is to occur by evolutionary design
      versus random chance. For example, the PAM (Point Accepted Mutation)
      matrix is based on the observed frequencies of amino acid substitutions in
      closely related proteins. The BLOSUM (BLOcks SUbstitution Matrix) matrix
      is based on the observed frequencies of amino acid substitutions in
      conserved regions of proteins. These matrices provide a more accurate
      representation of the evolutionary relationships between sequences and can
      be used to improve the accuracy of sequence alignments.
    </p>
    <h3>Affine Gap Penalties</h3>
    <p>
      In the alignment, another problem is Swiss Cheese problem which refers to
      the scattered and non-continuous gaps like C-V--L In nature, it is
      expensive to cut the protein to have a gap (-) in alignment. However, when
      a gap is necessary and initialized, it is not that expensive to continue
      it. So, we have to implement Affine Gap Penalty such as -11. This means
      the implementation of Gotoh's Alignment Algorithm instead of
      Smith-Waterman algorithm.
    </p>
    <NextChapterBlock
      url="/sequence-alignment-implementation"
      title="Implementation of Sequence Alignment"
    />
  </div>
</template>
