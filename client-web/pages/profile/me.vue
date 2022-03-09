<template>
  <div class="space-y-10">
    <h2 class="text-xl font-bold tracking-wider text-primary">
      {{
        $store.state.near.user ? $store.state.near.user.accountId : "My Profile"
      }}
    </h2>

    <div class="space-y-5">
      <h2 class="text-xl font-bold tracking-wider text-primary">Create Item</h2>
      <CreateItem class="h-80" />
    </div>

    <div class="space-y-5">
      <h2 class="text-xl font-bold tracking-wider text-primary">My Album</h2>
      <AlbumList
        :list="$store.state.items.owned"
        v-if="$store.state.items.owned.length > 0"
      />
      <p v-else>You haven't created any album yet.</p>
    </div>
  </div>
</template>

<script>
export default {
  async beforeCreate() {
    await this.$store.dispatch("items/owned");
  },
};
</script>

<style>
</style>