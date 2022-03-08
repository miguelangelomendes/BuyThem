<template>
  <div>
    <TransitionOpacity mode="out-in">
      <div v-if="isPending" class="flex justify-center items-center h-full">
        <IconSpinnerLoading class="w-20 text-on-surface" />
      </div>
      <img
        v-else
        @click="onClick"
        :src="img"
        class="w-full h-full object-cover"
      />
    </TransitionOpacity>
  </div>
</template>

<script>
export default {
  props: {
    uri: {
      type: String,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
  },
  async mounted() {
    this.img = await this.getFromIPFS(this.uri);
  },
  data() {
    return {
      file: null,
      img: null,
      isPending: false,
    };
  },
  methods: {
    onClick() {
      this.$emit("click");
    },
    async getFromIPFS(uri) {
      this.isPending = true;
      const decrypted = await this.$store.dispatch("storage/get", uri);

      await this.$store.dispatch("items/updateMedia", {
        id: this.id,
        media: decrypted,
      });
      this.isPending = false;
      return decrypted;
    },
  },
};
</script>

<style>
</style>