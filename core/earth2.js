import {
  Game,
  TurnOrder
} from 'boardgame.io/core'

const Rules = (function(){
  let rules = {}

  rules.max = (cards)=>{
    let plays = cards.sort((a, b) => {
      if (a.number != b.number) {
        //2最大
        if(a.number==2){
          return 1;
        }
        if(b.number ==2){
          return-1;
        }
        //A第二
        if(a.number==1){
          return 1;
        }
        if(b.number ==1){
          return-1;
        }
        return Number(a.number) - Number(b.number);
      } else {
        return b.type.localeCompare(a.type);
      }
    });
    return plays.slice(-1);
  }

  rules.type=(cards)=>{
    let plays = cards.sort((a, b) => {
      if (a.number != b.number) {
        return Number(a.number) - Number(b.number);
      } else {
        return b.type.localeCompare(a.type);
      }
    });
    if(cards.length==1){
      return {type:'1',card:plays[0]};
    }else if(cards.length==2){
      if(cards[0].number==cards[1].number){
        return {type:'2',card:plays[1]};
      }else{
        return false;
      }
    }else if(cards.length==3){
      if(cards[0].number==cards[1].number&&cards[0].number==cards[2].number){
        return {type:'3',card:plays[2]};
      }else{
        return false;
      }
    }else if(cards.length==4){
      if(cards[0].number==cards[1].number&&cards[0].number==cards[2].number&&cards[0].number==cards[3].number){
        return {type:'4',card:plays[3]};
      }else{
        return false;
      }
    }else if(cards.length==5){
      let flush = true;
      let straight = true;
      let suit = plays[0].type;
      let min = plays[0].number;
      for (let i = 0; i < plays.length; i++) {
        const c = plays[i];
        if(c.type!=suit){
          flush = false;
        }
        if(c.number-min!=i){
          straight = false;
        }
      }
      // 10,J,Q,K,A
      if(plays[0].number==1&&plays[1].number==10&&plays[2].number==11&&plays[3].number==12&&plays[4].number==13){
        straight = true;
      }
      // 3+2
      if(plays[0].number==plays[1].number&&plays[1].number==plays[2].number&&plays[3].number==plays[4].number){
        return {type:'3+2',card:plays[2]};
      }
      // 2+3
      if(plays[0].number==plays[1].number&&plays[2].number==plays[3].number&&plays[3].number==plays[4].number){
        return {type:'3+2',card:plays[4]};
      }
      // 4+1
      if(plays[0].number==plays[1].number&&plays[1].number==plays[2].number&&plays[2].number==plays[3].number){
        return {type:'4+1',card:plays[3]};
      }
      //1+4
      if(plays[1].number==plays[2].number&&plays[2].number==plays[3].number&&plays[3].number==plays[4].number){
        return {type:'4+1',card:plays[4]};
      }
      if(flush&&straight){
        return {type:'fs',card:rules.max(cards)};
      }else if(flush){
        return {type:'f',card:rules.max(cards)};
      }else if(straight){
        return {type:'s',card:rules.max(cards)};
      }
      return false;
    }
    return false;
  }
  rules.compare=(a,b)=>{
    let type_a = rules.type(a);
    let type_b = rules.type(b);
    if(!type_a){
      return false;
    }
    if(!type_b){
      return true;
    }
    if(type_a.type==type_b.type){
      let num_a = type_a.card.number;
      let num_b = type_b.card.number;
      if(num_a!=num_b){
        // 2最大
        if(num_a==2){
          return true;
        }
        if(num_b==2){
          return false;
        }
        // A第二
        if(num_a==1){
          return true;
        }
        if(num_b==1){
          return false;
        }
        return num_a-num_b>0;
      }else{
        return type_b.card.type.localeCompare(type_a.card.type)>0;
      }
    }
  }

  return rules;
})()

function createCard() {
  let cards = [];
  for (let i = 0; i < 13; i++) {
    cards.push({
      id: i * 4 + 0,
      type: 'A',
      number: i + 1,
      owner: null,
      play: false
    })
    cards.push({
      id: i * 4 + 1,
      type: 'B',
      number: i + 1,
      owner: null,
      play: false
    })
    cards.push({
      id: i * 4 + 2,
      type: 'C',
      number: i + 1,
      owner: null,
      play: false
    })
    cards.push({
      id: i * 4 + 3,
      type: 'D',
      number: i + 1,
      owner: null,
      play: false
    })
  }
  return cards;
}
const state = {
  cards: createCard(),
  lastPlayer: null,
  desk: []
};
state.cards = state.cards.sort((a, b) => {
  return 0.5-Math.random();
});

export const Earth2 = Game({
  name: "earth2",
  setup: (ctx) => {
    return state;
  },
  playerView: (G, ctx, playerID) => {
    let cards = [...G.cards];
    let desk = [...G.desk];
    let myCard = cards.filter(c => c.owner == playerID);
    let showCard = cards.filter(c => c.play == true);
    let show = {
      cards: myCard,
      desk
    };
    return show;
  },
  moves: {
    drewCard(G, ctx) {
      let player = ctx.playerID;
      let cards = [...G.cards];
      let myCards = cards.filter(c => c.owner == player);
      if (myCards.length >= 13) {
        return;
      }
      for (let num = myCards.length; num < 13; num++) {
        for (var i = 0; i < cards.length; i++) {
          if (cards[i].owner == null) {
            cards[i].owner = player;
            break;
          }
        }
      }
      return { ...G,
        cards
      };
    },
    playCard(G, ctx, cardIds) {
      let ids = [...cardIds];
      if(ids.length==0){
        return;
      }
      
      let player = ctx.playerID;
      let cards = [...G.cards];
      let desk = [...G.desk];

      if(desk.length==0){
        //第一次出牌不包含D3,非法
        if(ids.indexOf(8)==-1){
          return;
        }
      }
      
      let plays = cards.filter(c => ids.indexOf(c.id) != -1);
      for (let i = 0; i < plays.length; i++) {
        let card = plays[i];
        if (card.owner == player && card.play == false) {
          card.play = true;
        } else {
          return;
        }
      }
      if(desk.length>0){
        if(!Rules.compare(plays,desk.slice(-1))){
          return;
        }
      }
      desk.push(plays);
      return { ...G,
        cards,
        lastPlayer: player,
        desk
      };
    },
    pass(G,ctx){
      return {...G};
    }

  },
  flow: {
    phases: [{
        name: 'drew phase',
        endPhaseIf: G => G.cards.filter(c => c.owner == null).length <= 0,
        allowedMoves: ['drewCard'],
        turnOrder: TurnOrder.ANY
      },
      {
        name: 'play phase',
        allowedMoves: ['playCard'],
        movesPerTurn: 1,
        endGameIf:(G, ctx)=>{
          let player = ctx.currentPlayer;
          let playedCard = G.cards.filter(c=>c.owner==player&&c.play==true);
          if(playedCard.length==13){
            return player;
          }
        },
        turnOrder: {
          first: (G, ctx) => {
            let D3 = G.cards.find(c => c.number == 3 && c.type == 'D');
            if (D3) {
              return {playOrderPos:parseInt(D3.owner)};
            }
            return 0;
          },
          next(G, ctx) {
            return (ctx.playOrderPos + 1) % ctx.numPlayers;
          }
        }
      },
    ],
  }
})