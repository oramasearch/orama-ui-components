<script setup>
import { CollectionManager } from '@orama/core'

const clientInstance = new CollectionManager({
  url:'https://oramacore.orama.foo',
  collectionID: 'cxlenmho72jp3qpbdphbmfdn',
  readAPIKey: 'caTS1G81uC8uBoWICSQYzmGjGVBCqxrf',
})
</script>
<template>
  <main>
    <section>
      <h1>App Vue</h1>
    </section>

    <section>
      <h2>Stencil Components</h2>
      <div class="component-row">
        <orama-chat-box .clientInstance="clientInstance" />
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
