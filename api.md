# Shared

Types:

- <code><a href="./src/resources/shared.ts">Error</a></code>
- <code><a href="./src/resources/shared.ts">EventType</a></code>
- <code><a href="./src/resources/shared.ts">PaginatedTweets</a></code>
- <code><a href="./src/resources/shared.ts">PaginatedUsers</a></code>
- <code><a href="./src/resources/shared.ts">SearchTweet</a></code>
- <code><a href="./src/resources/shared.ts">UserProfile</a></code>

# Account

Types:

- <code><a href="./src/resources/account.ts">AccountRetrieveResponse</a></code>
- <code><a href="./src/resources/account.ts">AccountSetXUsernameResponse</a></code>
- <code><a href="./src/resources/account.ts">AccountUpdateLocaleResponse</a></code>

Methods:

- <code title="get /account">client.account.<a href="./src/resources/account.ts">retrieve</a>() -> AccountRetrieveResponse</code>
- <code title="put /account/x-identity">client.account.<a href="./src/resources/account.ts">setXUsername</a>({ ...params }) -> AccountSetXUsernameResponse</code>
- <code title="patch /account">client.account.<a href="./src/resources/account.ts">updateLocale</a>({ ...params }) -> AccountUpdateLocaleResponse</code>

# APIKeys

Types:

- <code><a href="./src/resources/api-keys.ts">APIKey</a></code>
- <code><a href="./src/resources/api-keys.ts">APIKeyCreateResponse</a></code>
- <code><a href="./src/resources/api-keys.ts">APIKeyListResponse</a></code>
- <code><a href="./src/resources/api-keys.ts">APIKeyRevokeResponse</a></code>

Methods:

- <code title="post /api-keys">client.apiKeys.<a href="./src/resources/api-keys.ts">create</a>({ ...params }) -> APIKeyCreateResponse</code>
- <code title="get /api-keys">client.apiKeys.<a href="./src/resources/api-keys.ts">list</a>() -> APIKeyListResponse</code>
- <code title="delete /api-keys/{id}">client.apiKeys.<a href="./src/resources/api-keys.ts">revoke</a>(id) -> APIKeyRevokeResponse</code>

# Subscribe

Types:

- <code><a href="./src/resources/subscribe.ts">SubscribeCreateResponse</a></code>

Methods:

- <code title="post /subscribe">client.subscribe.<a href="./src/resources/subscribe.ts">create</a>() -> SubscribeCreateResponse</code>

# Compose

Types:

- <code><a href="./src/resources/compose.ts">ComposeCreateResponse</a></code>

Methods:

- <code title="post /compose">client.compose.<a href="./src/resources/compose.ts">create</a>({ ...params }) -> ComposeCreateResponse</code>

# Drafts

Types:

- <code><a href="./src/resources/drafts.ts">Draft</a></code>
- <code><a href="./src/resources/drafts.ts">DraftDetail</a></code>
- <code><a href="./src/resources/drafts.ts">DraftListResponse</a></code>

Methods:

- <code title="post /drafts">client.drafts.<a href="./src/resources/drafts.ts">create</a>({ ...params }) -> DraftDetail</code>
- <code title="get /drafts/{id}">client.drafts.<a href="./src/resources/drafts.ts">retrieve</a>(id) -> DraftDetail</code>
- <code title="get /drafts">client.drafts.<a href="./src/resources/drafts.ts">list</a>({ ...params }) -> DraftListResponse</code>
- <code title="delete /drafts/{id}">client.drafts.<a href="./src/resources/drafts.ts">delete</a>(id) -> void</code>

# Styles

Types:

- <code><a href="./src/resources/styles.ts">StyleProfile</a></code>
- <code><a href="./src/resources/styles.ts">StyleProfileSummary</a></code>
- <code><a href="./src/resources/styles.ts">StyleListResponse</a></code>
- <code><a href="./src/resources/styles.ts">StyleCompareResponse</a></code>
- <code><a href="./src/resources/styles.ts">StyleGetPerformanceResponse</a></code>

Methods:

