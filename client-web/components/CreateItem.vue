<template>
  <div class="flex space-x-10">
    <form @submit.prevent.stop="onSubmit" class="space-y-5 w-4/12">
      <div class="flex flex-col">
        <label class="label" for="description"> description </label>
        <input
          id="description"
          type="text"
          v-model="description"
          class="input"
        />
      </div>
      <div class="flex flex-col">
        <label class="label" for="price"> price (in Near )</label>
        <input id="price" type="text" v-model="price" class="input" />
      </div>
      <div class="flex flex-col">
        <label class="label" for="image"> image </label>
        <div
          id="drop_zone"
          @drop="dropHandler($event)"
          @dragover="dragOverHandler($event)"
          @click="pickImage"
          class="
            flex
            justify-center
            items-center
            clickable
            w-full
            h-20
            bg-surface
            text-on-surface
            rounded
          "
        >
          {{
            (this.file && this.file.name) || "Click to pick or drop an image"
          }}
        </div>
        <input v-show="false" ref="inputImage" type="file" @change="addFile" />
      </div>
      <div
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
          max-w-max
        "
      >
        <button
          :disabled="!isFormValid || isPending"
          :class="isPending ? 'animate-bounce cursor-not-allowed' : ''"
          class="
            w-40
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
        >
          create
        </button>
      </div>
    </form>
    <div class="bg-surface">
      <img v-if="img" :src="img" class="h-full" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      file: null,
      img: null,
      isPending: false,
      description: null,
      price: null,
    };
  },
  methods: {
    pickImage() {
      if (this.$refs.inputImage) {
        this.$refs.inputImage.click();
      }
    },
    dropHandler($event) {
      const tempFile = $event.dataTransfer.items[0].getAsFile();
      $event.preventDefault();
      this.file = tempFile;
      this.img = URL.createObjectURL(this.file);
    },
    dragOverHandler($event) {
      // Prevent default behavior (Prevent file from being opened)
      $event.preventDefault();
    },
    addFile($event) {
      if ($event.target.files && $event.target.files.length > 0) {
        this.file = $event.target.files[0];
        this.img = URL.createObjectURL(this.file);
      } else {
        console.error("no file selected");
      }
    },
    async uploadFile(file) {
      const uri = await this.$store.dispatch("storage/upload", file);
      return uri;
    },
    async onSubmit() {
      try {
        this.isPending = true;
        // Upload to IPFS
        const uri = await this.uploadFile(this.file);
        console.log("uri", uri);
        //"QmXBpKGAZQKhoT9m95dBygGgCHqTJt196vr5KS6e4KqsmE"
        if (uri) {
          await this.$store.dispatch("items/create", {
            uri,
            price: this.price,
            description: this.description,
          });
        }
        this.resetForm();
        this.isPending = false;
      } catch (error) {
        this.isPending = false;
        console.log("error", error);
      }
    },
    resetForm() {
      this.file = null;
      this.img = null;
      this.description = null;
      this.price = null;
    },
  },
  computed: {
    isFormValid() {
      return this.price && this.file;
    },
  },
};
</script>

<style>
</style>