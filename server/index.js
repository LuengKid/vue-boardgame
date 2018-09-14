// require('@babel/register')

import {Server} from 'boardgame.io/server';
const Earth2 = require('../core/earth2').Earth2;

const server = Server({
    games: [Earth2]
});
server.run(8000,()=>{
});