- <code title="get /styles/{id}">client.styles.<a href="./src/resources/styles.ts">retrieve</a>(id) -> StyleProfile</code>
- <code title="put /styles/{id}">client.styles.<a href="./src/resources/styles.ts">update</a>(id, { ...params }) -> StyleProfile</code>
- <code title="get /styles">client.styles.<a href="./src/resources/styles.ts">list</a>() -> StyleListResponse</code>
- <code title="delete /styles/{id}">client.styles.<a href="./src/resources/styles.ts">delete</a>(id) -> void</code>
- <code title="post /styles">client.styles.<a href="./src/resources/styles.ts">analyze</a>({ ...params }) -> StyleProfile</code>
- <code title="get /styles/compare">client.styles.<a href="./src/resources/styles.ts">compare</a>({ ...params }) -> StyleCompareResponse</code>
- <code title="get /styles/{id}/performance">client.styles.<a href="./src/resources/styles.ts">getPerformance</a>(id) -> StyleGetPerformanceResponse</code>

# Radar

Types:

- <code><a href="./src/resources/radar.ts">RadarItem</a></code>
- <code><a href="./src/resources/radar.ts">RadarRetrieveTrendingTopicsResponse</a></code>

Methods:

- <code title="get /radar">client.radar.<a href="./src/resources/radar.ts">retrieveTrendingTopics</a>({ ...params }) -> RadarRetrieveTrendingTopicsResponse</code>

# Monitors

Types:

- <code><a href="./src/resources/monitors.ts">Monitor</a></code>
- <code><a href="./src/resources/monitors.ts">MonitorCreateResponse</a></code>
- <code><a href="./src/resources/monitors.ts">MonitorListResponse</a></code>
- <code><a href="./src/resources/monitors.ts">MonitorDeactivateResponse</a></code>

Methods:

- <code title="post /monitors">client.monitors.<a href="./src/resources/monitors.ts">create</a>({ ...params }) -> MonitorCreateResponse</code>
- <code title="get /monitors/{id}">client.monitors.<a href="./src/resources/monitors.ts">retrieve</a>(id) -> Monitor</code>
- <code title="patch /monitors/{id}">client.monitors.<a href="./src/resources/monitors.ts">update</a>(id, { ...params }) -> Monitor</code>
- <code title="get /monitors">client.monitors.<a href="./src/resources/monitors.ts">list</a>() -> MonitorListResponse</code>
- <code title="delete /monitors/{id}">client.monitors.<a href="./src/resources/monitors.ts">deactivate</a>(id) -> MonitorDeactivateResponse</code>

# Events

Types:

- <code><a href="./src/resources/events.ts">Event</a></code>
- <code><a href="./src/resources/events.ts">EventDetail</a></code>
- <code><a href="./src/resources/events.ts">EventListResponse</a></code>

Methods:

- <code title="get /events/{id}">client.events.<a href="./src/resources/events.ts">retrieve</a>(id) -> EventDetail</code>
- <code title="get /events">client.events.<a href="./src/resources/events.ts">list</a>({ ...params }) -> EventListResponse</code>

# Extractions

Types:

- <code><a href="./src/resources/extractions.ts">ExtractionJob</a></code>
- <code><a href="./src/resources/extractions.ts">ExtractionRetrieveResponse</a></code>
- <code><a href="./src/resources/extractions.ts">ExtractionListResponse</a></code>
- <code><a href="./src/resources/extractions.ts">ExtractionEstimateCostResponse</a></code>
- <code><a href="./src/resources/extractions.ts">ExtractionRunResponse</a></code>

Methods:

- <code title="get /extractions/{id}">client.extractions.<a href="./src/resources/extractions.ts">retrieve</a>(id, { ...params }) -> ExtractionRetrieveResponse</code>
- <code title="get /extractions">client.extractions.<a href="./src/resources/extractions.ts">list</a>({ ...params }) -> ExtractionListResponse</code>
- <code title="post /extractions/estimate">client.extractions.<a href="./src/resources/extractions.ts">estimateCost</a>({ ...params }) -> ExtractionEstimateCostResponse</code>
- <code title="get /extractions/{id}/export">client.extractions.<a href="./src/resources/extractions.ts">exportResults</a>(id, { ...params }) -> Response</code>
- <code title="post /extractions">client.extractions.<a href="./src/resources/extractions.ts">run</a>({ ...params }) -> ExtractionRunResponse</code>

# Draws

Types:

