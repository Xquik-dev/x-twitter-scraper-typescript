# Xquik REST API endpoints for support

### Create Ticket

```
POST /support/tickets
```

The body is `{ "subject": "...", "body": "..." }`.

A `201` response is `{ id, subject, status, createdAt }`.

### List Tickets

```
GET /support/tickets
```

Returns all tickets for the authenticated user.

### Get Ticket

```
GET /support/tickets/{id}
```

Returns ticket with messages.

### Update Ticket

```
PATCH /support/tickets/{id}
```

Update ticket status.

### Reply to Ticket

```
POST /support/tickets/{id}/messages
```

The body is `{ "body": "..." }`.

Add a message to an existing ticket.

---
