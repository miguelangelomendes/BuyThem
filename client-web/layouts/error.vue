<template>
  <div
    @click.right.stop.prevent="onRightClick"
    class="flex justify-center items-center max-w-screen-2xl mx-auto"
  >
    <div class="flex flex-col space-y-6 lg:space-y-12 w-full lg:w-auto">
      <div>
        <p class="text-3xl">Ooops...</p>
        <p
          class="text-3xl lg:text-5xl font-roboto-medium capitalize leading-15"
        >
          {{ `${$t("error")} ${error.statusCode}` }}
        </p>
        <p class="text-xl lg:text-xl leading-none">
          <span v-if="$t(`errors.${error.statusCode}`)">
            {{ $t(`errors.${error.statusCode}`) }}
          </span>
        </p>
      </div>
      <div class="space-y-2">
        <p class="text-xl leading-9">{{ $t("errors.geral") }}</p>
        <div
          class="flex space-x-2 clickable text-sm leading-5"
          @click="navigateHome"
        >
          <IconArrowHorizontal class="w-5" />
          <div v-html="$t('errors.return_home')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["error"],
  methods: {
    onRightClick() {
      /* Don't allow users to use right click */
    },
    navigateHome() {
      this.$router.push("/");
    },
  },
};
</script>

<style>
</style>
