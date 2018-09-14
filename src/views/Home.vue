<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="锄大地" />

    <div class="games">
      <h2> 游戏列表</h2>
      <ul>
        <li v-for="game in games" :key="game">{{game}} 
          <div>
          <a href="#" @click="createGames(game,4)">创建</a>
          </div>
          <div>
            <input type="text" v-model="gameId">
          <a href="#" @click="joinGames(game)">加入</a>
          </div>
          </li>
      </ul>
    </div>
    <div class="info">
      <h2 class="type">{{gameInfo.type}}</h2>
      <h3>{{gameInfo.id}}</h3>
    </div>
    <div v-if="gameInfo.id">
      <div>
        <router-link to="/player/0">玩家0</router-link> |
        <router-link to="/player/1">玩家1</router-link> |
        <router-link to="/player/2">玩家2</router-link> |
        <router-link to="/player/3">玩家3</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  // @ is an alias to /src
  import HelloWorld from '@/components/HelloWorld.vue'

  export default {
    name: 'home',
    data() {
      return {
        games: [],
        gameInfo: {},
        gameId:''
      }
    },
    components: {
      HelloWorld
    },
    computed: {
      table() {
        return this.$store.state.boardgame ? this.$store.state.boardgame.table : {};
      },
      type() {
        return this.$store.state.boardgame.table.type;
      }
    },
    created() {
      this.getGames();
    },
    methods: {
      getGames() {
        this.$axios.get('/games').then(result => {
          this.games = result.data;
        })
      },
      createGames(game, numPlayers) {
        let vue = this;
        this.gameInfo.type = game;
        this.$store.commit('select', game);
        this.$axios.post('/games/' + game + '/create', {
          numPlayers: 4
        }).then(result => {
          vue.$set(vue.gameInfo,"id",result.data.gameID);
          this.$store.commit('create', result.data.gameID);
        });
      },
      joinGames(game){
        this.$store.commit('select', game);
        this.$store.commit('create', this.gameId);
        this.$set(this.gameInfo,"id",this.gameId);
      }
    }
  }
</script>
<style lang="less">
  .games {
    text-align: center;
    ul {
      width: 300px;
      display: inline-block;
    }
  }
</style>