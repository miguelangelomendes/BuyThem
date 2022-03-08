<template>
  <Modal :open="isOpen" class="" @close="close">
    <img
      :src="url"
      class="min-h-[50vh] max-h-[80vh] my-auto bg-surface max-w-[90vw]"
    />
  </Modal>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style>
</style>