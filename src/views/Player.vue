<template>
  <div>
    <h1>玩家{{playerId}}</h1>
    <h2>当前阶段:{{phase}}</h2>
    <h2>玩家{{currentPlayer}}的回合</h2>
    <div>游戏id<p>{{gameId}}</p>
    </div>
    <div><button v-if="!connected" @click="join">连接服务器</button>
    </div>
    <div class="desk">
      <h3>桌面</h3>
      <div v-if="!gameover">
        <div> 玩家{{desk[0]&&desk[0][0]?desk[0][0].owner:''}}</div>
        <div class="card" v-for="card in (desk[0]||[])" :key="card.id" :style="cardStyle(card)" @click="playCard(card)">
          <span>{{cardType(card.type)}}</span>
          <h1>{{cardNumber(card.number)}}
          </h1>
          <span class="bottom">
            {{cardType(card.type)}}
          </span>
        </div>
      </div>
      <div v-if="gameover">
          <h1>游戏结束,玩家{{gameover}}胜利!</h1>
      </div>
    </div>
    <div class="my">
      <div class="function">
        <button v-if="phase=='drew phase'&&myCards.length!=13" @click="drewCard">抽牌</button>
        <button v-if="phase=='play phase'" @click="playCard">出牌</button>
        <button v-if="phase=='play phase'" >提示</button>
        <button v-if="phase=='play phase'" @click="pass" >pass</button>

      </div>
      <h3>我的牌</h3>
      <div class="cards">
        <div class="card" v-for="(card,index) in myCards" :key="card.id" :style="cardStyle(card)" v-if="!card.play" :class="card.klass" @click="selectCard(index)">
          <span>{{cardType(card.type)}}</span>
          <h1>{{cardNumber(card.number)}}
          </h1>
          <span class="bottom">
            {{cardType(card.type)}}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from "vue";
  import {
    Client
  } from "boardgame.io/client";
  import {
    Earth2
  } from "../../core/earth2";
  export default {
    metaInfo() {
      return {
        title: '玩家' + this.playerId
      }
    },
    data() {
      return {
        credentials: "",
        myCards:[]
      };
    },
    computed: {
      gameover(){
         return this.$store.state.boardgame.client ?this.$store.state.boardgame.client.getState().ctx.gameover:'';
      },
      gameId(){
        return this.$store.state.boardgame.client ?
          this.$store.state.boardgame.client.gameID:''
      },
      table() {
        return this.$store.state.boardgame.table;
      },
      playerId() {
        return this.$route.params.id;
      },
      currentPlayer() {
        return this.$store.state.boardgame.client ?
          this.$store.state.boardgame.client.getState().ctx.currentPlayer :
          "";
      },
      phase() {
        return this.$store.state.boardgame.client ?
          this.$store.state.boardgame.client.getState().ctx.phase :
          "";
      },
      connected() {
        return this.$store.state.boardgame.client ?
          this.$store.state.boardgame.client.getState().isConnected :
          false;
      },
      cards() {
        if (!this.game.cards) {
          return [];
        }
        let cards = this.game.cards.sort((a, b) => {
          if (a.number != b.number) {
            return Number(a.number) - Number(b.number);
          } else {
            return b.type.localeCompare(a.type);
          }
        });
        cards.forEach(card => {
          card.select=false;
        });
        return cards;
      },
      game() {
        return this.$store.state.boardgame.client ?
          this.$store.state.boardgame.client.getState().G :
          {};
      },
      desk() {
        return (this.game.desk || [
          []
        ]).slice(-1);
      }
    },
    methods: {
      drewCard() {
        this.$store.state.boardgame.client.moves.drewCard();
      },
      playCard() {
        let ids = this.myCards.filter(c=>c.select ==true).map(c=>c.id);
        this.$store.state.boardgame.client.moves.playCard(ids);
      },
      pass(){
        this.$store.state.boardgame.client.moves.pass();
      },
      selectCard(index){
        let card = this.myCards[index];
        this.$set(card,'select',!card.select);
        let cardStyle = this.cardStyle(card);
        this.$set(this.myCards[index],`klass`,{selected:card.select});
      },
      join() {
        let table = this.table;
        this.$axios
          .post(`/games/${table.type}/${table.id}/join`, {
            playerID: this.playerId,
            playerName: "玩家" + this.playerId
          })
          .then(result => {
            this.credentials = result.data.playerCredentials;
            this.connect();
          });
      },
      connect() {
        const client = Client({
          game: Earth2,
          playerID: this.playerId,
          gameID: this.table.id,
          numPlayers: 4,
          credentials: this.credentials,
          multiplayer: {
            server: "localhost:8000",
            numPlayers: 4
          }
        });

        Vue.prototype.$client = client;
        Vue.prototype.$G = client.getState().G;

        client.subscribe(function () {
          vue.$store.commit("change");
        });
        client.connect();
        vue.$store.commit("init", client);
      },
      cardType(type) {
        switch (type) {
          case "A":
            return "♠";
          case "B":
            return "♥";
          case "C":
            return "♣";
          case "D":
            return "♦";
        }
        return type;
      },
      cardStyle(card) {
        let type = card.type;
        let color = "#2c3e50";
        if (type == "B" || type == "D") {
          color = "#ff0000";
        }
        return {
          color: color
        };
      },
      cardNumber(number) {
        switch (number) {
          case 1:
            return "A";
          case 11:
            return "J";
          case 12:
            return "Q";
          case 13:
            return "K";
        }
        return number;
      }
    },
    created() {},
    watch:{
      'game.cards':function(value){
         let cards = [...value].sort((a, b) => {
          if (a.number != b.number) {
            if (a.number == 1) {
              return 1;
            } else if (b.number == 1) {
              return -1;
            }
            return Number(a.number) - Number(b.number);
          } else {
            return b.type.localeCompare(a.type);
          }
        });
        cards.forEach(card => {
          card.select=false;
        });
        this.$set(this,'myCards',cards);
      }
    }
  };
</script>
<style lang="less">
  .cards,
  .desk {
    .card {
      display: inline-block;
      width: 80px;
      height: 110px;
      border: solid 1px #999;
      position: relative;
      transition: transform 0.3s;

      &.selected{
        transform: translateY(-20px);
      }

      h1 {
        text-align: center;
        font-size: 50px;
        line-height: 120px;
        margin: 0;
      }

      span {
        position: absolute;
        left: 5px;
        top: -5px;
        font-size: 30px;

        &.bottom {
          left: auto;
          right: 5px;
          bottom: -5px;
          top: auto;
        }
      }
    }
  }
</style>