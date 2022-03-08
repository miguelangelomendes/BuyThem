<template>
  <div
    @click.right.stop.prevent="onRightClick"
    id="top"
    class="
      text-paragraph
      bg-background
      transition
      duration-300
      antialiased
      dark
    "
  >
    <div
      v-show="$store.state.near.is_logged_in"
      class="
        z-40
        py-1
        backdrop-blur
        bg-background/75
        fixed
        antialiased
        items-center
        w-full
        transition
        h-20
        lg:h-24
        duration-200
        ease-linear
      "
      :class="isNavBarElevated ? 'shadow' : 'shadow-none'"
    >
      <div class="relative flex items-center h-full">
        <TopBar id="topBar" class="w-full max-w-screen-2xl mx-auto" />
      </div>
    </div>
    <div>
      <TransitionOpacity>
        <div
          class="
            pt-24
            page-x-offset
            min-h-screen
            max-w-screen-2xl
            mx-auto
            z-auto
            antialiased
            flex
            justify-center
            items-center
          "
          v-if="$store.state.near.is_loading"
        >
          <IconSpinnerLoading class="w-32 h-32" />
        </div>
        <LoginPage
          class="
            pt-24
            page-x-offset
            min-h-screen
            max-w-screen-2xl
            mx-auto
            z-auto
            antialiased
          "
          v-else-if="!$store.state.near.is_logged_in"
        />
        <nuxt
          v-else
          class="
            pt-24
            page-x-offset
            min-h-screen
            max-w-screen-2xl
            mx-auto
            z-auto
            antialiased
          "
        />
      </TransitionOpacity>
    </div>
    <div class="bg-background py-1 transition duration-300 mt-10">
      <Footer
        class="space-y-10 pt-5 page-x-offset max-w-screen-2xl mx-auto pb-1"
      />
    </div>
  </div>
</template>

<script>
export default {
  scrollToTop: true,

  data() {
    return {
      scrollPosition: 0,
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    this.handleScroll();
  },
  methods: {
    onRightClick() {
      /* Don't allow users to use right click */
    },
    handleScroll() {
      this.scrollPosition = window.scrollY;
    },
  },
  computed: {
    isNavBarElevated() {
      return this.scrollPosition > 10;
    },
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style>
</style>
