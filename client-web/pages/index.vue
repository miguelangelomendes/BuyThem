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
  mounted() {
    console.log("mounted is_loading", this.$store.state.near.is_loading);
    console.log("mounted", this.$store.state.near.is_logged_in);
  },
  async fetch() {
    await this.$store.dispatch("items/list");
  },
};
</script>

<style>
</style>
