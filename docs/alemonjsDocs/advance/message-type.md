---
label: '事件类型'
sidebar_position: 5
---

# 事件类型

```ts
export type EventsMessageCreate = {
  'message.create': PublicEventMessageCreate
  'private.message.create': PrivateEventMessageCreate
  'interaction.create': PublicEventInteractionCreate
  'private.interaction.create': PrivateEventInteractionCreate
}

export type Events = {
  'message.update': PublicEventMessageUpdate
  'message.delete': PublicEventMessageDelete
  'message.reaction.add': PublicEventMessageReactionAdd
  'message.reaction.remove': PublicEventMessageReactionRemove
  'channal.create': PublicEventChannalCreate
  'channal.delete': PublicEventChannalDelete
  'guild.join': PublicEventGuildJoin
  'guild.exit': PublicEventGuildExit
  'member.add': PublicEventMemberAdd
  'member.remove': PublicEventMemberRemove
  'private.message.update': PrivateEventMessageUpdate
  'private.message.delete': PrivateEventMessageDelete
  'private.friend.add': PrivateEventRequestFriendAdd
  'private.guild.add': PrivateEventRequestGuildAdd
} & EventsMessageCreate

export type EventKeys = keyof Events

export type EventsEnum = Events[EventKeys]
```
