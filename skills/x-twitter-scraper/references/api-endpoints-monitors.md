# Xquik REST API endpoints for monitors

### Create Monitor

```
POST /monitors
```

The request body has this shape.
```json
{
  "username": "elonmusk",
  "eventTypes": ["tweet.new", "tweet.reply", "tweet.quote"]
}
```

The response has this shape.
```json
{
  "id": "7",
  "username": "elonmusk",
  "xUserId": "44196397",
  "eventTypes": ["tweet.new", "tweet.reply", "tweet.quote"],
  "createdAt": "2026-02-24T10:30:00.000Z"
}
```

Event types are `tweet.new`, `tweet.quote`, `tweet.reply`, `tweet.retweet` and `webhook.test`.

Returns `409 monitor_already_exists` if the username is already monitored.

### List Monitors

```
GET /monitors
```

Returns all monitors (up to 200, no pagination). Response includes `monitors` array and `total` count.

### Get Monitor

```
GET /monitors/{id}
```

### Update Monitor

```
PATCH /monitors/{id}
```

The body is `{ "eventTypes": [...], "isActive": true|false }`. Both fields are optional.

### Delete Monitor

```
delete request to `/monitors/{id}`
```

Stops tracking and deletes all associated data.

### Keyword Monitors

```
GET /monitors/keywords
POST /monitors/keywords
GET /monitors/keywords/{id}
PATCH /monitors/keywords/{id}
delete request to `/monitors/keywords/{id}`
```

Create and manage ongoing keyword monitors. Treat these as persistent resources. Confirm the keyword query, event delivery plan, and ongoing usage before creating or enabling one.

---
