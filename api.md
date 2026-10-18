# Xquik TypeScript SDK API

> Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.

# Shared

Types

- <code><a href="./src/resources/shared.ts">Broadcast</a></code>
- <code><a href="./src/resources/shared.ts">Community</a></code>
- <code><a href="./src/resources/shared.ts">CommunityPage</a></code>
- <code><a href="./src/resources/shared.ts">CommunityTopic</a></code>
- <code><a href="./src/resources/shared.ts">ContentDisclosure</a></code>
- <code><a href="./src/resources/shared.ts">EmbeddedTweet</a></code>
- <code><a href="./src/resources/shared.ts">Error</a></code>
- <code><a href="./src/resources/shared.ts">EventType</a></code>
- <code><a href="./src/resources/shared.ts">MonitorFollow</a></code>
- <code><a href="./src/resources/shared.ts">PaginatedTweets</a></code>
- <code><a href="./src/resources/shared.ts">PaginatedUsers</a></code>
- <code><a href="./src/resources/shared.ts">SearchTweet</a></code>
- <code><a href="./src/resources/shared.ts">TweetMedia</a></code>
- <code><a href="./src/resources/shared.ts">UserListPage</a></code>
- <code><a href="./src/resources/shared.ts">UserProfile</a></code>

# Account

Types

- <code><a href="./src/resources/account.ts">AccountRetrieveResponse</a></code>
- <code><a href="./src/resources/account.ts">AccountSetXUsernameResponse</a></code>
- <code><a href="./src/resources/account.ts">AccountUpdateLocaleResponse</a></code>

Methods

- <code title="get /account">client.account.<a href="./src/resources/account.ts">retrieve</a>() -> AccountRetrieveResponse</code>
- <code title="put /account/x-identity">client.account.<a href="./src/resources/account.ts">setXUsername</a>({ ...params }) -> AccountSetXUsernameResponse</code>
- <code title="patch /account">client.account.<a href="./src/resources/account.ts">updateLocale</a>({ ...params }) -> AccountUpdateLocaleResponse</code>

# Subscribe

Types

- <code><a href="./src/resources/subscribe.ts">SubscribeCreateResponse</a></code>

Methods

- <code title="post /subscribe">client.subscribe.<a href="./src/resources/subscribe.ts">create</a>({ ...params }) -> SubscribeCreateResponse</code>

# Compose

Types

- <code><a href="./src/resources/compose.ts">ComposeCreateResponse</a></code>

Methods

- <code title="post /compose">client.compose.<a href="./src/resources/compose.ts">create</a>({ ...params }) -> ComposeCreateResponse</code>

# Drafts

Types

- <code><a href="./src/resources/drafts.ts">Draft</a></code>
- <code><a href="./src/resources/drafts.ts">DraftDetail</a></code>
- <code><a href="./src/resources/drafts.ts">DraftCreateResponse</a></code>
- <code><a href="./src/resources/drafts.ts">DraftListResponse</a></code>

Methods

- <code title="post /drafts">client.drafts.<a href="./src/resources/drafts.ts">create</a>({ ...params }) -> DraftCreateResponse</code>
- <code title="get /drafts/{id}">client.drafts.<a href="./src/resources/drafts.ts">retrieve</a>(id) -> DraftDetail</code>
- <code title="get /drafts">client.drafts.<a href="./src/resources/drafts.ts">list</a>({ ...params }) -> DraftListResponse</code>
- <code title="delete /drafts/{id}">client.drafts.<a href="./src/resources/drafts.ts">delete</a>(id) -> void</code>

# Styles

Types

- <code><a href="./src/resources/styles.ts">StyleProfile</a></code>
- <code><a href="./src/resources/styles.ts">StyleProfileSummary</a></code>
- <code><a href="./src/resources/styles.ts">StyleListResponse</a></code>
- <code><a href="./src/resources/styles.ts">StyleCompareResponse</a></code>
- <code><a href="./src/resources/styles.ts">StyleGetPerformanceResponse</a></code>

Methods

- <code title="get /styles/{id}">client.styles.<a href="./src/resources/styles.ts">retrieve</a>(id) -> StyleProfile</code>
- <code title="put /styles/{id}">client.styles.<a href="./src/resources/styles.ts">update</a>(id, { ...params }) -> StyleProfile</code>
- <code title="get /styles">client.styles.<a href="./src/resources/styles.ts">list</a>({ ...params }) -> StyleListResponse</code>
- <code title="delete /styles/{id}">client.styles.<a href="./src/resources/styles.ts">delete</a>(id) -> void</code>
- <code title="post /styles">client.styles.<a href="./src/resources/styles.ts">analyze</a>({ ...params }) -> StyleProfile</code>
- <code title="get /styles/compare">client.styles.<a href="./src/resources/styles.ts">compare</a>({ ...params }) -> StyleCompareResponse</code>
- <code title="get /styles/{id}/performance">client.styles.<a href="./src/resources/styles.ts">getPerformance</a>(id) -> StyleGetPerformanceResponse</code>

# Radar

Types

- <code><a href="./src/resources/radar.ts">RadarItem</a></code>
- <code><a href="./src/resources/radar.ts">RadarRetrieveTrendingTopicsResponse</a></code>

Methods

- <code title="get /radar">client.radar.<a href="./src/resources/radar.ts">retrieveTrendingTopics</a>({ ...params }) -> RadarRetrieveTrendingTopicsResponse</code>

# Monitors

Types

- <code><a href="./src/resources/monitors/monitors.ts">Monitor</a></code>
- <code><a href="./src/resources/monitors/monitors.ts">MonitorCreateResponse</a></code>
- <code><a href="./src/resources/monitors/monitors.ts">MonitorListResponse</a></code>
- <code><a href="./src/resources/monitors/monitors.ts">MonitorDeactivateResponse</a></code>

Methods

- <code title="post /monitors">client.monitors.<a href="./src/resources/monitors/monitors.ts">create</a>({ ...params }) -> MonitorCreateResponse</code>
- <code title="get /monitors/{id}">client.monitors.<a href="./src/resources/monitors/monitors.ts">retrieve</a>(id) -> Monitor</code>
- <code title="patch /monitors/{id}">client.monitors.<a href="./src/resources/monitors/monitors.ts">update</a>(id, { ...params }) -> Monitor</code>
- <code title="get /monitors">client.monitors.<a href="./src/resources/monitors/monitors.ts">list</a>({ ...params }) -> MonitorListResponse</code>
- <code title="delete /monitors/{id}">client.monitors.<a href="./src/resources/monitors/monitors.ts">deactivate</a>(id) -> MonitorDeactivateResponse</code>