- <code><a href="./src/resources/draws.ts">DrawDetail</a></code>
- <code><a href="./src/resources/draws.ts">DrawListItem</a></code>
- <code><a href="./src/resources/draws.ts">Winner</a></code>
- <code><a href="./src/resources/draws.ts">DrawRetrieveResponse</a></code>
- <code><a href="./src/resources/draws.ts">DrawListResponse</a></code>
- <code><a href="./src/resources/draws.ts">DrawRunResponse</a></code>

Methods:

- <code title="get /draws/{id}">client.draws.<a href="./src/resources/draws.ts">retrieve</a>(id) -> DrawRetrieveResponse</code>
- <code title="get /draws">client.draws.<a href="./src/resources/draws.ts">list</a>({ ...params }) -> DrawListResponse</code>
- <code title="get /draws/{id}/export">client.draws.<a href="./src/resources/draws.ts">export</a>(id, { ...params }) -> Response</code>
- <code title="post /draws">client.draws.<a href="./src/resources/draws.ts">run</a>({ ...params }) -> DrawRunResponse</code>

# Webhooks

Types:

- <code><a href="./src/resources/webhooks.ts">Delivery</a></code>
- <code><a href="./src/resources/webhooks.ts">Webhook</a></code>
- <code><a href="./src/resources/webhooks.ts">WebhookCreateResponse</a></code>
- <code><a href="./src/resources/webhooks.ts">WebhookListResponse</a></code>
- <code><a href="./src/resources/webhooks.ts">WebhookDeactivateResponse</a></code>
- <code><a href="./src/resources/webhooks.ts">WebhookListDeliveriesResponse</a></code>
- <code><a href="./src/resources/webhooks.ts">WebhookTestResponse</a></code>

Methods:

- <code title="post /webhooks">client.webhooks.<a href="./src/resources/webhooks.ts">create</a>({ ...params }) -> WebhookCreateResponse</code>
- <code title="patch /webhooks/{id}">client.webhooks.<a href="./src/resources/webhooks.ts">update</a>(id, { ...params }) -> Webhook</code>
- <code title="get /webhooks">client.webhooks.<a href="./src/resources/webhooks.ts">list</a>() -> WebhookListResponse</code>
- <code title="delete /webhooks/{id}">client.webhooks.<a href="./src/resources/webhooks.ts">deactivate</a>(id) -> WebhookDeactivateResponse</code>
- <code title="get /webhooks/{id}/deliveries">client.webhooks.<a href="./src/resources/webhooks.ts">listDeliveries</a>(id) -> WebhookListDeliveriesResponse</code>
- <code title="post /webhooks/{id}/test">client.webhooks.<a href="./src/resources/webhooks.ts">test</a>(id) -> WebhookTestResponse</code>

# Integrations

Types:

- <code><a href="./src/resources/integrations.ts">Integration</a></code>
- <code><a href="./src/resources/integrations.ts">IntegrationDelivery</a></code>
- <code><a href="./src/resources/integrations.ts">IntegrationListResponse</a></code>
- <code><a href="./src/resources/integrations.ts">IntegrationDeleteResponse</a></code>
- <code><a href="./src/resources/integrations.ts">IntegrationListDeliveriesResponse</a></code>
- <code><a href="./src/resources/integrations.ts">IntegrationSendTestResponse</a></code>

Methods:

- <code title="post /integrations">client.integrations.<a href="./src/resources/integrations.ts">create</a>({ ...params }) -> Integration</code>
- <code title="get /integrations/{id}">client.integrations.<a href="./src/resources/integrations.ts">retrieve</a>(id) -> Integration</code>
- <code title="patch /integrations/{id}">client.integrations.<a href="./src/resources/integrations.ts">update</a>(id, { ...params }) -> Integration</code>
- <code title="get /integrations">client.integrations.<a href="./src/resources/integrations.ts">list</a>() -> IntegrationListResponse</code>
- <code title="delete /integrations/{id}">client.integrations.<a href="./src/resources/integrations.ts">delete</a>(id) -> IntegrationDeleteResponse</code>
- <code title="get /integrations/{id}/deliveries">client.integrations.<a href="./src/resources/integrations.ts">listDeliveries</a>(id, { ...params }) -> IntegrationListDeliveriesResponse</code>
- <code title="post /integrations/{id}/test">client.integrations.<a href="./src/resources/integrations.ts">sendTest</a>(id) -> IntegrationSendTestResponse</code>

