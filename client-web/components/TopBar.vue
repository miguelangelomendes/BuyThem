<template>
  <div>
    <div class="flex justify-between items-center px-4 xl:px-0 z-[40]">
      <Logo class="w-20 lg:w-28 clickable text-primary" @click="navigateHome" />
      <div class="lg:hidden">
        <!-- <IconHamburgerMenu
          v-if="$store.state.navigation.top.length > 0"
          :isOpen="isMenuOpen"
          class="w-8 h-8 flex justify-center items-center"
          iconClass="w-full cursor-clickable"
          @click="toggleMenu"
        /> -->
      </div>

      <NavMenu
        v-if="$store.state.navigation.top.length > 0"
        :menu="$store.state.navigation.top"
        class="flex space-x-6 items-center"
      />
      <NearSessionButton />
    </div>
    <transition
      enter-active-class="transition origin-top ease-linear duration-300"
      leave-active-class="transition origin-top ease-linear duration-300"
      enter-class="transform -translate-y-full opacity-0 "
      enter-to-class="transform translate-y-0 opacity-100"
      leave-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-full opacity-0"
    >
      <div
        v-if="isMenuOpen && $store.state.navigation.top.length > 0"
        @click="toggleMenu"
        class="-z-[1] absolute top-20 left-0 w-full h-screen clickable"
      >
        <div class="bg-surface p-4 shadow-md space-y-4">
          <NavMenu
            :menu="$store.state.navigation.top"
            class="flex flex-col space-y-4"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  async fetch() {
    await this.$store.dispatch("navigation/getTop");
  },
  data() {
    return {
      isMenuOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    navigateHome() {
      this.$router.push("/");
    },
  },
};
</script>

<style>
</style>