## Keywords

Types

- <code><a href="./src/resources/monitors/keywords.ts">KeywordCreateResponse</a></code>
- <code><a href="./src/resources/monitors/keywords.ts">KeywordRetrieveResponse</a></code>
- <code><a href="./src/resources/monitors/keywords.ts">KeywordUpdateResponse</a></code>
- <code><a href="./src/resources/monitors/keywords.ts">KeywordListResponse</a></code>
- <code><a href="./src/resources/monitors/keywords.ts">KeywordDeactivateResponse</a></code>

Methods

- <code title="post /monitors/keywords">client.monitors.keywords.<a href="./src/resources/monitors/keywords.ts">create</a>({ ...params }) -> KeywordCreateResponse</code>
- <code title="get /monitors/keywords/{id}">client.monitors.keywords.<a href="./src/resources/monitors/keywords.ts">retrieve</a>(id) -> KeywordRetrieveResponse</code>
- <code title="patch /monitors/keywords/{id}">client.monitors.keywords.<a href="./src/resources/monitors/keywords.ts">update</a>(id, { ...params }) -> KeywordUpdateResponse</code>
- <code title="get /monitors/keywords">client.monitors.keywords.<a href="./src/resources/monitors/keywords.ts">list</a>({ ...params }) -> KeywordListResponse</code>
- <code title="delete /monitors/keywords/{id}">client.monitors.keywords.<a href="./src/resources/monitors/keywords.ts">deactivate</a>(id) -> KeywordDeactivateResponse</code>

# Events

Types

- <code><a href="./src/resources/events.ts">Event</a></code>
- <code><a href="./src/resources/events.ts">EventDetail</a></code>
- <code><a href="./src/resources/events.ts">EventListResponse</a></code>

Methods

- <code title="get /events/{id}">client.events.<a href="./src/resources/events.ts">retrieve</a>(id) -> EventDetail</code>
- <code title="get /events">client.events.<a href="./src/resources/events.ts">list</a>({ ...params }) -> EventListResponse</code>
- <code title="get /events/stream">client.events.<a href="./src/resources/events.ts">stream</a>({ ...params }) -> Stream<Event></code>

# Extractions

Types

- <code><a href="./src/resources/extractions.ts">ExtractionJob</a></code>
- <code><a href="./src/resources/extractions.ts">ExtractionRetrieveResponse</a></code>
- <code><a href="./src/resources/extractions.ts">ExtractionListResponse</a></code>
- <code><a href="./src/resources/extractions.ts">ExtractionCancelResponse</a></code>
- <code><a href="./src/resources/extractions.ts">ExtractionEstimateCostResponse</a></code>
- <code><a href="./src/resources/extractions.ts">ExtractionRunResponse</a></code>

Methods

- <code title="get /extractions/{id}">client.extractions.<a href="./src/resources/extractions.ts">retrieve</a>(id, { ...params }) -> ExtractionRetrieveResponse</code>
- <code title="get /extractions">client.extractions.<a href="./src/resources/extractions.ts">list</a>({ ...params }) -> ExtractionListResponse</code>
- <code title="delete /extractions/{id}">client.extractions.<a href="./src/resources/extractions.ts">cancel</a>(id) -> ExtractionCancelResponse</code>
- <code title="post /extractions/estimate">client.extractions.<a href="./src/resources/extractions.ts">estimateCost</a>({ ...params }) -> ExtractionEstimateCostResponse</code>
- <code title="get /extractions/{id}/export">client.extractions.<a href="./src/resources/extractions.ts">exportResults</a>(id, { ...params }) -> Response</code>
- <code title="post /extractions">client.extractions.<a href="./src/resources/extractions.ts">run</a>({ ...params }) -> ExtractionRunResponse</code>

# Draws

Types

- <code><a href="./src/resources/draws.ts">DrawDetail</a></code>
- <code><a href="./src/resources/draws.ts">DrawListItem</a></code>
- <code><a href="./src/resources/draws.ts">Winner</a></code>
- <code><a href="./src/resources/draws.ts">DrawRetrieveResponse</a></code>
- <code><a href="./src/resources/draws.ts">DrawListResponse</a></code>
- <code><a href="./src/resources/draws.ts">DrawRunResponse</a></code>

Methods

- <code title="get /draws/{id}">client.draws.<a href="./src/resources/draws.ts">retrieve</a>(id) -> DrawRetrieveResponse</code>
- <code title="get /draws">client.draws.<a href="./src/resources/draws.ts">list</a>({ ...params }) -> DrawListResponse</code>
- <code title="get /draws/{id}/export">client.draws.<a href="./src/resources/draws.ts">export</a>(id, { ...params }) -> Response</code>
- <code title="post /draws">client.draws.<a href="./src/resources/draws.ts">run</a>({ ...params }) -> DrawRunResponse</code>

# Webhooks

Types

- <code><a href="./src/resources/webhooks.ts">Delivery</a></code>
- <code><a href="./src/resources/webhooks.ts">Webhook</a></code>
- <code><a href="./src/resources/webhooks.ts">WebhookCreateResponse</a></code>
- <code><a href="./src/resources/webhooks.ts">WebhookListResponse</a></code>
- <code><a href="./src/resources/webhooks.ts">WebhookCreateTelegramLinkResponse</a></code>
- <code><a href="./src/resources/webhooks.ts">WebhookDeactivateResponse</a></code>
- <code><a href="./src/resources/webhooks.ts">WebhookListDeliveriesResponse</a></code>
- <code><a href="./src/resources/webhooks.ts">WebhookResumeResponse</a></code>
- <code><a href="./src/resources/webhooks.ts">WebhookTestResponse</a></code>

Methods

