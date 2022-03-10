<template>
  <div class="">
    <div class="relative">
      <img
        @click="openMedia"
        v-if="item.media"
        class="h-[30rem] lg:h-64 rounded aspect-[9/10] object-cover clickable"
        :src="item.media"
      />
      <ImgFromIPFS
        @click="openMedia"
        v-else-if="item.uri"
        :uri="item.uri"
        :id="item.id"
        class="h-[30rem] lg:h-64 rounded aspect-[9/10] object-cover clickable"
      />
      <div
        class="
          h-[30rem]
          lg:h-64
          rounded
          aspect-[9/10]
          flex flex-col
          justify-center
          space-y-4
          items-center
        "
        v-else
      >
        <IconLocked class="w-8 text-on-surface" />
        <div
          @click="buyItem"
          class="
            p-0.5
            bg-gradient-to-tr
            from-fuchsia-300
            via-blue-500
            to-fuchsia-700
            rounded
            shadow-md
            hover:shadow-fuchsia-500
            flex
            justify-center
            items-center
            clickable
          "
        >
          <button
            class="
              bg-primary
              text-on-primary
              uppercase
              text-xs
              py-0.5
              px-2
              rounded
              font-semibold
              tracking-wider
              clickable
            "
            :disabled="isPurchasing"
            :class="isPurchasing ? 'animate-bounce cursor-not-allowed' : ''"
          >
            Unlock for ({{ item.price }}Ⓝ)
          </button>
        </div>
      </div>
    </div>
    <p class="text-sm tracking-wide" v-if="item.description">
      {{ item.description }}
    </p>
    <a
      class="
        text-xs
        font-semibold
        tracking-wider
        hover:text-on-primary-hover
        clickable
      "
      target="_blank"
      :href="`https://explorer.testnet.near.org/accounts/${item.owner_account_id}`"
    >
      {{ item.owner_account_id }}
    </a>
    <ModalViewMedia
      v-if="isModalOpen"
      :isOpen="isModalOpen"
      :url="item.media"
      @close="closeModal"
    />
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isModalOpen: false,
      isPurchasing: false,
    };
  },
  methods: {
    async buyItem() {
      try {
        this.isPurchasing = true;
        const restult = await this.$store.dispatch(
          "purchases/buyItem",
          this.item
        );
        if (restult) {
          this.openMedia();
        }
        this.isPurchasing = false;
      } catch (error) {
        this.isPurchasing = false;
        console.error(error);
      }
    },
    openMedia() {
      if (this.item.media) {
        this.isModalOpen = true;
      } else {
        console.log("no media");
      }
    },
    closeModal() {
      this.isModalOpen = false;
    },
  },
};
</script>

<style>
</style>