# X

Types:

- <code><a href="./src/resources/x/x.ts">XGetArticleResponse</a></code>
- <code><a href="./src/resources/x/x.ts">XGetNotificationsResponse</a></code>
- <code><a href="./src/resources/x/x.ts">XGetTrendsResponse</a></code>

Methods:

- <code title="get /x/articles/{tweetId}">client.x.<a href="./src/resources/x/x.ts">getArticle</a>(tweetID) -> XGetArticleResponse</code>
- <code title="get /x/timeline">client.x.<a href="./src/resources/x/x.ts">getHomeTimeline</a>({ ...params }) -> PaginatedTweets</code>
- <code title="get /x/notifications">client.x.<a href="./src/resources/x/x.ts">getNotifications</a>({ ...params }) -> XGetNotificationsResponse</code>
- <code title="get /x/trends">client.x.<a href="./src/resources/x/x.ts">getTrends</a>() -> XGetTrendsResponse</code>

## Tweets

Types:

- <code><a href="./src/resources/x/tweets/tweets.ts">TweetAuthor</a></code>
- <code><a href="./src/resources/x/tweets/tweets.ts">TweetDetail</a></code>
- <code><a href="./src/resources/x/tweets/tweets.ts">TweetCreateResponse</a></code>
- <code><a href="./src/resources/x/tweets/tweets.ts">TweetRetrieveResponse</a></code>
- <code><a href="./src/resources/x/tweets/tweets.ts">TweetDeleteResponse</a></code>

Methods:

- <code title="post /x/tweets">client.x.tweets.<a href="./src/resources/x/tweets/tweets.ts">create</a>({ ...params }) -> TweetCreateResponse</code>
- <code title="get /x/tweets/{id}">client.x.tweets.<a href="./src/resources/x/tweets/tweets.ts">retrieve</a>(id) -> TweetRetrieveResponse</code>
- <code title="get /x/tweets">client.x.tweets.<a href="./src/resources/x/tweets/tweets.ts">list</a>({ ...params }) -> PaginatedTweets</code>
- <code title="delete /x/tweets/{id}">client.x.tweets.<a href="./src/resources/x/tweets/tweets.ts">delete</a>(id, { ...params }) -> TweetDeleteResponse</code>
- <code title="get /x/tweets/{id}/favoriters">client.x.tweets.<a href="./src/resources/x/tweets/tweets.ts">getFavoriters</a>(id, { ...params }) -> PaginatedUsers</code>
- <code title="get /x/tweets/{id}/quotes">client.x.tweets.<a href="./src/resources/x/tweets/tweets.ts">getQuotes</a>(id, { ...params }) -> PaginatedTweets</code>
- <code title="get /x/tweets/{id}/replies">client.x.tweets.<a href="./src/resources/x/tweets/tweets.ts">getReplies</a>(id, { ...params }) -> PaginatedTweets</code>
- <code title="get /x/tweets/{id}/retweeters">client.x.tweets.<a href="./src/resources/x/tweets/tweets.ts">getRetweeters</a>(id, { ...params }) -> PaginatedUsers</code>
- <code title="get /x/tweets/{id}/thread">client.x.tweets.<a href="./src/resources/x/tweets/tweets.ts">getThread</a>(id, { ...params }) -> PaginatedTweets</code>
- <code title="get /x/tweets/search">client.x.tweets.<a href="./src/resources/x/tweets/tweets.ts">search</a>({ ...params }) -> PaginatedTweets</code>

### Like

Types:

- <code><a href="./src/resources/x/tweets/like.ts">LikeCreateResponse</a></code>
- <code><a href="./src/resources/x/tweets/like.ts">LikeDeleteResponse</a></code>

Methods:

- <code title="post /x/tweets/{id}/like">client.x.tweets.like.<a href="./src/resources/x/tweets/like.ts">create</a>(id, { ...params }) -> LikeCreateResponse</code>
- <code title="delete /x/tweets/{id}/like">client.x.tweets.like.<a href="./src/resources/x/tweets/like.ts">delete</a>(id, { ...params }) -> LikeDeleteResponse</code>