- <code title="post /webhooks">client.webhooks.<a href="./src/resources/webhooks.ts">create</a>({ ...params }) -> WebhookCreateResponse</code>
- <code title="patch /webhooks/{id}">client.webhooks.<a href="./src/resources/webhooks.ts">update</a>(id, { ...params }) -> Webhook</code>
- <code title="get /webhooks">client.webhooks.<a href="./src/resources/webhooks.ts">list</a>({ ...params }) -> WebhookListResponse</code>
- <code title="post /webhooks/telegram">client.webhooks.<a href="./src/resources/webhooks.ts">createTelegramLink</a>({ ...params }) -> WebhookCreateTelegramLinkResponse</code>
- <code title="delete /webhooks/{id}">client.webhooks.<a href="./src/resources/webhooks.ts">deactivate</a>(id) -> WebhookDeactivateResponse</code>
- <code title="get /webhooks/{id}/deliveries">client.webhooks.<a href="./src/resources/webhooks.ts">listDeliveries</a>(id, { ...params }) -> WebhookListDeliveriesResponse</code>
- <code title="post /webhooks/{id}/resume">client.webhooks.<a href="./src/resources/webhooks.ts">resume</a>(id) -> WebhookResumeResponse</code>
- <code title="post /webhooks/{id}/test">client.webhooks.<a href="./src/resources/webhooks.ts">test</a>(id) -> WebhookTestResponse</code>

# X

Types

- <code><a href="./src/resources/x/x.ts">XAutocompleteSearchResponse</a></code>
- <code><a href="./src/resources/x/x.ts">XGetArticleResponse</a></code>
- <code><a href="./src/resources/x/x.ts">XGetHashflagsResponse</a></code>
- <code><a href="./src/resources/x/x.ts">XGetNewsStoryVersionsResponse</a></code>
- <code><a href="./src/resources/x/x.ts">XGetNotificationsResponse</a></code>
- <code><a href="./src/resources/x/x.ts">XGetTrendLocationsResponse</a></code>
- <code><a href="./src/resources/x/x.ts">XGetTrendsResponse</a></code>
- <code><a href="./src/resources/x/x.ts">XGetTrendsHistoryResponse</a></code>
- <code><a href="./src/resources/x/x.ts">XSearchPlacesResponse</a></code>

Methods

- <code title="get /x/search/autocomplete">client.x.<a href="./src/resources/x/x.ts">autocompleteSearch</a>({ ...params }) -> XAutocompleteSearchResponse</code>
- <code title="get /x/articles/{tweetId}">client.x.<a href="./src/resources/x/x.ts">getArticle</a>(tweetID, { ...params }) -> XGetArticleResponse</code>
- <code title="get /x/hashflags">client.x.<a href="./src/resources/x/x.ts">getHashflags</a>({ ...params }) -> XGetHashflagsResponse</code>
- <code title="get /x/timeline">client.x.<a href="./src/resources/x/x.ts">getHomeTimeline</a>({ ...params }) -> PaginatedTweets</code>
- <code title="get /x/news/{id}/versions">client.x.<a href="./src/resources/x/x.ts">getNewsStoryVersions</a>(id, { ...params }) -> XGetNewsStoryVersionsResponse</code>
- <code title="get /x/notifications">client.x.<a href="./src/resources/x/x.ts">getNotifications</a>({ ...params }) -> XGetNotificationsResponse</code>
- <code title="get /x/trends/locations">client.x.<a href="./src/resources/x/x.ts">getTrendLocations</a>({ ...params }) -> XGetTrendLocationsResponse</code>
- <code title="get /x/trends">client.x.<a href="./src/resources/x/x.ts">getTrends</a>({ ...params }) -> XGetTrendsResponse</code>
- <code title="get /x/trends/history">client.x.<a href="./src/resources/x/x.ts">getTrendsHistory</a>({ ...params }) -> XGetTrendsHistoryResponse</code>
- <code title="get /x/places/search">client.x.<a href="./src/resources/x/x.ts">searchPlaces</a>({ ...params }) -> XSearchPlacesResponse</code>

## WriteActions

Types

- <code><a href="./src/resources/x/write-actions.ts">WriteActionRetrieveResponse</a></code>

Methods

- <code title="get /x/write-actions/{id}">client.x.writeActions.<a href="./src/resources/x/write-actions.ts">retrieve</a>(id) -> WriteActionRetrieveResponse</code>

## Analysis

Types

- <code><a href="./src/resources/x/analysis.ts">AnalysisBrandResponse</a></code>
- <code><a href="./src/resources/x/analysis.ts">AnalysisClassifyResponse</a></code>
- <code><a href="./src/resources/x/analysis.ts">AnalysisMarketSignalsResponse</a></code>
- <code><a href="./src/resources/x/analysis.ts">AnalysisNewsResponse</a></code>
- <code><a href="./src/resources/x/analysis.ts">AnalysisSentimentResponse</a></code>
- <code><a href="./src/resources/x/analysis.ts">AnalysisViralScoreResponse</a></code>

Methods

- <code title="post /x/analysis/brand">client.x.analysis.<a href="./src/resources/x/analysis.ts">brand</a>({ ...params }) -> AnalysisBrandResponse</code>
- <code title="post /x/analysis/classify">client.x.analysis.<a href="./src/resources/x/analysis.ts">classify</a>({ ...params }) -> AnalysisClassifyResponse</code>
- <code title="post /x/analysis/market-signals">client.x.analysis.<a href="./src/resources/x/analysis.ts">marketSignals</a>({ ...params }) -> AnalysisMarketSignalsResponse</code>
- <code title="post /x/analysis/news">client.x.analysis.<a href="./src/resources/x/analysis.ts">news</a>({ ...params }) -> AnalysisNewsResponse</code>
- <code title="post /x/analysis/sentiment">client.x.analysis.<a href="./src/resources/x/analysis.ts">sentiment</a>({ ...params }) -> AnalysisSentimentResponse</code>
- <code title="post /x/analysis/viral-score">client.x.analysis.<a href="./src/resources/x/analysis.ts">viralScore</a>({ ...params }) -> AnalysisViralScoreResponse</code>

## Tweets

Types

