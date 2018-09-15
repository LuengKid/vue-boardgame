# vue-boardgame

利用vue.js + boardgame.js 搭建扑克游戏 锄大地(大老二) 

## 启动程序

### 安装配置
```
npm install
```

### 开启服务端 http://localhost:8000
```
npm run server
```

### 开启客户端 http://localhost:8080
```
npm run dev
```

## 基本实现功能

### 基本流程

#### 加入游戏
1. 玩家0:创建游戏 -> 选择玩家 -> 连接服务器
2. 其他玩家:输入gameId -> 加入游戏 -> 选择玩家 -> 连接服务器

#### 抽牌阶段 drew phase
1. 全部玩家:点击抽牌按钮 -> 抽取13张牌

![image](https://github.com/LuengKid/vue-boardgame/raw/master/demo1.gif)

#### 出牌阶段 play phase
1. 方块三玩家:首先出牌
2. 全部玩家:按照规则轮流出牌或pass -> 首先将13张牌出完为胜利者

![image](https://github.com/LuengKid/vue-boardgame/raw/master/demo2.gif)

## 开发计划

1. 引入AI
2. 添加斗地主等扑克游戏
3. 完善游戏大厅

## 联系作者

email : 100520140@qq.com

qq交流群: 879259736 (验证信息:boardgame)
