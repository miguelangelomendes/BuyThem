<template>
  <div class="space-y-4">
    <h2 class="text-xl font-bold tracking-wider text-primary">Latests</h2>
    <AlbumList :list="$store.state.items.list" />
  </div>
</template>

<script>
export default {
  auth: false,
  fetchOnServer: false,
  async fetch() {
    await this.$store.dispatch("items/list");
  },
};
</script>

<style>
</style>
