# Xquik REST API endpoints for API keys

Session auth only. These endpoints do not accept API key auth.

### Create API Key

```
POST /api-keys
```

The optional body is `{ "name": "My Key" }`.

The response returns `fullKey` (shown only once), `prefix`, `name`, `id`, `createdAt`.

### List API Keys

```
GET /api-keys
```

Returns all keys with `id`, `name`, `prefix`, `isActive`, `createdAt`, `lastUsedAt`. Full key is never exposed.

### Revoke API Key

```
delete request to `/api-keys/{id}`
```

Permanent and irreversible. The key stops working immediately.

---
