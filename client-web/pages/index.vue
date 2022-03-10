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
  mounted() {
    if (this.$route.query.transactionHashes) {
      console.log(
        "transactionHashes",
        `https://explorer.testnet.near.org/transactions/${this.$route.query.transactionHashes}`
      );
      this.$router.replace("/")
    }
  },
};
</script>

<style>
</style>
