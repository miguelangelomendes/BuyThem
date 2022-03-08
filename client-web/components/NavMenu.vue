<template>
  <div>
    <div v-for="link in menu" :key="link.title">
      <nuxt-link
        :to="link.to"
        class="
          clickable
          capitalize
        "
        :class="
          $route.path.startsWith(link.to)
            ? 'text-primary underline'
            : 'text-on-surface hover:text-primary-hover'
        "
      >
        {{ $t(`menu.${link.title}`) }}
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    menu: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style>
</style>