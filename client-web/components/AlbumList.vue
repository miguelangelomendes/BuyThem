<template>
  <div
    class="
      grid grid-cols-2
gap-y-10
      lg:grid-cols-4
      xl:grid-cols-5
      3xl:grid-cols-5
    "
  >
    <div
      v-for="item in list"
      :key="item.id"
      class="flex justify-center items-center"
    >
      <AlbumItem
        :item="item"
        class="bg-surface text-on-surface p-3 rounded space-y-2 max-w-max"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style>
</style>