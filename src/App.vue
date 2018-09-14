<template>
  <div id="app">
    <div id="nav">
      <div >
        <router-link to="/">Home</router-link>
        
      </div>
      <div >
        已登录,玩家{{player}}
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
  export default {
    computed: {
      connected() {
        return this.$store.state.boardgame.client ? this.$store.state.boardgame.client.getState().isConnected : false;
      },
      player(){
        return this.$store.state.boardgame.client ? this.$store.state.boardgame.client.playerID : false;
      }
    }
  }
</script>

<style lang="less">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
</style>