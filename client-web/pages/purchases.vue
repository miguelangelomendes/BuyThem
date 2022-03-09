<template>
  <div class="space-y-5">
    <h2 class="text-xl font-bold tracking-wider text-primary">My purchases</h2>
    <AlbumList
      :list="$store.state.purchases.list"
      v-if="$store.state.purchases.list.length > 0"
    />
    <p v-else>You haven't purchased anything yet.</p>
  </div>
</template>

<script>
export default {
  async beforeCreate() {
    await this.$store.dispatch("purchases/list");
  },
};
</script>

<style>
</style>