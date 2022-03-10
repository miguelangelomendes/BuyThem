<template>
  <div class="flex flex-col justify-center items-center space-y-10">
    <div class="flex flex-col justify-center items-center space-y-4">
      <Logo class="w-96" />
      <h3 class="text-xl">
        A dApp built on the NEAR Protocol and IPFS with Nuxt.js
      </h3>
      <p>Where anyone can buy and sell their images (not NFTs).</p>
      <p>Please login and start sell and buy them.</p>
    </div>
    <NearSessionButton />
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>