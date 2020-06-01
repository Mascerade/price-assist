<template>
  <div id="container">
    <p id="sign-in">Sign In with Google</p>
    <button @click="authenticate" class="btn btn-outline-dark" id="sign-in-button">Sign In!</button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    authenticate() {
      chrome.runtime.sendMessage({ message: 'authenticate' }, function(response) {});
    },
  },
};
</script>

<style lang="scss" scoped>
#container {
  display: flex;
  flex-flow: column;
  align-items: center;
  height: 250px;
  width: 250px;
}

p {
  font-size: 20px;
  text-align: center;
}
</style>
