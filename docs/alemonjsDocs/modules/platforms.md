---
label: '自定义平台'
sidebar_position: 3
---

# 自定义平台

:::tip

对接任意开放平台和框架

:::

## 导出

```js title="src/index.ts"
import {
    definePlatform,
    createResult,
    ResultCode,
    getConfigValue,
    cbpPlatform,
    FormatEvent
} from 'alemonjs'

// 平台名称
export const platform = 'bot-name'

// 接口
export class API { }

// 配置参数
export type Options = {
    token: string
}

// 得到平台配置
const getBotConfig = (): Options => {
    const value = getConfigValue() || {}
    return value[platform] || {}
}

// 继承
class Client extends API {
    #token: string

    constructor(options: Options) {
        super()
        this.#token = options.token
    }

    onmessage = (data: any) => {
        //
    }
}

// 入口函数
const main = () => {
    // 平台配置
    const config = getBotConfig()

    // 连接 dbp 服务器。推送标准信息。
    const port = process.env?.port || 17117
    const url = `ws://127.0.0.1:${port}`
    const cbp = cbpPlatform(url)

    const client = new Client({
        token: config.token
    })

    client.onmessage = data => {

        // 使用 FormatEvent 链式构建标准事件
        const e = FormatEvent.create('message.create')
            .addPlatform({ Platform: platform, value: data, BotId: '' })
            .addGuild({ GuildId: '', SpaceId: '' })
            .addChannel({ ChannelId: '' })
            .addUser({ UserId: '', UserKey: '', IsMaster: false, IsBot: false })
            .addMessage({ MessageId: '' })
            .addText({ MessageText: '' })
            .addOpen({ OpenId: '' })
            .value

        // event
        cbp.send(e)
    }

    const sendMessage = async (event, param) => {
        // 处理  client.send
        return []
    }

    cbp.onactions(async (data, consume) => {
        if (data.action === 'message.send') {
            // 消息发送
            const event = data.payload.event
            const paramFormat = data.payload.params.format
            const res = await sendMessage(event, paramFormat)
            consume(res)

        } else {
           consume([createResult(ResultCode.Fail, '未知请求，请尝试升级版本', null)]);
        }
        // 主动发送消息 'message.send.channel'
        // 主动私聊消息 'message.send.user'
        // 获得 mention 'mention.get'
        // 获得机器人信息 'me.info'
    })

    // 处理 api 调用
    cbp.onapis(async (data, consume) => {
        const key = data.payload?.key
        if (client[key]) {
            // 如果 client 上有对应的 key，直接调用。
            const params = data.payload.params
            const res = await client[key](...params)
            consume([
                createResult(ResultCode.Ok, '请求完成', res)
            ])
        }
         else {
      consume([createResult(ResultCode.Fail, '未知请求，请尝试升级版本', null)]);
    }
    })
}


export default definePlatform({ main });
```

## 目标与统一动作

平台适配器除了推送标准事件，还应处理框架统一的目标对象和动作请求。目标范围使用 `ActionTarget` 表示：

```ts
type ActionTarget = {
  scope: 'group' | 'channel' | 'c2c' | 'direct'
  targetId: string
  BotId?: string
}
```

适配器可按平台能力处理消息、媒体、成员、频道、交互和请求等动作。无法支持的动作应返回明确的 `Warn` 或 `Fail` 结果，不要静默丢弃请求。需要从事件外主动调用时，调用方会通过目标对象提供群组、频道或用户范围。

媒体动作支持图片、音频、视频和文件；上传来源一次只能选择 URL、Base64、文件路径或已有文件 ID 之一。平台不支持的 Markdown、媒体或交互节点应按平台规则降级。
