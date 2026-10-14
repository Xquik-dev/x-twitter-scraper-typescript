# Xquik REST API endpoints for drafts

### Create Draft

`POST /drafts`

Save a tweet draft for later.

The request body takes these fields.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `text` | string | Yes | The draft tweet text |
| `topic` | string | No | Topic the tweet is about |
| `goal` | string | No | Optimization goal, one of `engagement`, `followers`, `authority`, `conversation` |

A `201` response has this shape.

```json
{
  "id": "123",
  "text": "draft text",
  "topic": "product launch",
  "goal": "engagement",
  "createdAt": "2026-02-24T10:30:00.000Z",
  "updatedAt": "2026-02-24T10:30:00.000Z"
}
```

---

### List Drafts

`GET /drafts`

List saved tweet drafts with cursor pagination.

It takes these query parameters.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | number | No | 50 | Results per page (max 50) |
| `afterCursor` | string | No | - | Pagination cursor from previous response |

A `200` response has this shape.

```json
{
  "drafts": [
    {
      "id": "123",
      "text": "draft text",
      "topic": "product launch",
      "goal": "engagement",
      "createdAt": "2026-02-24T10:30:00.000Z",
      "updatedAt": "2026-02-24T10:30:00.000Z"
    }
  ],
  "afterCursor": "cursor_string",
  "hasMore": true
}
```

---

### Get Draft

`GET /drafts/{id}`

Get a specific draft by ID.

A `200` response returns a single draft object.

It can return `400 invalid_id` or `404 draft_not_found`.

---

### Delete Draft

delete request to `/drafts/{id}`

Delete a draft. Returns `204 No Content`.

It can return `400 invalid_id` or `404 draft_not_found`.

---