- <code><a href="./src/resources/x/tweets/tweets.ts">TweetAuthor</a></code>
- <code><a href="./src/resources/x/tweets/tweets.ts">TweetDetail</a></code>
- <code><a href="./src/resources/x/tweets/tweets.ts">TweetCreateResponse</a></code>
- <code><a href="./src/resources/x/tweets/tweets.ts">TweetRetrieveResponse</a></code>
- <code><a href="./src/resources/x/tweets/tweets.ts">TweetListResponse</a></code>
- <code><a href="./src/resources/x/tweets/tweets.ts">TweetDeleteResponse</a></code>
- <code><a href="./src/resources/x/tweets/tweets.ts">TweetCheckRepostResponse</a></code>
- <code><a href="./src/resources/x/tweets/tweets.ts">TweetEmbedResponse</a></code>
- <code><a href="./src/resources/x/tweets/tweets.ts">TweetGetInsightsResponse</a></code>
- <code><a href="./src/resources/x/tweets/tweets.ts">TweetGetRepliesResponse</a></code>
- <code><a href="./src/resources/x/tweets/tweets.ts">TweetGetRetweeterIDsResponse</a></code>
- <code><a href="./src/resources/x/tweets/tweets.ts">TweetGetSubtitlesResponse</a></code>
- <code><a href="./src/resources/x/tweets/tweets.ts">TweetResolveLinksResponse</a></code>
- <code><a href="./src/resources/x/tweets/tweets.ts">TweetSearchResponse</a></code>
- <code><a href="./src/resources/x/tweets/tweets.ts">TweetTranslateResponse</a></code>

Methods

- <code title="post /x/tweets">client.x.tweets.<a href="./src/resources/x/tweets/tweets.ts">create</a>({ ...params }) -> TweetCreateResponse</code>
- <code title="get /x/tweets/{id}">client.x.tweets.<a href="./src/resources/x/tweets/tweets.ts">retrieve</a>(id, { ...params }) -> TweetRetrieveResponse</code>
- <code title="get /x/tweets">client.x.tweets.<a href="./src/resources/x/tweets/tweets.ts">list</a>({ ...params }) -> TweetListResponse</code>
- <code title="delete /x/tweets/{id}">client.x.tweets.<a href="./src/resources/x/tweets/tweets.ts">delete</a>(id, { ...params }) -> TweetDeleteResponse</code>
- <code title="get /x/tweets/{id}/retweeters/check">client.x.tweets.<a href="./src/resources/x/tweets/tweets.ts">checkRepost</a>(id, { ...params }) -> TweetCheckRepostResponse</code>
- <code title="get /x/tweets/{id}/embed">client.x.tweets.<a href="./src/resources/x/tweets/tweets.ts">embed</a>(id, { ...params }) -> TweetEmbedResponse</code>
- <code title="get /x/tweets/{id}/favoriters">client.x.tweets.<a href="./src/resources/x/tweets/tweets.ts">getFavoriters</a>(id, { ...params }) -> PaginatedUsers</code>
- <code title="get /x/tweets/{id}/hidden-replies">client.x.tweets.<a href="./src/resources/x/tweets/tweets.ts">getHiddenReplies</a>(id, { ...params }) -> PaginatedTweets</code>
- <code title="get /x/tweets/{id}/insights">client.x.tweets.<a href="./src/resources/x/tweets/tweets.ts">getInsights</a>(id, { ...params }) -> TweetGetInsightsResponse</code>
- <code title="get /x/tweets/{id}/quotes">client.x.tweets.<a href="./src/resources/x/tweets/tweets.ts">getQuotes</a>(id, { ...params }) -> PaginatedTweets</code>
- <code title="get /x/tweets/{id}/replies">client.x.tweets.<a href="./src/resources/x/tweets/tweets.ts">getReplies</a>(id, { ...params }) -> TweetGetRepliesResponse</code>
- <code title="get /x/tweets/{id}/retweeter-ids">client.x.tweets.<a href="./src/resources/x/tweets/tweets.ts">getRetweeterIds</a>(id, { ...params }) -> TweetGetRetweeterIDsResponse</code>
- <code title="get /x/tweets/{id}/retweeters">client.x.tweets.<a href="./src/resources/x/tweets/tweets.ts">getRetweeters</a>(id, { ...params }) -> PaginatedUsers</code>
- <code title="get /x/tweets/{id}/subtitles">client.x.tweets.<a href="./src/resources/x/tweets/tweets.ts">getSubtitles</a>(id, { ...params }) -> TweetGetSubtitlesResponse</code>
- <code title="get /x/tweets/{id}/thread">client.x.tweets.<a href="./src/resources/x/tweets/tweets.ts">getThread</a>(id, { ...params }) -> PaginatedTweets</code>
- <code title="get /x/tweets/top">client.x.tweets.<a href="./src/resources/x/tweets/tweets.ts">listTop</a>({ ...params }) -> PaginatedTweets</code>
- <code title="get /x/links/resolve">client.x.tweets.<a href="./src/resources/x/tweets/tweets.ts">resolveLinks</a>({ ...params }) -> TweetResolveLinksResponse</code>
- <code title="get /x/tweets/search">client.x.tweets.<a href="./src/resources/x/tweets/tweets.ts">search</a>({ ...params }) -> TweetSearchResponse</code>
- <code title="get /x/tweets/{id}/translation">client.x.tweets.<a href="./src/resources/x/tweets/tweets.ts">translate</a>(id, { ...params }) -> TweetTranslateResponse</code>

### Like

Types

- <code><a href="./src/resources/x/tweets/like.ts">LikeCreateResponse</a></code>
- <code><a href="./src/resources/x/tweets/like.ts">LikeDeleteResponse</a></code>

Methods

- <code title="post /x/tweets/{id}/like">client.x.tweets.like.<a href="./src/resources/x/tweets/like.ts">create</a>(id, { ...params }) -> LikeCreateResponse</code>
- <code title="delete /x/tweets/{id}/like">client.x.tweets.like.<a href="./src/resources/x/tweets/like.ts">delete</a>(id, { ...params }) -> LikeDeleteResponse</code>

### Retweet

Types

- <code><a href="./src/resources/x/tweets/retweet.ts">RetweetCreateResponse</a></code>
- <code><a href="./src/resources/x/tweets/retweet.ts">RetweetDeleteResponse</a></code>

Methods

- <code title="post /x/tweets/{id}/retweet">client.x.tweets.retweet.<a href="./src/resources/x/tweets/retweet.ts">create</a>(id, { ...params }) -> RetweetCreateResponse</code>
- <code title="delete /x/tweets/{id}/retweet">client.x.tweets.retweet.<a href="./src/resources/x/tweets/retweet.ts">delete</a>(id, { ...params }) -> RetweetDeleteResponse</code>

## Users

Types

