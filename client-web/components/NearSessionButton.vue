<template>
  <div class="flex justify-end items-center">
    <div
      v-if="$store.state.near.is_loading"
      class="
        h-8
        flex
        items-center
        justify-center
        w-32
        lg:h-11
        rounded-lg
        bg-slate-400
      "
    >
      <IconNear class="w-6" />
    </div>

    <div v-else-if="$store.state.near.is_logged_in">
      <button
        @click="disconnect"
        class="
          px-2
          py-1
          lg:py-2 lg:px-4
          flex
          text-center
          space-x-1
          justify-center
          whitespace-no-wrap
          text-sm text-white
          rounded-lg
          clickable
          items-center
          border border-white
          focus:outline-none
          hover:bg-white hover:text-slate-700
        "
      >
        <IconNear class="w-6" />
        <p>Logout</p>
        <p class="hidden lg:block">{{ $store.state.near.user.accountId }}</p>
      </button>
    </div>

    <div v-else-if="!$store.state.near.is_logged_in">
      <button
        @click="connect"
        class="
          px-2
          py-1
          lg:py-2 lg:px-4
          flex
          w-32
          lg:h-11
          space-x-1
          justify-center
          whitespace-no-wrap
          text-sm text-white
          rounded-lg
          clickable
          items-center
          border border-white
          focus:outline-none
          hover:bg-white hover:text-slate-700
        "
      >
        <IconNear class="w-6" />
        <p>Connect</p>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    async connect() {
      try {
        await this.$store.dispatch("near/login");
      } catch (error) {
        console.log("Connect error: ", error);
      }
    },
    async disconnect() {
      try {
        await this.$store.dispatch("near/logout");
      } catch (error) {
        console.log("Disconnect error: ", error);
      }
    },
  },
};
</script>

<style>
</style>