### Retweet

Types:

- <code><a href="./src/resources/x/tweets/retweet.ts">RetweetCreateResponse</a></code>
- <code><a href="./src/resources/x/tweets/retweet.ts">RetweetDeleteResponse</a></code>

Methods:

- <code title="post /x/tweets/{id}/retweet">client.x.tweets.retweet.<a href="./src/resources/x/tweets/retweet.ts">create</a>(id, { ...params }) -> RetweetCreateResponse</code>
- <code title="delete /x/tweets/{id}/retweet">client.x.tweets.retweet.<a href="./src/resources/x/tweets/retweet.ts">delete</a>(id, { ...params }) -> RetweetDeleteResponse</code>

## Users

Methods:

- <code title="get /x/users/{id}">client.x.users.<a href="./src/resources/x/users/users.ts">retrieve</a>(id) -> UserProfile</code>
- <code title="get /x/users/batch">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveBatch</a>({ ...params }) -> PaginatedUsers</code>
- <code title="get /x/users/{id}/followers">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveFollowers</a>(id, { ...params }) -> PaginatedUsers</code>
- <code title="get /x/users/{id}/followers-you-know">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveFollowersYouKnow</a>(id, { ...params }) -> PaginatedUsers</code>
- <code title="get /x/users/{id}/following">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveFollowing</a>(id, { ...params }) -> PaginatedUsers</code>
- <code title="get /x/users/{id}/likes">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveLikes</a>(id, { ...params }) -> PaginatedTweets</code>
- <code title="get /x/users/{id}/media">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveMedia</a>(id, { ...params }) -> PaginatedTweets</code>
- <code title="get /x/users/{id}/mentions">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveMentions</a>(id, { ...params }) -> PaginatedTweets</code>
- <code title="get /x/users/search">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveSearch</a>({ ...params }) -> PaginatedUsers</code>
- <code title="get /x/users/{id}/tweets">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveTweets</a>(id, { ...params }) -> PaginatedTweets</code>
- <code title="get /x/users/{id}/verified-followers">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveVerifiedFollowers</a>(id, { ...params }) -> PaginatedUsers</code>

### Follow

Types:

- <code><a href="./src/resources/x/users/follow.ts">FollowCreateResponse</a></code>
- <code><a href="./src/resources/x/users/follow.ts">FollowDeleteAllResponse</a></code>

Methods:

- <code title="post /x/users/{id}/follow">client.x.users.follow.<a href="./src/resources/x/users/follow.ts">create</a>(id, { ...params }) -> FollowCreateResponse</code>
- <code title="delete /x/users/{id}/follow">client.x.users.follow.<a href="./src/resources/x/users/follow.ts">deleteAll</a>(id, { ...params }) -> FollowDeleteAllResponse</code>

## Followers

Types:

- <code><a href="./src/resources/x/followers.ts">FollowerCheckResponse</a></code>

Methods:

- <code title="get /x/followers/check">client.x.followers.<a href="./src/resources/x/followers.ts">check</a>({ ...params }) -> FollowerCheckResponse</code>

## Dm

Types:

- <code><a href="./src/resources/x/dm.ts">DmRetrieveHistoryResponse</a></code>
- <code><a href="./src/resources/x/dm.ts">DmSendResponse</a></code>

Methods:

- <code title="get /x/dm/{userId}/history">client.x.dm.<a href="./src/resources/x/dm.ts">retrieveHistory</a>(userID, { ...params }) -> DmRetrieveHistoryResponse</code>
- <code title="post /x/dm/{userId}">client.x.dm.<a href="./src/resources/x/dm.ts">send</a>(userID, { ...params }) -> DmSendResponse</code>

## Media

Types:

- <code><a href="./src/resources/x/media.ts">MediaDownloadResponse</a></code>
- <code><a href="./src/resources/x/media.ts">MediaUploadResponse</a></code>

Methods:

- <code title="post /x/media/download">client.x.media.<a href="./src/resources/x/media.ts">download</a>({ ...params }) -> MediaDownloadResponse</code>
- <code title="post /x/media">client.x.media.<a href="./src/resources/x/media.ts">upload</a>({ ...params }) -> MediaUploadResponse</code>

