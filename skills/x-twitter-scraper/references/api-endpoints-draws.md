# Xquik REST API endpoints for draws

### Create Draw

```
POST /draws
```

Run a giveaway draw from a tweet. Picks random winners from replies.

The request body has this shape.
```json
{
  "tweetUrl": "https://x.com/NASA/status/2102882545427714266",
  "winnerCount": 3,
  "backupCount": 2,
  "uniqueAuthorsOnly": true,
  "mustRetweet": true,
  "mustFollowUsername": "burakbayir",
  "filterMinFollowers": 100,
  "filterAccountAgeDays": 30,
  "filterLanguage": "en",
  "requiredKeywords": ["giveaway"],
  "requiredHashtags": ["#contest"],
  "requiredMentions": ["@NASA"]
}
```

All filter fields are optional. Only `tweetUrl` is required.

The response has this shape.
```json
{
  "id": "42",
  "tweetId": "2102882545427714266",
  "tweetUrl": "https://x.com/NASA/status/2102882545427714266",
  "tweetText": "Welcome to the Artemis Accords, Croatia 🇭🇷\n \nToday, Croatia became the 74th nation that has committed to a peaceful and prosperous exploration of space. https://t.co/Xe1nm2pkSX https://t.co/QQGjcE6KKq",
  "tweetAuthorUsername": "NASA",
  "tweetLikeCount": 4200,
  "tweetRetweetCount": 1800,
  "tweetReplyCount": 1500,
  "tweetQuoteCount": 120,
  "status": "completed",
  "totalEntries": 1500,
  "validEntries": 890,
  "createdAt": "2026-09-25T10:00:00.000Z",
  "drawnAt": "2026-09-25T10:01:00.000Z"
}
```

### List Draws

```
GET /draws
```

Cursor-paginated. Returns compact draw objects.

### Get Draw

```
GET /draws/{id}
```

Returns full draw details including winners.

### Export Draw

```
GET /draws/{id}/export?format=csv&type=winners
```

Formats are `csv`, `json`, `md`, `md-document`, `pdf`, `txt` and `xlsx`. Types are `winners` (default) and `entries`. Entry exports cap at 100,000 rows, and PDF exports cap at 10,000.

---
