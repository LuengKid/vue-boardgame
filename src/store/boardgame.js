export default{
    state: {
      game: {},
      client: null,
      table:{}
    },
    mutations: {
      change (state, game) {
        console.log('change', state.client.getState().G)
        state.game = state.client.getState().G
      },
      init (state, client) {
        state.client = client
      },
      select(state,type){
        state.table.type = type;
      },
      create(state,id){
        state.table.id = id;
      }
    }
  }
  