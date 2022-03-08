<template>
  <div class="">
    <Logo class="w-20 lg:w-28 clickable text-primary" @click="navigateTop" />
    <div
      class="
        flex flex-col
        lg:flex-row-reverse
        gap-10
        justify-center
        items-center
      "
    >
      <a class="text-xxs lg:text-sm" href="https://ley.pt" target="_blank">
        {{ $t("footer.copyright") }}
      </a>
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