- <code><a href="./src/resources/x/users/users.ts">UserRemoveFollowerResponse</a></code>
- <code><a href="./src/resources/x/users/users.ts">UserRetrieveBatchResponse</a></code>
- <code><a href="./src/resources/x/users/users.ts">UserRetrieveBatchTweetsResponse</a></code>
- <code><a href="./src/resources/x/users/users.ts">UserRetrieveFollowerIDsResponse</a></code>
- <code><a href="./src/resources/x/users/users.ts">UserRetrieveFollowersResponse</a></code>
- <code><a href="./src/resources/x/users/users.ts">UserRetrieveFollowingResponse</a></code>
- <code><a href="./src/resources/x/users/users.ts">UserRetrieveFollowingIDsResponse</a></code>
- <code><a href="./src/resources/x/users/users.ts">UserRetrieveInsightsResponse</a></code>
- <code><a href="./src/resources/x/users/users.ts">UserRetrieveListMembershipsResponse</a></code>
- <code><a href="./src/resources/x/users/users.ts">UserRetrieveListsResponse</a></code>
- <code><a href="./src/resources/x/users/users.ts">UserRetrieveLiveResponse</a></code>
- <code><a href="./src/resources/x/users/users.ts">UserRetrieveVerifiedFollowersResponse</a></code>
- <code><a href="./src/resources/x/users/users.ts">UserTranslateBioResponse</a></code>

Methods

- <code title="get /x/users/{id}">client.x.users.<a href="./src/resources/x/users/users.ts">retrieve</a>(id, { ...params }) -> UserProfile</code>
- <code title="post /x/users/{id}/remove-follower">client.x.users.<a href="./src/resources/x/users/users.ts">removeFollower</a>(id, { ...params }) -> UserRemoveFollowerResponse</code>
- <code title="get /x/users/{id}/affiliates">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveAffiliates</a>(id, { ...params }) -> PaginatedUsers</code>
- <code title="get /x/users/{id}/articles">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveArticles</a>(id, { ...params }) -> PaginatedTweets</code>
- <code title="get /x/users/batch">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveBatch</a>({ ...params }) -> UserRetrieveBatchResponse</code>
- <code title="get /x/users/batch/tweets">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveBatchTweets</a>({ ...params }) -> UserRetrieveBatchTweetsResponse</code>
- <code title="get /x/users/{id}/follower-ids">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveFollowerIds</a>(id, { ...params }) -> UserRetrieveFollowerIDsResponse</code>
- <code title="get /x/users/{id}/followers">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveFollowers</a>(id, { ...params }) -> UserRetrieveFollowersResponse</code>
- <code title="get /x/users/{id}/followers-you-know">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveFollowersYouKnow</a>(id, { ...params }) -> PaginatedUsers</code>
- <code title="get /x/users/{id}/following">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveFollowing</a>(id, { ...params }) -> UserRetrieveFollowingResponse</code>
- <code title="get /x/users/{id}/following-ids">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveFollowingIds</a>(id, { ...params }) -> UserRetrieveFollowingIDsResponse</code>
- <code title="get /x/users/{id}/highlights">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveHighlights</a>(id, { ...params }) -> PaginatedTweets</code>
- <code title="get /x/users/{id}/insights">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveInsights</a>(id, { ...params }) -> UserRetrieveInsightsResponse</code>
- <code title="get /x/users/{id}/likes">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveLikes</a>(id, { ...params }) -> PaginatedTweets</code>
- <code title="get /x/users/{id}/list-memberships">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveListMemberships</a>(id, { ...params }) -> UserRetrieveListMembershipsResponse</code>
- <code title="get /x/users/{id}/lists">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveLists</a>(id, { ...params }) -> UserRetrieveListsResponse</code>
- <code title="get /x/users/{id}/live">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveLive</a>(id, { ...params }) -> UserRetrieveLiveResponse</code>
- <code title="get /x/users/{id}/media">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveMedia</a>(id, { ...params }) -> PaginatedTweets</code>
- <code title="get /x/users/{id}/mentions">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveMentions</a>(id, { ...params }) -> PaginatedTweets</code>
- <code title="get /x/users/{id}/replies">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveReplies</a>(id, { ...params }) -> PaginatedTweets</code>
- <code title="get /x/users/search">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveSearch</a>({ ...params }) -> PaginatedUsers</code>
- <code title="get /x/users/{id}/similar">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveSimilar</a>(id, { ...params }) -> PaginatedUsers</code>
- <code title="get /x/users/{id}/subscriptions">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveSubscriptions</a>(id, { ...params }) -> PaginatedUsers</code>
- <code title="get /x/users/{id}/tweets">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveTweets</a>(id, { ...params }) -> PaginatedTweets</code>
- <code title="get /x/users/{id}/verified-followers">client.x.users.<a href="./src/resources/x/users/users.ts">retrieveVerifiedFollowers</a>(id, { ...params }) -> UserRetrieveVerifiedFollowersResponse</code>
- <code title="get /x/users/{id}/translation">client.x.users.<a href="./src/resources/x/users/users.ts">translateBio</a>(id, { ...params }) -> UserTranslateBioResponse</code>

### Follow

Types

- <code><a href="./src/resources/x/users/follow.ts">FollowCreateResponse</a></code>
- <code><a href="./src/resources/x/users/follow.ts">FollowDeleteAllResponse</a></code>

Methods

- <code title="post /x/users/{id}/follow">client.x.users.follow.<a href="./src/resources/x/users/follow.ts">create</a>(id, { ...params }) -> FollowCreateResponse</code>
- <code title="delete /x/users/{id}/follow">client.x.users.follow.<a href="./src/resources/x/users/follow.ts">deleteAll</a>(id, { ...params }) -> FollowDeleteAllResponse</code>

## Followers

Types

- <code><a href="./src/resources/x/followers.ts">FollowerCheckResponse</a></code>

Methods

- <code title="get /x/followers/check">client.x.followers.<a href="./src/resources/x/followers.ts">check</a>({ ...params }) -> FollowerCheckResponse</code>

## Jobs

Types

- <code><a href="./src/resources/x/jobs.ts">Job</a></code>
- <code><a href="./src/resources/x/jobs.ts">JobRetrieveResponse</a></code>
- <code><a href="./src/resources/x/jobs.ts">JobListLocationsResponse</a></code>
- <code><a href="./src/resources/x/jobs.ts">JobSearchResponse</a></code>