## Profile

Types:

- <code><a href="./src/resources/x/profile.ts">ProfileUpdateResponse</a></code>
- <code><a href="./src/resources/x/profile.ts">ProfileUpdateAvatarResponse</a></code>
- <code><a href="./src/resources/x/profile.ts">ProfileUpdateBannerResponse</a></code>

Methods:

- <code title="patch /x/profile">client.x.profile.<a href="./src/resources/x/profile.ts">update</a>({ ...params }) -> ProfileUpdateResponse</code>
- <code title="patch /x/profile/avatar">client.x.profile.<a href="./src/resources/x/profile.ts">updateAvatar</a>({ ...params }) -> ProfileUpdateAvatarResponse</code>
- <code title="patch /x/profile/banner">client.x.profile.<a href="./src/resources/x/profile.ts">updateBanner</a>({ ...params }) -> ProfileUpdateBannerResponse</code>

## Communities

Types:

- <code><a href="./src/resources/x/communities/communities.ts">CommunityActionResult</a></code>
- <code><a href="./src/resources/x/communities/communities.ts">CommunityCreateResponse</a></code>
- <code><a href="./src/resources/x/communities/communities.ts">CommunityDeleteResponse</a></code>
- <code><a href="./src/resources/x/communities/communities.ts">CommunityRetrieveInfoResponse</a></code>

Methods:

- <code title="post /x/communities">client.x.communities.<a href="./src/resources/x/communities/communities.ts">create</a>({ ...params }) -> CommunityCreateResponse</code>
- <code title="delete /x/communities/{id}">client.x.communities.<a href="./src/resources/x/communities/communities.ts">delete</a>(id, { ...params }) -> CommunityDeleteResponse</code>
- <code title="get /x/communities/{id}/info">client.x.communities.<a href="./src/resources/x/communities/communities.ts">retrieveInfo</a>(id) -> CommunityRetrieveInfoResponse</code>
- <code title="get /x/communities/{id}/members">client.x.communities.<a href="./src/resources/x/communities/communities.ts">retrieveMembers</a>(id, { ...params }) -> PaginatedUsers</code>
- <code title="get /x/communities/{id}/moderators">client.x.communities.<a href="./src/resources/x/communities/communities.ts">retrieveModerators</a>(id, { ...params }) -> PaginatedUsers</code>
- <code title="get /x/communities/search">client.x.communities.<a href="./src/resources/x/communities/communities.ts">retrieveSearch</a>({ ...params }) -> PaginatedTweets</code>

### Join

Methods:

- <code title="post /x/communities/{id}/join">client.x.communities.join.<a href="./src/resources/x/communities/join.ts">create</a>(id, { ...params }) -> CommunityActionResult</code>
- <code title="delete /x/communities/{id}/join">client.x.communities.join.<a href="./src/resources/x/communities/join.ts">deleteAll</a>(id, { ...params }) -> CommunityActionResult</code>

### Tweets

Methods:

- <code title="get /x/communities/tweets">client.x.communities.tweets.<a href="./src/resources/x/communities/tweets.ts">list</a>({ ...params }) -> PaginatedTweets</code>
- <code title="get /x/communities/{id}/tweets">client.x.communities.tweets.<a href="./src/resources/x/communities/tweets.ts">listByCommunity</a>(id, { ...params }) -> PaginatedTweets</code>

## Accounts

Types:

- <code><a href="./src/resources/x/accounts.ts">XAccount</a></code>
- <code><a href="./src/resources/x/accounts.ts">XAccountDetail</a></code>
- <code><a href="./src/resources/x/accounts.ts">AccountCreateResponse</a></code>
- <code><a href="./src/resources/x/accounts.ts">AccountListResponse</a></code>
- <code><a href="./src/resources/x/accounts.ts">AccountDeleteResponse</a></code>
- <code><a href="./src/resources/x/accounts.ts">AccountBulkRetryResponse</a></code>
- <code><a href="./src/resources/x/accounts.ts">AccountReauthResponse</a></code>

Methods:

