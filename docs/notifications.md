# Notifications

A notification item is `{ id, createdAt, seenAt, type, payload }`. `payload` is owned by the app. `seenAt` is an ISO string or null.

Server-sent events use the name `notification` for a new or updated item and `notification.removed` for a deletion. The event id is the notification id, which is also the `since` cursor.

Lists use a cursor page: `{ items, nextCursor }`.
