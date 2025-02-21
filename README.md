## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev


wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

source ~/.bashrc

nvm install 20.9.0

npm install pnpm -g

export PATH=$PATH:/www/server/nodejs/v20.9.0/bin

pnpm install
```

## Svgator 属性

| 属性名               | 类型          | 描述                                                                               |
| -------------------- | ------------- | ---------------------------------------------------------------------------------- |
| player.currentTime   | Integer       | 当前动画时间（毫秒）                                                               |
| player.direction     | Integer       | 新增：动画方向（1 表示正向，-1 表示反向）                                          |
| player.duration      | Integer       | 循环的持续时间（毫秒）                                                             |
| player.fill          | Integer       | 新增：动画填充模式（1 表示向前，-1 表示向后）；设置为-1 时，动画结束后跳回起始位置 |
| player.fps           | Integer       | 新增：每秒帧数（默认值：100）                                                      |
| player.hasEnded      | Boolean       | 动画是否已结束                                                                     |
| player.isAlternate   | Boolean       | 动画是否为交替模式                                                                 |
| player.isBackwards   | Boolean       | 新增：填充模式是否为向后（-1）                                                     |
| player.isInfinite    | Boolean       | 新增：动画是否为无限循环                                                           |
| player.isPlaying     | Boolean       | 动画是否正在播放                                                                   |
| player.isReversed    | Boolean       | 新增：动画方向是否为反向                                                           |
| player.isRollingBack | Boolean       | 动画是否正在回滚                                                                   |
| player.iterations    | Integer       | 迭代次数，0 表示无限播放                                                           |
| player.speed         | Float         | 新增：动画速度，1 表示 100%正常速度                                                |
| player.state         | String / Enum | 动画状态；可选值：["playing", "paused", "ended", "rollback"]                       |
| player.totalTime     | Integer       | 有限动画的总时间（迭代次数乘以持续时间）；无限动画的持续时间                       |

## 方法

每个 `player.method()` 调用都返回 player API 对象本身。

| 方法名               | 参数     | 触发事件      | 描述                                                         |
| -------------------- | -------- | ------------- | ------------------------------------------------------------ |
| .play()              | n/a      | play          | 播放当前动画，如果已结束则重新开始                           |
| .pause()             | n/a      | pause         | 暂停当前动画                                                 |
| .restart()           | n/a      | restart       | 从动画的起始位置重新开始                                     |
| .reverse()           | n/a      | reverse       | 反转播放方向并播放动画                                       |
| .toggle()            | n/a      | play 或 pause | 切换播放和暂停状态                                           |
| .togglePlay()        | n/a      | play 或 pause | 新增：切换播放和暂停的别名                                   |
| .stop()              | n/a      | stop          | 停止当前动画并重置为第一个关键帧                             |
| .ready(callback)     | Function | n/a           | 当播放器准备就绪时调用回调函数，并将播放器作为第一个参数传递 |
| .seek(offsetPercent) | Float    | n/a           | 将动画前进到指定百分比的偏移位置（0 到 100 之间的浮点数）    |
| .seekBy(offsetMs)    | Integer  | n/a           | 将动画前进指定的毫秒数偏移量，允许                           |