- <code title="post /x/accounts">client.x.accounts.<a href="./src/resources/x/accounts.ts">create</a>({ ...params }) -> AccountCreateResponse</code>
- <code title="get /x/accounts/{id}">client.x.accounts.<a href="./src/resources/x/accounts.ts">retrieve</a>(id) -> XAccountDetail</code>
- <code title="get /x/accounts">client.x.accounts.<a href="./src/resources/x/accounts.ts">list</a>() -> AccountListResponse</code>
- <code title="delete /x/accounts/{id}">client.x.accounts.<a href="./src/resources/x/accounts.ts">delete</a>(id) -> AccountDeleteResponse</code>
- <code title="post /x/accounts/bulk-retry">client.x.accounts.<a href="./src/resources/x/accounts.ts">bulkRetry</a>() -> AccountBulkRetryResponse</code>
- <code title="post /x/accounts/{id}/reauth">client.x.accounts.<a href="./src/resources/x/accounts.ts">reauth</a>(id, { ...params }) -> AccountReauthResponse</code>

## Bookmarks

Types:

- <code><a href="./src/resources/x/bookmarks.ts">BookmarkRetrieveFoldersResponse</a></code>

Methods:

- <code title="get /x/bookmarks">client.x.bookmarks.<a href="./src/resources/x/bookmarks.ts">list</a>({ ...params }) -> PaginatedTweets</code>
- <code title="get /x/bookmarks/folders">client.x.bookmarks.<a href="./src/resources/x/bookmarks.ts">retrieveFolders</a>() -> BookmarkRetrieveFoldersResponse</code>

## Lists

Methods:

- <code title="get /x/lists/{id}/followers">client.x.lists.<a href="./src/resources/x/lists.ts">retrieveFollowers</a>(id, { ...params }) -> PaginatedUsers</code>
- <code title="get /x/lists/{id}/members">client.x.lists.<a href="./src/resources/x/lists.ts">retrieveMembers</a>(id, { ...params }) -> PaginatedUsers</code>
- <code title="get /x/lists/{id}/tweets">client.x.lists.<a href="./src/resources/x/lists.ts">retrieveTweets</a>(id, { ...params }) -> PaginatedTweets</code>

# Trends

Types:

- <code><a href="./src/resources/trends.ts">TrendListResponse</a></code>

Methods:

- <code title="get /trends">client.trends.<a href="./src/resources/trends.ts">list</a>({ ...params }) -> TrendListResponse</code>

# Bot

## PlatformLinks

# Support

## Tickets

Types:

- <code><a href="./src/resources/support/tickets.ts">TicketCreateResponse</a></code>
- <code><a href="./src/resources/support/tickets.ts">TicketRetrieveResponse</a></code>
- <code><a href="./src/resources/support/tickets.ts">TicketUpdateResponse</a></code>
- <code><a href="./src/resources/support/tickets.ts">TicketListResponse</a></code>
- <code><a href="./src/resources/support/tickets.ts">TicketReplyResponse</a></code>

Methods:

- <code title="post /support/tickets">client.support.tickets.<a href="./src/resources/support/tickets.ts">create</a>({ ...params }) -> TicketCreateResponse</code>
- <code title="get /support/tickets/{id}">client.support.tickets.<a href="./src/resources/support/tickets.ts">retrieve</a>(id) -> TicketRetrieveResponse</code>
- <code title="patch /support/tickets/{id}">client.support.tickets.<a href="./src/resources/support/tickets.ts">update</a>(id, { ...params }) -> TicketUpdateResponse</code>
- <code title="get /support/tickets">client.support.tickets.<a href="./src/resources/support/tickets.ts">list</a>() -> TicketListResponse</code>
- <code title="post /support/tickets/{id}/messages">client.support.tickets.<a href="./src/resources/support/tickets.ts">reply</a>(id, { ...params }) -> TicketReplyResponse</code>

# Credits

Types:

- <code><a href="./src/resources/credits.ts">CreditRetrieveBalanceResponse</a></code>
- <code><a href="./src/resources/credits.ts">CreditTopupBalanceResponse</a></code>

Methods:

- <code title="get /credits">client.credits.<a href="./src/resources/credits.ts">retrieveBalance</a>() -> CreditRetrieveBalanceResponse</code>
- <code title="post /credits/topup">client.credits.<a href="./src/resources/credits.ts">topupBalance</a>({ ...params }) -> CreditTopupBalanceResponse</code>