Methods

- <code title="get /x/jobs/{id}">client.x.jobs.<a href="./src/resources/x/jobs.ts">retrieve</a>(id, { ...params }) -> JobRetrieveResponse</code>
- <code title="get /x/jobs/locations">client.x.jobs.<a href="./src/resources/x/jobs.ts">listLocations</a>({ ...params }) -> JobListLocationsResponse</code>
- <code title="get /x/jobs/search">client.x.jobs.<a href="./src/resources/x/jobs.ts">search</a>({ ...params }) -> JobSearchResponse</code>

## Dm

Types

- <code><a href="./src/resources/x/dm.ts">DmDeleteMessageResponse</a></code>
- <code><a href="./src/resources/x/dm.ts">DmRetrieveHistoryResponse</a></code>
- <code><a href="./src/resources/x/dm.ts">DmSendResponse</a></code>

Methods

- <code title="delete /x/dm/{userId}/messages/{messageId}">client.x.dm.<a href="./src/resources/x/dm.ts">deleteMessage</a>(messageID, { ...params }) -> DmDeleteMessageResponse</code>
- <code title="get /x/dm/{userId}/history">client.x.dm.<a href="./src/resources/x/dm.ts">retrieveHistory</a>(userID, { ...params }) -> DmRetrieveHistoryResponse</code>
- <code title="post /x/dm/{userId}">client.x.dm.<a href="./src/resources/x/dm.ts">send</a>(userID, { ...params }) -> DmSendResponse</code>

## Media

Types

- <code><a href="./src/resources/x/media.ts">MediaDownloadResponse</a></code>
- <code><a href="./src/resources/x/media.ts">MediaUploadResponse</a></code>

Methods

- <code title="post /x/media/download">client.x.media.<a href="./src/resources/x/media.ts">download</a>({ ...params }) -> MediaDownloadResponse</code>
- <code title="post /x/media">client.x.media.<a href="./src/resources/x/media.ts">upload</a>({ ...params }) -> MediaUploadResponse</code>

## Profile

Types

- <code><a href="./src/resources/x/profile.ts">ProfileUpdateResponse</a></code>
- <code><a href="./src/resources/x/profile.ts">ProfileUpdateAvatarResponse</a></code>
- <code><a href="./src/resources/x/profile.ts">ProfileUpdateBannerResponse</a></code>

Methods

- <code title="patch /x/profile">client.x.profile.<a href="./src/resources/x/profile.ts">update</a>({ ...params }) -> ProfileUpdateResponse</code>
- <code title="patch /x/profile/avatar">client.x.profile.<a href="./src/resources/x/profile.ts">updateAvatar</a>({ ...params }) -> ProfileUpdateAvatarResponse</code>
- <code title="patch /x/profile/banner">client.x.profile.<a href="./src/resources/x/profile.ts">updateBanner</a>({ ...params }) -> ProfileUpdateBannerResponse</code>

## Communities

Types

- <code><a href="./src/resources/x/communities/communities.ts">CommunityAnalytics</a></code>
- <code><a href="./src/resources/x/communities/communities.ts">CommunityAnalyticsMetric</a></code>
- <code><a href="./src/resources/x/communities/communities.ts">CommunityCreateResponse</a></code>
- <code><a href="./src/resources/x/communities/communities.ts">CommunityDeleteResponse</a></code>
- <code><a href="./src/resources/x/communities/communities.ts">CommunityListSuggestedResponse</a></code>
- <code><a href="./src/resources/x/communities/communities.ts">CommunityListTopicsResponse</a></code>
- <code><a href="./src/resources/x/communities/communities.ts">CommunityRetrieveInfoResponse</a></code>

Methods

- <code title="post /x/communities">client.x.communities.<a href="./src/resources/x/communities/communities.ts">create</a>({ ...params }) -> CommunityCreateResponse</code>
- <code title="delete /x/communities/{id}">client.x.communities.<a href="./src/resources/x/communities/communities.ts">delete</a>(id, { ...params }) -> CommunityDeleteResponse</code>
- <code title="get /x/communities/find">client.x.communities.<a href="./src/resources/x/communities/communities.ts">find</a>({ ...params }) -> CommunityPage</code>
- <code title="get /x/communities/popular">client.x.communities.<a href="./src/resources/x/communities/communities.ts">listPopular</a>({ ...params }) -> CommunityPage</code>
- <code title="get /x/communities/suggested">client.x.communities.<a href="./src/resources/x/communities/communities.ts">listSuggested</a>({ ...params }) -> CommunityListSuggestedResponse</code>
- <code title="get /x/communities/topics">client.x.communities.<a href="./src/resources/x/communities/communities.ts">listTopics</a>({ ...params }) -> CommunityListTopicsResponse</code>
- <code title="get /x/communities/{id}/analytics">client.x.communities.<a href="./src/resources/x/communities/communities.ts">retrieveAnalytics</a>(id, { ...params }) -> CommunityAnalytics</code>
- <code title="get /x/communities/{id}/info">client.x.communities.<a href="./src/resources/x/communities/communities.ts">retrieveInfo</a>(id, { ...params }) -> CommunityRetrieveInfoResponse</code>
- <code title="get /x/communities/{id}/members">client.x.communities.<a href="./src/resources/x/communities/communities.ts">retrieveMembers</a>(id, { ...params }) -> PaginatedUsers</code>
- <code title="get /x/communities/{id}/moderators">client.x.communities.<a href="./src/resources/x/communities/communities.ts">retrieveModerators</a>(id, { ...params }) -> PaginatedUsers</code>
- <code title="get /x/communities/search">client.x.communities.<a href="./src/resources/x/communities/communities.ts">retrieveSearch</a>({ ...params }) -> PaginatedTweets</code>
- <code title="get /x/communities/{id}/members/search">client.x.communities.<a href="./src/resources/x/communities/communities.ts">searchMembers</a>(id, { ...params }) -> PaginatedUsers</code>

Use `retrieveAnalytics` to read the latest period for one credit.
Pass `fields` to keep fields and `omit` to drop fields.
Use dots to select nested fields.
`CommunityAnalytics` requires `id`, `periodEndsAt`, and `metrics`.
`periodEndsAt` holds the period end as a UTC date-time string.
`CommunityAnalytics.Metrics` requires `likes`, `newMembers`, `posts`, `replies`, and `uniquePosters`.
Each `CommunityAnalyticsMetric` requires numeric `count` and unrounded daily `changePercent` values.

