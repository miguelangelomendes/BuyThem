<template>
  <transition
    enter-active-class="transition ease-linear duration-300"
    leave-active-class="transition ease-linear duration-300"
    enter-class="transform opacity-0"
    enter-to-class="transform opacity-100"
    leave-class="transform opacity-100"
    leave-to-class="transform opacity-0"
    :mode="mode"
  >
    <slot></slot>
  </transition>
</template>

<script>
export default {
  props: ["mode"],
};
</script>

<style>
</style>