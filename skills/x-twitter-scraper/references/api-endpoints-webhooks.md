# Xquik REST API endpoints for webhooks

### Create Webhook

```
POST /webhooks
```

The request body has this shape.
```json
{
  "url": "https://your-server.com/webhook",
  "eventTypes": ["tweet.new", "tweet.reply"]
}
```

**Response** includes a `secret` field (shown only once). Store it for signature verification.

### List Webhooks

```
GET /webhooks
```

Returns all webhooks (up to 200). Secret is never exposed in list responses.

### Update Webhook

```
PATCH /webhooks/{id}
```

The body is `{ "url": "...", "eventTypes": [...], "isActive": true|false }`. All fields are optional.

### Delete Webhook

```
delete request to `/webhooks/{id}`
```

Permanently removes the webhook. All future deliveries are stopped.

### Test Webhook

```
POST /webhooks/{id}/test
```

Sends a `webhook.test` event to the webhook endpoint, HMAC-signed with the webhook's secret. Returns success or failure status with HTTP response details.

Xquik delivers this payload to your endpoint.
```json
{
  "eventType": "webhook.test",
  "data": {
    "message": "Test delivery from Xquik"
  },
  "timestamp": "2026-02-27T12:00:00.000Z"
}
```

The delivery includes the `X-Xquik-Signature` header, identical to production deliveries.

Returns `400 webhook_inactive` if the webhook is disabled. Reactivate via `PATCH /webhooks/{id}` before testing.

### List Deliveries

```
GET /webhooks/{id}/deliveries
```

View delivery attempts and statuses for a webhook. Statuses are `pending`, `delivered`, `failed` and `exhausted`.

---