### Join

Types

- <code><a href="./src/resources/x/communities/join.ts">JoinCreateResponse</a></code>
- <code><a href="./src/resources/x/communities/join.ts">JoinDeleteAllResponse</a></code>

Methods

- <code title="post /x/communities/{id}/join">client.x.communities.join.<a href="./src/resources/x/communities/join.ts">create</a>(id, { ...params }) -> JoinCreateResponse</code>
- <code title="delete /x/communities/{id}/join">client.x.communities.join.<a href="./src/resources/x/communities/join.ts">deleteAll</a>(id, { ...params }) -> JoinDeleteAllResponse</code>

### Tweets

Methods

- <code title="get /x/communities/tweets">client.x.communities.tweets.<a href="./src/resources/x/communities/tweets.ts">list</a>({ ...params }) -> PaginatedTweets</code>
- <code title="get /x/communities/{id}/tweets">client.x.communities.tweets.<a href="./src/resources/x/communities/tweets.ts">listByCommunity</a>(id, { ...params }) -> PaginatedTweets</code>

### Media

Methods

- <code title="get /x/communities/{id}/media">client.x.communities.media.<a href="./src/resources/x/communities/media.ts">list</a>(id, { ...params }) -> PaginatedTweets</code>

## Accounts

Types

- <code><a href="./src/resources/x/accounts.ts">XAccount</a></code>
- <code><a href="./src/resources/x/accounts.ts">XAccountDetail</a></code>
- <code><a href="./src/resources/x/accounts.ts">AccountCreateResponse</a></code>
- <code><a href="./src/resources/x/accounts.ts">AccountListResponse</a></code>
- <code><a href="./src/resources/x/accounts.ts">AccountDeleteResponse</a></code>
- <code><a href="./src/resources/x/accounts.ts">AccountBulkRetryResponse</a></code>
- <code><a href="./src/resources/x/accounts.ts">AccountReauthResponse</a></code>

Methods

- <code title="post /x/accounts">client.x.accounts.<a href="./src/resources/x/accounts.ts">create</a>({ ...params }) -> AccountCreateResponse</code>
- <code title="get /x/accounts/{id}">client.x.accounts.<a href="./src/resources/x/accounts.ts">retrieve</a>(id) -> XAccountDetail</code>
- <code title="get /x/accounts">client.x.accounts.<a href="./src/resources/x/accounts.ts">list</a>({ ...params }) -> AccountListResponse</code>
- <code title="delete /x/accounts/{id}">client.x.accounts.<a href="./src/resources/x/accounts.ts">delete</a>(id) -> AccountDeleteResponse</code>
- <code title="post /x/accounts/bulk-retry">client.x.accounts.<a href="./src/resources/x/accounts.ts">bulkRetry</a>({ ...params }) -> AccountBulkRetryResponse</code>
- <code title="post /x/accounts/{id}/reauth">client.x.accounts.<a href="./src/resources/x/accounts.ts">reauth</a>(id, { ...params }) -> AccountReauthResponse</code>

## AccountConnectionChallenges

Types

- <code><a href="./src/resources/x/account-connection-challenges.ts">AccountConnectionChallengeSubmitResponse</a></code>

Methods

- <code title="post /x/account-connection-challenges/{id}/submit">client.x.accountConnectionChallenges.<a href="./src/resources/x/account-connection-challenges.ts">submit</a>(id, { ...params }) -> AccountConnectionChallengeSubmitResponse</code>

## AccountConnectionAttempts

Types

- <code><a href="./src/resources/x/account-connection-attempts.ts">AccountConnectionAttemptRetrieveResponse</a></code>

Methods

- <code title="get /x/account-connection-attempts/{id}">client.x.accountConnectionAttempts.<a href="./src/resources/x/account-connection-attempts.ts">retrieve</a>(id) -> AccountConnectionAttemptRetrieveResponse</code>

## Bookmarks

Types

- <code><a href="./src/resources/x/bookmarks.ts">BookmarkRetrieveFoldersResponse</a></code>

Methods

- <code title="get /x/bookmarks">client.x.bookmarks.<a href="./src/resources/x/bookmarks.ts">list</a>({ ...params }) -> PaginatedTweets</code>
- <code title="get /x/bookmarks/folders">client.x.bookmarks.<a href="./src/resources/x/bookmarks.ts">retrieveFolders</a>({ ...params }) -> BookmarkRetrieveFoldersResponse</code>

## Lists

Types

- <code><a href="./src/resources/x/lists.ts">ListRetrieveResponse</a></code>
- <code><a href="./src/resources/x/lists.ts">ListRetrieveFollowersResponse</a></code>
- <code><a href="./src/resources/x/lists.ts">ListRetrieveMembersResponse</a></code>
- <code><a href="./src/resources/x/lists.ts">ListRetrieveSearchResponse</a></code>

Methods

- <code title="get /x/lists/{id}">client.x.lists.<a href="./src/resources/x/lists.ts">retrieve</a>(id, { ...params }) -> ListRetrieveResponse</code>
- <code title="get /x/lists/{id}/followers">client.x.lists.<a href="./src/resources/x/lists.ts">retrieveFollowers</a>(id, { ...params }) -> ListRetrieveFollowersResponse</code>
- <code title="get /x/lists/{id}/members">client.x.lists.<a href="./src/resources/x/lists.ts">retrieveMembers</a>(id, { ...params }) -> ListRetrieveMembersResponse</code>
- <code title="get /x/lists/search">client.x.lists.<a href="./src/resources/x/lists.ts">retrieveSearch</a>({ ...params }) -> ListRetrieveSearchResponse</code>
- <code title="get /x/lists/{id}/tweets">client.x.lists.<a href="./src/resources/x/lists.ts">retrieveTweets</a>(id, { ...params }) -> PaginatedTweets</code>

## Broadcasts

Types

- <code><a href="./src/resources/x/broadcasts.ts">BroadcastRetrieveResponse</a></code>

Methods

- <code title="get /x/broadcasts/{id}">client.x.broadcasts.<a href="./src/resources/x/broadcasts.ts">retrieve</a>(id, { ...params }) -> BroadcastRetrieveResponse</code>

## CommunityNotes

Types

