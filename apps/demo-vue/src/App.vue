<template>
  <main>
    <section>
      <h1>App Vue</h1>
    </section>

    <section>
      <h2>Stencil Components</h2>
      <div class="component-row">
        <orama-chat-box 
          :index="indexConfig"
          :placeholder="'Type your message here...'"
        />
      </div>
    </section>
  </main>
</template>

<script>

export default {
  data() {
    return {
      indexConfig: null
    }
  },
  async mounted() {
    await this.$nextTick()
    this.indexConfig = {
      api_key: 'yl2JSnjLNBV6FVfUWEyadpjFr6KzPiDR',
      endpoint: 'https://cloud.orama.run/v1/indexes/recipes-m7w9mm'
    }
  }
}
</script>

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