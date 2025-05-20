<script setup>
import { CollectionManager } from '@orama/core'

const clientInstance = new CollectionManager({
  url: 'https://oramacore.orama.foo',
  collectionID: 'ncd7zwmirytw1o47dogru4bz',
  readAPIKey: 'df00PbXP0dbRUcJgFeFZSNNb7AhsqCw8',
})

const sourcesMap = [
  {
    title: 'name',
    description: (item) => `${item.sex} - ${item.country}`,
    path: 'country',
    datasourceId: 'afvto8jyhbt1we54zait7nmo',
  },
  {
    title: 'Title',
    description: 'Genre',
    path: 'Poster',
    datasourceId: 'qn426ptegyc8owv9y0kd3imj',
  },
]
</script>
<template>
  <main>
    <section>
      <h1>App Vue</h1>
    </section>

    <section>
      <h2>Stencil Components</h2>
      <div class="component-row">
        <orama-chat-box .clientInstance="clientInstance" :sourcesMap="sourcesMap" />
      </div>
    </section>
  </main>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