- <code><a href="./src/resources/x/community-notes.ts">CommunityNotesContributor</a></code>
- <code><a href="./src/resources/x/community-notes.ts">CommunityNotesRatingOutcome</a></code>
- <code><a href="./src/resources/x/community-notes.ts">PaginatedCommunityNotes</a></code>
- <code><a href="./src/resources/x/community-notes.ts">CommunityNoteListContributorDeletedNotesResponse</a></code>
- <code><a href="./src/resources/x/community-notes.ts">CommunityNoteListContributorNotesResponse</a></code>
- <code><a href="./src/resources/x/community-notes.ts">CommunityNoteRetrieveContributorResponse</a></code>

Methods

- <code title="get /x/community-notes/contributors/{alias}/deleted-notes">client.x.communityNotes.<a href="./src/resources/x/community-notes.ts">listContributorDeletedNotes</a>(alias, { ...params }) -> PaginatedCommunityNotes</code>
- <code title="get /x/community-notes/contributors/{alias}/notes">client.x.communityNotes.<a href="./src/resources/x/community-notes.ts">listContributorNotes</a>(alias, { ...params }) -> PaginatedCommunityNotes</code>
- <code title="get /x/community-notes/contributors/{alias}">client.x.communityNotes.<a href="./src/resources/x/community-notes.ts">retrieveContributor</a>(alias, { ...params }) -> CommunityNoteRetrieveContributorResponse</code>

## Spaces

Types

- <code><a href="./src/resources/x/spaces.ts">Space</a></code>
- <code><a href="./src/resources/x/spaces.ts">SpaceParticipant</a></code>
- <code><a href="./src/resources/x/spaces.ts">SpaceRetrieveResponse</a></code>
- <code><a href="./src/resources/x/spaces.ts">SpaceRetrieveReplayResponse</a></code>
- <code><a href="./src/resources/x/spaces.ts">SpaceSearchResponse</a></code>

Methods

- <code title="get /x/spaces/{id}">client.x.spaces.<a href="./src/resources/x/spaces.ts">retrieve</a>(id, { ...params }) -> SpaceRetrieveResponse</code>
- <code title="get /x/spaces/{id}/replay">client.x.spaces.<a href="./src/resources/x/spaces.ts">retrieveReplay</a>(id, { ...params }) -> SpaceRetrieveReplayResponse</code>
- <code title="get /x/spaces/search">client.x.spaces.<a href="./src/resources/x/spaces.ts">search</a>({ ...params }) -> SpaceSearchResponse</code>

# Trends

Types

- <code><a href="./src/resources/trends.ts">TrendListResponse</a></code>

Methods

- <code title="get /trends">client.trends.<a href="./src/resources/trends.ts">list</a>({ ...params }) -> TrendListResponse</code>

# Support

## Attachments

Methods

- <code title="get /support/attachments/{id}">client.support.attachments.<a href="./src/resources/support/attachments.ts">download</a>(id, { ...params }) -> Response</code>

## Tickets

Types

- <code><a href="./src/resources/support/tickets.ts">TicketCreateResponse</a></code>
- <code><a href="./src/resources/support/tickets.ts">TicketRetrieveResponse</a></code>
- <code><a href="./src/resources/support/tickets.ts">TicketUpdateResponse</a></code>
- <code><a href="./src/resources/support/tickets.ts">TicketListResponse</a></code>
- <code><a href="./src/resources/support/tickets.ts">TicketReplyResponse</a></code>

Methods

- <code title="post /support/tickets">client.support.tickets.<a href="./src/resources/support/tickets.ts">create</a>({ ...params }) -> TicketCreateResponse</code>
- <code title="get /support/tickets/{id}">client.support.tickets.<a href="./src/resources/support/tickets.ts">retrieve</a>(id) -> TicketRetrieveResponse</code>
- <code title="patch /support/tickets/{id}">client.support.tickets.<a href="./src/resources/support/tickets.ts">update</a>(id, { ...params }) -> TicketUpdateResponse</code>
- <code title="get /support/tickets">client.support.tickets.<a href="./src/resources/support/tickets.ts">list</a>({ ...params }) -> TicketListResponse</code>
- <code title="post /support/tickets/{id}/messages">client.support.tickets.<a href="./src/resources/support/tickets.ts">reply</a>(id, { ...params }) -> TicketReplyResponse</code>

# Credits

Types

- <code><a href="./src/resources/credits.ts">CreditRetrieveBalanceResponse</a></code>
- <code><a href="./src/resources/credits.ts">CreditRetrieveTopupStatusResponse</a></code>
- <code><a href="./src/resources/credits.ts">CreditTopupBalanceResponse</a></code>

Methods

- <code title="get /credits/topup/redirect">client.credits.<a href="./src/resources/credits.ts">redirectTopupCheckout</a>({ ...params }) -> void</code>
- <code title="get /credits">client.credits.<a href="./src/resources/credits.ts">retrieveBalance</a>() -> CreditRetrieveBalanceResponse</code>
- <code title="get /credits/topup/status">client.credits.<a href="./src/resources/credits.ts">retrieveTopupStatus</a>({ ...params }) -> CreditRetrieveTopupStatusResponse</code>
- <code title="post /credits/topup">client.credits.<a href="./src/resources/credits.ts">topupBalance</a>({ ...params }) -> CreditTopupBalanceResponse</code>

# GuestWallets

Types

- <code><a href="./src/resources/guest-wallets.ts">GuestWalletAmount</a></code>
- <code><a href="./src/resources/guest-wallets.ts">GuestWalletCreateResponse</a></code>
- <code><a href="./src/resources/guest-wallets.ts">GuestWalletRetrieveStatusResponse</a></code>
- <code><a href="./src/resources/guest-wallets.ts">GuestWalletTopupResponse</a></code>

Methods

- <code title="post /guest-wallets">client.guestWallets.<a href="./src/resources/guest-wallets.ts">create</a>({ ...params }) -> GuestWalletCreateResponse</code>
- <code title="get /guest-wallets/status">client.guestWallets.<a href="./src/resources/guest-wallets.ts">retrieveStatus</a>() -> GuestWalletRetrieveStatusResponse</code>
- <code title="post /guest-wallets/topups">client.guestWallets.<a href="./src/resources/guest-wallets.ts">topup</a>({ ...params }) -> GuestWalletTopupResponse</code>
