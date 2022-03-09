<template>
  <div class="">
    <div
      class="
        flex flex-col
        lg:flex-row-reverse
        gap-10
        justify-center
        items-center
      "
    >
      <p class="text-xxs lg:text-sm">
        {{ $t("footer.copyright") }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    navigateTop() {
      this.$router.push("/");
    },
  },
};
</script>

<style>
</style>