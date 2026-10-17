// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import * as AccountConnectionAttemptsAPI from './account-connection-attempts';
import {
  AccountConnectionAttemptRetrieveResponse,
  AccountConnectionAttempts,
} from './account-connection-attempts';
import * as AccountConnectionChallengesAPI from './account-connection-challenges';
import {
  AccountConnectionChallengeSubmitParams,
  AccountConnectionChallengeSubmitResponse,
  AccountConnectionChallenges,
} from './account-connection-challenges';
import * as AccountsAPI from './accounts';
import {
  AccountBulkRetryResponse,
  AccountCreateParams,
  AccountCreateResponse,
  AccountDeleteResponse,
  AccountListParams,
  AccountListResponse,
  AccountReauthParams,
  AccountReauthResponse,
  Accounts,
  XAccount,
  XAccountDetail,
} from './accounts';
import * as AnalysisAPI from './analysis';
import {
  Analysis,
  AnalysisBrandParams,
  AnalysisBrandResponse,
  AnalysisClassifyParams,
  AnalysisClassifyResponse,
  AnalysisMarketSignalsParams,
  AnalysisMarketSignalsResponse,
  AnalysisNewsParams,
  AnalysisNewsResponse,
  AnalysisSentimentParams,
  AnalysisSentimentResponse,
  AnalysisViralScoreParams,
  AnalysisViralScoreResponse,
} from './analysis';
import * as BookmarksAPI from './bookmarks';
import {
  BookmarkListParams,
  BookmarkRetrieveFoldersParams,
  BookmarkRetrieveFoldersResponse,
  Bookmarks,
} from './bookmarks';
import * as BroadcastsAPI from './broadcasts';
import { BroadcastRetrieveParams, BroadcastRetrieveResponse, Broadcasts } from './broadcasts';
import * as CommunityNotesAPI from './community-notes';
import {
  CommunityNoteListContributorDeletedNotesParams,
  CommunityNoteListContributorDeletedNotesResponse,
  CommunityNoteListContributorNotesParams,
  CommunityNoteListContributorNotesResponse,
  CommunityNoteRetrieveContributorParams,
  CommunityNoteRetrieveContributorResponse,
  CommunityNotes,
  CommunityNotesContributor,
  CommunityNotesRatingOutcome,
  PaginatedCommunityNotes,
} from './community-notes';
import * as DmAPI from './dm';
import {
  Dm,
  DmDeleteMessageParams,
  DmDeleteMessageResponse,
  DmRetrieveHistoryParams,
  DmRetrieveHistoryResponse,
  DmSendParams,
  DmSendResponse,
} from './dm';
import * as FollowersAPI from './followers';
import { FollowerCheckParams, FollowerCheckResponse, Followers } from './followers';
import * as JobsAPI from './jobs';
import {
  Job,
  JobListLocationsParams,
  JobListLocationsResponse,
  JobRetrieveParams,
  JobRetrieveResponse,
  JobSearchParams,
  JobSearchResponse,
  Jobs,
} from './jobs';
import * as ListsAPI from './lists';
import {
  ListRetrieveFollowersParams,
  ListRetrieveFollowersResponse,
  ListRetrieveMembersParams,
  ListRetrieveMembersResponse,
  ListRetrieveParams,
  ListRetrieveResponse,
  ListRetrieveSearchParams,
  ListRetrieveSearchResponse,
  ListRetrieveTweetsParams,
  Lists,
} from './lists';
import * as MediaAPI from './media';
import {
  Media,
  MediaDownloadParams,
  MediaDownloadResponse,
  MediaUploadParams,
  MediaUploadResponse,
} from './media';
import * as ProfileAPI from './profile';
import {
  Profile,
  ProfileUpdateAvatarParams,
  ProfileUpdateAvatarResponse,
  ProfileUpdateBannerParams,
  ProfileUpdateBannerResponse,
  ProfileUpdateParams,
  ProfileUpdateResponse,
} from './profile';
import * as SpacesAPI from './spaces';
import {
  Space,
  SpaceParticipant,
  SpaceRetrieveParams,
  SpaceRetrieveReplayParams,
  SpaceRetrieveReplayResponse,
  SpaceRetrieveResponse,
  SpaceSearchParams,
  SpaceSearchResponse,
  Spaces,
} from './spaces';
import * as WriteActionsAPI from './write-actions';
import { WriteActionRetrieveResponse, WriteActions } from './write-actions';
import * as CommunitiesAPI from './communities/communities';
import {
  Communities,
  CommunityCreateParams,
  CommunityCreateResponse,
  CommunityDeleteParams,
  CommunityDeleteResponse,
  CommunityFindParams,
  CommunityListPopularParams,
  CommunityListSuggestedParams,
  CommunityListSuggestedResponse,
  CommunityListTopicsParams,
  CommunityListTopicsResponse,
  CommunityRetrieveInfoParams,
  CommunityRetrieveInfoResponse,
  CommunityRetrieveMembersParams,
  CommunityRetrieveModeratorsParams,
  CommunityRetrieveSearchParams,
  CommunitySearchMembersParams,
} from './communities/communities';
import * as TweetsAPI from './tweets/tweets';
import {
  TweetAuthor,
  TweetCheckRepostParams,
  TweetCheckRepostResponse,
  TweetCreateParams,
  TweetCreateResponse,
  TweetDeleteParams,
  TweetDeleteResponse,
  TweetDetail,
  TweetEmbedParams,
  TweetEmbedResponse,
  TweetGetFavoritersParams,
  TweetGetHiddenRepliesParams,
  TweetGetInsightsParams,
  TweetGetInsightsResponse,
  TweetGetQuotesParams,
  TweetGetRepliesParams,
  TweetGetRepliesResponse,
  TweetGetRetweeterIDsParams,
  TweetGetRetweeterIDsResponse,
  TweetGetRetweetersParams,
  TweetGetSubtitlesParams,
  TweetGetSubtitlesResponse,
  TweetGetThreadParams,
  TweetListParams,
  TweetListResponse,
  TweetListTopParams,
  TweetResolveLinksParams,
  TweetResolveLinksResponse,
  TweetRetrieveParams,
  TweetRetrieveResponse,
  TweetSearchParams,
  TweetSearchResponse,
  TweetTranslateParams,
  TweetTranslateResponse,
  Tweets,
} from './tweets/tweets';
import * as UsersAPI from './users/users';
import {
  UserRemoveFollowerParams,
  UserRemoveFollowerResponse,
  UserRetrieveAffiliatesParams,
  UserRetrieveArticlesParams,
  UserRetrieveBatchParams,
  UserRetrieveBatchResponse,
  UserRetrieveBatchTweetsParams,
  UserRetrieveBatchTweetsResponse,
  UserRetrieveFollowerIDsParams,
  UserRetrieveFollowerIDsResponse,
  UserRetrieveFollowersParams,
  UserRetrieveFollowersResponse,
  UserRetrieveFollowersYouKnowParams,
  UserRetrieveFollowingIDsParams,
  UserRetrieveFollowingIDsResponse,
  UserRetrieveFollowingParams,
  UserRetrieveFollowingResponse,
  UserRetrieveHighlightsParams,
  UserRetrieveInsightsParams,
  UserRetrieveInsightsResponse,
  UserRetrieveLikesParams,
  UserRetrieveListMembershipsParams,
  UserRetrieveListMembershipsResponse,
  UserRetrieveListsParams,
  UserRetrieveListsResponse,
  UserRetrieveLiveParams,
  UserRetrieveLiveResponse,
  UserRetrieveMediaParams,
  UserRetrieveMentionsParams,
  UserRetrieveParams,
  UserRetrieveRepliesParams,
  UserRetrieveSearchParams,
  UserRetrieveSimilarParams,
  UserRetrieveSubscriptionsParams,
  UserRetrieveTweetsParams,
  UserRetrieveVerifiedFollowersParams,
  UserRetrieveVerifiedFollowersResponse,
  UserTranslateBioParams,
  UserTranslateBioResponse,
  Users,
} from './users/users';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class X extends APIResource {
  writeActions: WriteActionsAPI.WriteActions = new WriteActionsAPI.WriteActions(this._client);
  analysis: AnalysisAPI.Analysis = new AnalysisAPI.Analysis(this._client);
  tweets: TweetsAPI.Tweets = new TweetsAPI.Tweets(this._client);
  users: UsersAPI.Users = new UsersAPI.Users(this._client);
  followers: FollowersAPI.Followers = new FollowersAPI.Followers(this._client);
  jobs: JobsAPI.Jobs = new JobsAPI.Jobs(this._client);
  dm: DmAPI.Dm = new DmAPI.Dm(this._client);
  media: MediaAPI.Media = new MediaAPI.Media(this._client);
  profile: ProfileAPI.Profile = new ProfileAPI.Profile(this._client);
  communities: CommunitiesAPI.Communities = new CommunitiesAPI.Communities(this._client);
  accounts: AccountsAPI.Accounts = new AccountsAPI.Accounts(this._client);
  accountConnectionChallenges: AccountConnectionChallengesAPI.AccountConnectionChallenges =
    new AccountConnectionChallengesAPI.AccountConnectionChallenges(this._client);
  accountConnectionAttempts: AccountConnectionAttemptsAPI.AccountConnectionAttempts =
    new AccountConnectionAttemptsAPI.AccountConnectionAttempts(this._client);
  bookmarks: BookmarksAPI.Bookmarks = new BookmarksAPI.Bookmarks(this._client);
  lists: ListsAPI.Lists = new ListsAPI.Lists(this._client);
  broadcasts: BroadcastsAPI.Broadcasts = new BroadcastsAPI.Broadcasts(this._client);
  communityNotes: CommunityNotesAPI.CommunityNotes = new CommunityNotesAPI.CommunityNotes(this._client);
  spaces: SpacesAPI.Spaces = new SpacesAPI.Spaces(this._client);

  /**
   * Returns the accounts, topics, hashtags & cashtags X suggests while someone types
   * a search. X may rank them differently per request. Costs 1 credit per
   * suggestion.
   *
   * @example
   * ```ts
   * const response = await client.x.autocompleteSearch({
   *   q: 'nasa',
   * });
   * ```
   */
  autocompleteSearch(
    query: XAutocompleteSearchParams,
    options?: RequestOptions,
  ): APIPromise<XAutocompleteSearchResponse> {
    return this._client.get('/x/search/autocomplete', { query, ...options });
  }

  /**
   * Retrieve the full content of an X Article (long-form post) by numeric tweet ID.
   * Returns article_not_found when the tweet is valid but is not an X Article.
   *
   * @example
   * ```ts
   * const response = await client.x.getArticle('tweetId');
   * ```
   */
  getArticle(
    tweetID: string,
    query: XGetArticleParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<XGetArticleResponse> {
    return this._client.get(path`/x/articles/${tweetID}`, { query, ...options });
  }

  /**
   * Returns X's hashflags, the custom emoji X shows after some hashtags. Lists the
   * ones running now unless activeOnly is false. Each returned hashflag costs 1
   * credit.
   *
   * @example
   * ```ts
   * const response = await client.x.getHashflags();
   * ```
   */
  getHashflags(
    query: XGetHashflagsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<XGetHashflagsResponse> {
    return this._client.get('/x/hashflags', { query, ...options });
  }

  /**
   * Returns the home timeline of 1 of your connected X accounts, else 424
   * `account_required`. A cursor reads the next page from the same account. Results
   * exclude X ads.
   *
   * @example
   * ```ts
   * const paginatedTweets = await client.x.getHomeTimeline();
   * ```
   */
  getHomeTimeline(
    query: XGetHomeTimelineParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedTweets> {
    return this._client.get('/x/timeline', { query, ...options });
  }

  /**
   * Returns each version X wrote of 1 news story, the AI trends x.com shows under
   * Explore & News. Each version has its time, headline & text, oldest first, so you
   * can see how the story changed. X lists every version at once. Each request costs
   * 1 credit.
   *
   * @example
   * ```ts
   * const response = await client.x.getNewsStoryVersions('id');
   * ```
   */
  getNewsStoryVersions(
    id: string,
    query: XGetNewsStoryVersionsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<XGetNewsStoryVersionsResponse> {
    return this._client.get(path`/x/news/${id}/versions`, { query, ...options });
  }

  /**
   * Returns your X account's notifications, else 424 `account_required`.
   *
   * @example
   * ```ts
   * const response = await client.x.getNotifications();
   * ```
   */
  getNotifications(
    query: XGetNotificationsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<XGetNotificationsResponse> {
    return this._client.get('/x/notifications', { query, ...options });
  }

  /**
   * Returns the places X offers trends for. Pass a location's woeid to /x/trends.
   * Each returned location costs 1 credit.
   *
   * @example
   * ```ts
   * const response = await client.x.getTrendLocations();
   * ```
   */
  getTrendLocations(
    query: XGetTrendLocationsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<XGetTrendLocationsResponse> {
    return this._client.get('/x/trends/locations', { query, ...options });
  }

  /**
   * Returns X's current trends for a place you choose. Pick it by woeid, country or
   * location name. Without one, trends are worldwide. Add at to read what was
   * trending on Twitter at a past time, such as yesterday. Xquik keeps a Twitter
   * trends archive from 2026-10-13 02:20 UTC on, with 1 list per place every 5
   * minutes. Each request costs 1 credit, however many trends it returns.
   *
   * @example
   * ```ts
   * const response = await client.x.getTrends();
   * ```
   */
  getTrends(
    query: XGetTrendsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<XGetTrendsResponse> {
    return this._client.get('/x/trends', { query, ...options });
  }

  /**
   * Returns the Twitter trends archive of a place, as the lists X showed there over a
   * range of time. Use it for trending on Twitter yesterday, last week or any day
   * since 2026-10-13 02:20 UTC. Xquik stores 1 list per place every 5 minutes and
   * keeps it for 25 months. Pick the place by woeid, country or location name, the
   * range with from & to, and the step with every. from & to take a time or a span
   * back from now, such as 7d, so a schedule can read the last day on every run.
   * Each step returns the first list stored in it, with its own time. Each returned
   * list costs 1 credit, so 24 lists cost 24 credits. A step with no stored list
   * returns none and costs nothing. 1 request returns 24 lists, or up to 100 with
   * limit.
   *
   * @example
   * ```ts
   * const response = await client.x.getTrendsHistory();
   * ```
   */
  getTrendsHistory(
    query: XGetTrendsHistoryParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<XGetTrendsHistoryResponse> {
    return this._client.get('/x/trends/history', { query, ...options });
  }

  /**
   * Finds places on X by name. Pass a place's id as place to /x/tweets/search to
   * read posts tagged there. X ranks the places, so their order can differ between
   * requests. Each returned place costs 1 credit.
   *
   * @example
   * ```ts
   * const response = await client.x.searchPlaces({ q: 'q' });
   * ```
   */
  searchPlaces(query: XSearchPlacesParams, options?: RequestOptions): APIPromise<XSearchPlacesResponse> {
    return this._client.get('/x/places/search', { query, ...options });
  }
}

/**
 * What X suggests for a partial search query. Each list keeps X's order. A list is
 * empty when X suggests none of its type or types leaves it out.
 */
export interface XAutocompleteSearchResponse {
  /**
   * Suggested stocks & crypto tokens.
   */
  cashtags: Array<XAutocompleteSearchResponse.Cashtag>;

  /**
   * Suggestions returned across all 4 lists. Each costs 1 credit.
   */
  count: number;

  /**
   * Suggested hashtags.
   */
  hashtags: Array<XAutocompleteSearchResponse.Hashtag>;

  /**
   * The query you sent, trimmed.
   */
  query: string;

  /**
   * Suggested search phrases that are not hashtags.
   */
  topics: Array<XAutocompleteSearchResponse.Topic>;

  /**
   * Suggested accounts.
   */
  users: Array<XAutocompleteSearchResponse.User>;
}

export namespace XAutocompleteSearchResponse {
  /**
   * A stock or crypto token X suggests for the query.
   */
  export interface Cashtag {
    /**
     * Ticker symbol without the $.
     */
    ticker: string;

    /**
     * Logo of the token's chain. Tokens only.
     */
    chainLogoUrl?: string;

    /**
     * Token contract address. Tokens only.
     */
    contractAddress?: string;

    /**
     * Currency of price & marketCap.
     */
    currency?: string;

    /**
     * Price change over the last 24 hours, in percent.
     */
    dailyChangePercent?: number;

    /**
     * Stock exchange. Stocks only.
     */
    exchangeShortName?: string;

    /**
     * Logo image URL.
     */
    logoUrl?: string;

    /**
     * Market capitalization as decimal text.
     */
    marketCap?: string;

    /**
     * Company or token name.
     */
    name?: string;

    /**
     * Latest price as decimal text, which keeps every digit.
     */
    price?: string;

    /**
     * X's tag for the asset. $TICKER for a stock, chain:contract for a token.
     */
    smartTag?: string;
  }

  /**
   * A hashtag X suggests for the query.
   */
  export interface Hashtag {
    /**
     * Suggested hashtag, with its
     */
    hashtag: string;

    /**
     * X's inline flag for the hashtag.
     */
    inline?: boolean;

    /**
     * X's rounded relevance score for the hashtag.
     */
    score?: number;

    /**
     * Normalized text tokens X matches the hashtag by.
     */
    tokens?: Array<string>;
  }

  /**
   * A search phrase X suggests for the query.
   */
  export interface Topic {
    /**
     * Suggested search phrase.
     */
    topic: string;

    /**
     * X's inline flag for the phrase.
     */
    inline?: boolean;

    /**
     * X's rounded relevance score for the phrase.
     */
    score?: number;

    /**
     * Normalized text tokens X matches the phrase by.
     */
    tokens?: Array<string>;
  }

  /**
   * An account X suggests for the query.
   */
  export interface User {
    /**
     * X user ID.
     */
    id: string;

    /**
     * Display name.
     */
    name: string;

    /**
     * Handle without the @.
     */
    username: string;

    /**
     * Affiliation badges X shows beside the name.
     */
    badges?: Array<User.Badge>;

    /**
     * X's inline flag for the account.
     */
    inline?: boolean;

    /**
     * Whether X shows a blue verification badge.
     */
    isBlueVerified?: boolean;

    /**
     * X's flag for whether media can be generated from this account's persona.
     */
    isPersonaMediaGenable?: boolean;

    /**
     * Whether the account holds X's legacy verification.
     */
    isVerified?: boolean;

    /**
     * Public profile location text. Omitted when empty.
     */
    location?: string;

    /**
     * Avatar URL.
     */
    profilePicture?: string;

    /**
     * The same avatar at full size.
     */
    profilePictureOriginal?: string;

    /**
     * Whether the account protects its posts.
     */
    protected?: boolean;

    /**
     * X's rounded relevance score for the account.
     */
    score?: number;

    /**
     * Normalized text tokens X matches the account by.
     */
    tokens?: Array<string>;

    /**
     * Whether X shows any verification badge.
     */
    verified?: boolean;

    /**
     * Verification category, such as Government or Business. Omitted when X names
     * none.
     */
    verifiedType?: string;
  }

  export namespace User {
    /**
     * 1 affiliation badge.
     */
    export interface Badge {
      /**
       * Kind of badge.
       */
      badgeType?: string;

      /**
       * Badge image URL.
       */
      badgeUrl?: string;

      /**
       * Name of the affiliated account.
       */
      description?: string;
    }
  }
}

export interface XGetArticleResponse {
  article: XGetArticleResponse.Article;

  /**
   * Available X Article author fields.
   */
  author?: XGetArticleResponse.Author;
}

export namespace XGetArticleResponse {
  export interface Article {
    /**
     * X's ID for the Article, which differs from its post's ID
     */
    articleId?: string;

    /**
     * Article blocks as Markdown, with headings, lists, bold, italic, links, images &
     * embedded posts as their x.com URLs. Holds no HTML.
     */
    bodyMarkdown?: string;

    /**
     * Plain text joined from all article blocks
     */
    bodyText?: string;

    /**
     * Accounts that bookmarked the Article's post. 0 or more.
     */
    bookmarkCount?: number;

    contents?: Array<Article.Content>;

    coverImageUrl?: string;

    /**
     * Public metadata whose fields are defined by X.
     */
    coverMedia?: { [key: string]: unknown };

    createdAt?: string;

    /**
     * Public metadata whose fields are defined by X.
     */
    lifecycleState?: { [key: string]: unknown };

    likeCount?: number;

    /**
     * Public metadata whose fields are defined by X.
     */
    metadata?: { [key: string]: unknown };

    previewText?: string;

    quoteCount?: number;

    replyCount?: number;

    /**
     * Reposts of the Article's post. 0 or more.
     */
    retweetCount?: number;

    /**
     * X's summary of the Article, when X has one
     */
    summaryText?: string;

    title?: string;

    viewCount?: number;
  }

  export namespace Article {
    export interface Content {
      /**
       * Alt text of the image or preview image
       */
      altText?: string;

      /**
       * Caption the author wrote under a media block
       */
      caption?: string;

      /**
       * Length of a video, in milliseconds
       */
      durationMs?: number;

      /**
       * Height of the image or preview image
       */
      height?: number;

      /**
       * Inline text formatting ranges
       */
      inlineStyleRanges?: Array<Content.InlineStyleRange>;

      /**
       * Links in the block's text, with the text range each covers
       */
      links?: Array<Content.Link>;

      /**
       * What a media block holds
       */
      mediaType?: 'image' | 'video' | 'gif';

      /**
       * Image of a media block, or the preview image of a video or GIF
       */
      previewUrl?: string;

      text?: string;

      /**
       * ID of the post a tweet block embeds
       */
      tweetId?: string;

      /**
       * Block type: paragraph, header-one, header-two, header-three, header-four,
       * header-five, header-six, unordered-list-item, ordered-list-item, blockquote,
       * code-block, markdown, media, tweet, divider
       */
      type?: string;

      /**
       * Image URL of an image block. A video or GIF block lists its files in `variants`.
       */
      url?: string;

      /**
       * Files of a video or GIF block, in X's order
       */
      variants?: Array<Content.Variant>;

      /**
       * Width of the image or preview image
       */
      width?: number;
    }

    export namespace Content {
      export interface InlineStyleRange {
        length?: number;

        offset?: number;

        /**
         * X's name for the style, such as Bold or Italic
         */
        style?: string;
      }

      export interface Link {
        length?: number;

        offset?: number;

        url?: string;
      }

      export interface Variant {
        contentType: string;

        url: string;

        bitrate?: number;
      }
    }
  }

  /**
   * Available X Article author fields.
   */
  export interface Author {
    id: string;

    name: string;

    username: string;

    createdAt?: string;

    description?: string;

    /**
     * Whole number from 0.
     */
    favouritesCount?: number;

    /**
     * Whole number from 0.
     */
    followersCount?: number;

    /**
     * Whole number from 0.
     */
    followingCount?: number;

    isBlueVerified?: boolean;

    isTranslator?: boolean;

    isVerified?: boolean;

    location?: string;

    /**
     * Whole number from 0.
     */
    mediaCount?: number;

    profileBannerUrl?: string;

    profilePicture?: string;

    /**
     * The same profile picture at full size.
     */
    profilePictureOriginal?: string;

    protected?: boolean;

    /**
     * Whole number from 0.
     */
    statusesCount?: number;

    url?: string;
  }
}

export interface XGetHashflagsResponse {
  /**
   * Hashflags returned & charged.
   */
  count: number;

  hashflags: Array<XGetHashflagsResponse.Hashflag>;

  /**
   * Hashflags that match the filters, before limit.
   */
  total: number;

  /**
   * What to send instead. Present only when no hashflag matches.
   */
  message?: string;
}

export namespace XGetHashflagsResponse {
  /**
   * A custom emoji X shows after a hashtag for a set time.
   */
  export interface Hashflag {
    /**
     * Animations X plays for the hashtag, such as on a like. Often empty.
     */
    animations: Array<Hashflag.Animation>;

    /**
     * Image of the emoji.
     */
    assetUrl: string;

    /**
     * When X stops showing the emoji, in UTC.
     */
    endsAt: string;

    /**
     * Hashtag text without the hash sign. X also lists some plain phrases.
     */
    hashtag: string;

    /**
     * Whether X marks the hashflag for its hashfetti effect.
     */
    isHashfettiEnabled: boolean;

    /**
     * When X starts showing the emoji, in UTC.
     */
    startsAt: string;
  }

  export namespace Hashflag {
    export interface Animation {
      /**
       * Animation file.
       */
      assetUrl: string;

      /**
       * What plays the animation, such as Like.
       */
      context: string | null;

      /**
       * X's order among the animations of a hashtag.
       */
      priority: number | null;
    }
  }
}

export interface XGetNewsStoryVersionsResponse {
  /**
   * The story's ID, as the request named it.
   */
  id: string;

  /**
   * Versions returned.
   */
  count: number;

  versions: Array<XGetNewsStoryVersionsResponse.Version>;
}

export namespace XGetNewsStoryVersionsResponse {
  /**
   * 1 version X wrote of a news story.
   */
  export interface Version {
    /**
     * The version's ID.
     */
    id: string;

    /**
     * When X wrote the version, in UTC, from its ID.
     */
    createdAt: string;

    /**
     * The story's headline in this version.
     */
    headline: string;

    /**
     * The story's text in this version, without the time line X writes above it in
     * the reader's time zone.
     */
    text: string;
  }
}

export interface XGetNotificationsResponse {
  has_next_page: boolean;

  next_cursor: string;

  notifications: Array<XGetNotificationsResponse.Notification>;
}

export namespace XGetNotificationsResponse {
  export interface Notification {
    id: string;

    message?: string;

    timestamp?: string;

    type?: string;
  }
}

export interface XGetTrendLocationsResponse {
  /**
   * Locations returned & charged.
   */
  count: number;

  locations: Array<XGetTrendLocationsResponse.Location>;

  /**
   * Locations that match the filters, before limit.
   */
  total: number;

  /**
   * What to send instead. Present only when no location matches.
   */
  message?: string;
}

export namespace XGetTrendLocationsResponse {
  /**
   * A place X offers trends for.
   */
  export interface Location {
    /**
     * Country name. Null for Worldwide.
     */
    country: string | null;

    /**
     * 2-letter country code. Null for Worldwide.
     */
    countryCode: string | null;

    name: string;

    /**
     * WOEID of the country or region above it. Null for Worldwide.
     */
    parentWoeid: number | null;

    /**
     * X's kind of place. Town, Country, Supername for Worldwide, or Unknown.
     */
    placeType: string | null;

    /**
     * X's numeric code for the kind of place.
     */
    placeTypeCode: number | null;

    /**
     * X's legacy Yahoo GeoPlanet reference. It may not resolve.
     */
    url: string | null;

    /**
     * Location ID. Pass it as woeid to /x/trends.
     */
    woeid: number;
  }
}

export interface XGetTrendsResponse {
  count: number;

  trends: Array<XGetTrendsResponse.Trend>;

  woeid: number;

  /**
   * When Xquik read this list from X. It comes from the stored list and is never
   * estimated.
   */
  capturedAt?: string;

  /**
   * The place country or location named. Absent when woeid picked the place or the
   * request named none.
   */
  location?: XGetTrendsResponse.Location;

  /**
   * The time at asked for, as Xquik read it. A span such as 24h shows here as the
   * time it counted back to. Present only with at.
   */
  requestedAt?: string;
}

export namespace XGetTrendsResponse {
  export interface Trend {
    name: string;

    description?: string;

    /**
     * Promotion identifier from X. Null for organic trends.
     */
    promotedContent?: string | null;

    query?: string;

    rank?: number;

    /**
     * Approximate public post volume when X supplies it.
     */
    tweetVolume?: number | null;

    /**
     * X search URL for the trend.
     */
    url?: string;
  }

  /**
   * The place country or location named. Absent when woeid picked the place or the
   * request named none.
   */
  export interface Location {
    /**
     * Country name. Null for Worldwide.
     */
    country: string | null;

    /**
     * 2-letter country code. Null for Worldwide.
     */
    countryCode: string | null;

    name: string;

    /**
     * WOEID of the country or region above it. Null for Worldwide.
     */
    parentWoeid: number | null;

    /**
     * X's kind of place. Town, Country, Supername for Worldwide, or Unknown.
     */
    placeType: string | null;

    /**
     * X's numeric code for the kind of place.
     */
    placeTypeCode: number | null;

    /**
     * X's legacy Yahoo GeoPlanet reference. It may not resolve.
     */
    url: string | null;

    /**
     * Location ID. Pass it as woeid to /x/trends.
     */
    woeid: number;
  }
}

export interface XGetTrendsHistoryResponse {
  /**
   * Lists returned & charged.
   */
  count: number;

  /**
   * Start of the range as Xquik read it. A span such as 7d shows here as the time it
   * counted back to.
   */
  fromTime: string;

  /**
   * Whether the range holds more lists.
   */
  has_next_page: boolean;

  /**
   * Send it as cursor for the next lists. Empty on the last page.
   */
  next_cursor: string;

  /**
   * 1 stored list per step, oldest first. A step with no stored list is left out.
   */
  snapshots: Array<XGetTrendsHistoryResponse.Snapshot>;

  /**
   * End of the range as Xquik read it, which the range leaves out. Without to, it is
   * the time of the first request.
   */
  toTime: string;

  woeid: number;

  /**
   * The place the request named by country or location. Absent when it sent a woeid
   * or named no place.
   */
  location?: XGetTrendsHistoryResponse.Location;
}

export namespace XGetTrendsHistoryResponse {
  export interface Snapshot {
    /**
     * When Xquik read this stored list from X. Xquik never estimates it.
     */
    capturedAt: string;

    /**
     * Trends in this list.
     */
    count: number;

    trends: Array<Snapshot.Trend>;
  }

  export namespace Snapshot {
    export interface Trend {
      name: string;

      description?: string;

      /**
       * X's promotion ID of a promoted trend. Null for the others.
       */
      promotedContent?: string | null;

      query?: string;

      /**
       * The trend's place in X's list at that time.
       */
      rank?: number;

      /**
       * X's post count for the trend at that time, when X showed one.
       */
      tweetVolume?: number | null;

      /**
       * The trend's search link on X.
       */
      url?: string;
    }
  }

  /**
   * The place the request named by country or location. Absent when it sent a woeid
   * or named no place.
   */
  export interface Location {
    /**
     * Country name. Null for Worldwide.
     */
    country: string | null;

    /**
     * 2-letter country code. Null for Worldwide.
     */
    countryCode: string | null;

    name: string;

    /**
     * WOEID of the country or region above it. Null for Worldwide.
     */
    parentWoeid: number | null;

    /**
     * X's kind of place. Town, Country, Supername for Worldwide, or Unknown.
     */
    placeType: string | null;

    /**
     * X's numeric code for the kind of place.
     */
    placeTypeCode: number | null;

    /**
     * X's legacy Yahoo GeoPlanet reference. It may not resolve.
     */
    url: string | null;

    /**
     * Location ID. Pass it as woeid to /x/trends.
     */
    woeid: number;
  }
}

export interface XSearchPlacesResponse {
  /**
   * Places returned & charged.
   */
  count: number;

  places: Array<XSearchPlacesResponse.Place>;

  /**
   * Places X found, before limit.
   */
  total: number;

  /**
   * What to send instead. Present only when X finds no place.
   */
  message?: string;
}

export namespace XSearchPlacesResponse {
  /**
   * A place X found, with the larger places it lies in.
   */
  export interface Place {
    /**
     * Place ID. Pass it as place to /x/tweets/search.
     */
    id: string;

    /**
     * Extra details X attaches to some places. Often empty.
     */
    attributes: { [key: string]: unknown };

    /**
     * Outline of the place as GeoJSON. Each point holds longitude, then latitude.
     */
    boundingBox: Place.BoundingBox | null;

    /**
     * Center of the place. Longitude, then latitude.
     */
    centroid: Array<number> | null;

    /**
     * Larger places this place lies in. Often 1.
     */
    containedWithin: Array<Place.ContainedWithin>;

    /**
     * Country the place lies in.
     */
    country: string | null;

    /**
     * 2-letter code of the country the place lies in.
     */
    countryCode: string | null;

    /**
     * Name with the region or country around the place.
     */
    fullName: string | null;

    /**
     * Short name of the place.
     */
    name: string;

    /**
     * X's kind of place, such as city, admin, neighborhood, poi or country.
     */
    placeType: string | null;

    /**
     * X's own reference URL for the place.
     */
    url: string | null;
  }

  export namespace Place {
    /**
     * Outline of the place as GeoJSON. Each point holds longitude, then latitude.
     */
    export interface BoundingBox {
      /**
       * Rings of points that draw the outline.
       */
      coordinates: Array<Array<Array<number>>>;

      /**
       * GeoJSON shape of the outline.
       */
      type: string;
    }

    /**
     * A place on X, such as a city or a neighborhood.
     */
    export interface ContainedWithin {
      /**
       * Place ID. Pass it as place to /x/tweets/search.
       */
      id: string;

      /**
       * Extra details X attaches to some places. Often empty.
       */
      attributes: { [key: string]: unknown };

      /**
       * Outline of the place as GeoJSON. Each point holds longitude, then latitude.
       */
      boundingBox: ContainedWithin.BoundingBox | null;

      /**
       * Center of the place. Longitude, then latitude.
       */
      centroid: Array<number> | null;

      /**
       * Country the place lies in.
       */
      country: string | null;

      /**
       * 2-letter code of the country the place lies in.
       */
      countryCode: string | null;

      /**
       * Name with the region or country around the place.
       */
      fullName: string | null;

      /**
       * Short name of the place.
       */
      name: string;

      /**
       * X's kind of place, such as city, admin, neighborhood, poi or country.
       */
      placeType: string | null;

      /**
       * X's own reference URL for the place.
       */
      url: string | null;
    }

    export namespace ContainedWithin {
      /**
       * Outline of the place as GeoJSON. Each point holds longitude, then latitude.
       */
      export interface BoundingBox {
        /**
         * Rings of points that draw the outline.
         */
        coordinates: Array<Array<Array<number>>>;

        /**
         * GeoJSON shape of the outline.
         */
        type: string;
      }
    }
  }
}

export interface XAutocompleteSearchParams {
  /**
   * Text typed so far. Start with # for hashtags or $ for cashtags. A # query
   * returns hashtags & the accounts X suggests for it. Alias: query.
   */
  q: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Most suggestions to return: 1 to 100, default 20. Accounts fill it first, then
   * topics, hashtags & cashtags. Credits can return fewer. Aliases: pageSize, count,
   * max_results, maxItems, max_items & per_page.
   */
  limit?: number;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Comma-separated suggestion types: users, topics, hashtags or cashtags. Omit for
   * all. With only hashtags or only cashtags, the query gets its # or $ when it
   * lacks one.
   */
  types?: string;
}

export interface XGetArticleParams {
  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;
}

export interface XGetHashflagsParams {
  /**
   * Keeps hashflags that run now. Send false to add ended & upcoming ones.
   */
  activeOnly?: boolean;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Maximum hashflags to return. Omit it for every match. Credits can return fewer.
   * Aliases pageSize, count, max_results, maxItems, max_items & per_page.
   */
  limit?: number;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Text the hashtag contains, such as football. Case insensitive. A leading hash
   * sign is ignored. Alias query.
   */
  q?: string;
}

export interface XGetHomeTimelineParams {
  /**
   * Pagination cursor for collection results. Also read as next_cursor, next_token,
   * pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * Comma-separated tweet IDs to exclude from results. Empty entries are ignored.
   */
  seenTweetIds?: string;
}

export interface XGetNewsStoryVersionsParams {
  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;
}

export interface XGetNotificationsParams {
  /**
   * Pagination cursor for collection results. Also read as next_cursor, next_token,
   * pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * Notification type filter. Unrecognized values fall back to All.
   */
  type?: 'All' | 'Verified' | 'Mentions';
}

export interface XGetTrendLocationsParams {
  /**
   * Country name or 2-letter code, such as Turkey or TR. Case insensitive. Returns
   * the country & its towns.
   */
  country?: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Maximum locations to return. Omit it for every match. Credits can return fewer.
   * Aliases pageSize, count, max_results, maxItems, max_items & per_page.
   */
  limit?: number;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Kind of place. Case insensitive. X labels a few towns unknown.
   */
  placeType?: 'country' | 'town' | 'worldwide' | 'unknown';

  /**
   * Text the location name contains, such as york. Case insensitive. Alias query.
   */
  q?: string;
}

export interface XGetTrendsParams {
  /**
   * A past time, to read what was trending on Twitter then. Takes an ISO 8601 time,
   * a date such as 2026-10-13, or Unix seconds. A time without a zone reads as UTC.
   * It also takes a span back from now, as a number & s, m, h or d. So at=24h reads
   * what was trending on Twitter yesterday at this hour, on every run of a schedule.
   * The answer is the stored list nearest that time, with its own time in
   * capturedAt. History starts 2026-10-13 02:20 UTC. A time over 24 hours from every
   * stored list answers 400 at no charge.
   */
  at?: string;

  /**
   * Number of trending topics to return (1-50, default 30)
   */
  count?: number;

  /**
   * Country to read trends for, by name or 2-letter code, such as Turkey or TR. Case
   * insensitive.
   */
  country?: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Town or country to read trends for, by name, such as Istanbul. Case insensitive.
   * Add country when 2 towns share a name. /x/trends/locations lists every name.
   */
  location?: string;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Region WOEID (1=Worldwide, 23424977=US, 23424975=UK, 23424969=Turkey). Wins over
   * country & location.
   */
  woeid?: number;
}

export interface XGetTrendsHistoryParams {
  /**
   * Trends to return in each list, from 1 to 50.
   */
  count?: number;

  /**
   * Country to read trends history for, by name or 2-letter code, such as Turkey or
   * TR. Case insensitive.
   */
  country?: string;

  /**
   * The next_cursor of the page before, for the next lists. It keeps the time of the
   * first request, so a range of spans stays the same on every page.
   */
  cursor?: string;

  /**
   * Step between 2 returned lists, as a number & m, h or d, such as 15m, 1h or 1d. A
   * step under 5m returns every stored list.
   */
  every?: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Start of the range. Takes an ISO 8601 time, a date such as 2026-10-13, or Unix
   * seconds. A time without a zone reads as UTC. It also takes a span back from now,
   * as a number & s, m, h or d, so from=7d reads the last 7 days. Defaults to 24
   * hours before to. History starts 2026-10-13 02:20 UTC, and a range that begins
   * earlier returns the stored part. Alias sinceTime.
   */
  from?: string;

  /**
   * Maximum lists 1 request returns & charges. A wider range gives a next_cursor for
   * the next lists. A low credit balance can return fewer.
   */
  limit?: number;

  /**
   * Town or country to read trends history for, by name, such as Istanbul. Case
   * insensitive. Add country when 2 towns share a name. /x/trends/locations lists
   * every name.
   */
  location?: string;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * End of the range, which it leaves out. Takes the forms of from, so from=2d with
   * to=1d reads the day before the last 24 hours. Defaults to now. Alias untilTime.
   */
  to?: string;

  /**
   * WOEID of the place, such as 1 for Worldwide or 23424969 for Turkey. It wins over
   * country & location. /x/trends/locations lists every WOEID.
   */
  woeid?: number;
}

export interface XSearchPlacesParams {
  /**
   * Place name to search for, such as istanbul. Alias query.
   */
  q: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Maximum places to return. Omit it for every place X finds. Credits can return
   * fewer. Aliases pageSize, count, max_results, maxItems, max_items & per_page.
   */
  limit?: number;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;
}

X.WriteActions = WriteActions;
X.Analysis = Analysis;
X.Tweets = Tweets;
X.Users = Users;
X.Followers = Followers;
X.Jobs = Jobs;
X.Dm = Dm;
X.Media = Media;
X.Profile = Profile;
X.Communities = Communities;
X.Accounts = Accounts;
X.AccountConnectionChallenges = AccountConnectionChallenges;
X.AccountConnectionAttempts = AccountConnectionAttempts;
X.Bookmarks = Bookmarks;
X.Lists = Lists;
X.Broadcasts = Broadcasts;
X.CommunityNotes = CommunityNotes;
X.Spaces = Spaces;

export declare namespace X {
  export {
    type XAutocompleteSearchResponse as XAutocompleteSearchResponse,
    type XGetArticleResponse as XGetArticleResponse,
    type XGetHashflagsResponse as XGetHashflagsResponse,
    type XGetNewsStoryVersionsResponse as XGetNewsStoryVersionsResponse,
    type XGetNotificationsResponse as XGetNotificationsResponse,
    type XGetTrendLocationsResponse as XGetTrendLocationsResponse,
    type XGetTrendsResponse as XGetTrendsResponse,
    type XGetTrendsHistoryResponse as XGetTrendsHistoryResponse,
    type XSearchPlacesResponse as XSearchPlacesResponse,
    type XAutocompleteSearchParams as XAutocompleteSearchParams,
    type XGetArticleParams as XGetArticleParams,
    type XGetHashflagsParams as XGetHashflagsParams,
    type XGetHomeTimelineParams as XGetHomeTimelineParams,
    type XGetNewsStoryVersionsParams as XGetNewsStoryVersionsParams,
    type XGetNotificationsParams as XGetNotificationsParams,
    type XGetTrendLocationsParams as XGetTrendLocationsParams,
    type XGetTrendsParams as XGetTrendsParams,
    type XGetTrendsHistoryParams as XGetTrendsHistoryParams,
    type XSearchPlacesParams as XSearchPlacesParams,
  };

  export { WriteActions as WriteActions, type WriteActionRetrieveResponse as WriteActionRetrieveResponse };

  export {
    Analysis as Analysis,
    type AnalysisBrandResponse as AnalysisBrandResponse,
    type AnalysisClassifyResponse as AnalysisClassifyResponse,
    type AnalysisMarketSignalsResponse as AnalysisMarketSignalsResponse,
    type AnalysisNewsResponse as AnalysisNewsResponse,
    type AnalysisSentimentResponse as AnalysisSentimentResponse,
    type AnalysisViralScoreResponse as AnalysisViralScoreResponse,
    type AnalysisBrandParams as AnalysisBrandParams,
    type AnalysisClassifyParams as AnalysisClassifyParams,
    type AnalysisMarketSignalsParams as AnalysisMarketSignalsParams,
    type AnalysisNewsParams as AnalysisNewsParams,
    type AnalysisSentimentParams as AnalysisSentimentParams,
    type AnalysisViralScoreParams as AnalysisViralScoreParams,
  };

  export {
    Tweets as Tweets,
    type TweetAuthor as TweetAuthor,
    type TweetDetail as TweetDetail,
    type TweetCreateResponse as TweetCreateResponse,
    type TweetRetrieveResponse as TweetRetrieveResponse,
    type TweetListResponse as TweetListResponse,
    type TweetDeleteResponse as TweetDeleteResponse,
    type TweetCheckRepostResponse as TweetCheckRepostResponse,
    type TweetEmbedResponse as TweetEmbedResponse,
    type TweetGetInsightsResponse as TweetGetInsightsResponse,
    type TweetGetRepliesResponse as TweetGetRepliesResponse,
    type TweetGetRetweeterIDsResponse as TweetGetRetweeterIDsResponse,
    type TweetGetSubtitlesResponse as TweetGetSubtitlesResponse,
    type TweetResolveLinksResponse as TweetResolveLinksResponse,
    type TweetSearchResponse as TweetSearchResponse,
    type TweetTranslateResponse as TweetTranslateResponse,
    type TweetCreateParams as TweetCreateParams,
    type TweetRetrieveParams as TweetRetrieveParams,
    type TweetListParams as TweetListParams,
    type TweetDeleteParams as TweetDeleteParams,
    type TweetCheckRepostParams as TweetCheckRepostParams,
    type TweetEmbedParams as TweetEmbedParams,
    type TweetGetFavoritersParams as TweetGetFavoritersParams,
    type TweetGetHiddenRepliesParams as TweetGetHiddenRepliesParams,
    type TweetGetInsightsParams as TweetGetInsightsParams,
    type TweetGetQuotesParams as TweetGetQuotesParams,
    type TweetGetRepliesParams as TweetGetRepliesParams,
    type TweetGetRetweeterIDsParams as TweetGetRetweeterIDsParams,
    type TweetGetRetweetersParams as TweetGetRetweetersParams,
    type TweetGetSubtitlesParams as TweetGetSubtitlesParams,
    type TweetGetThreadParams as TweetGetThreadParams,
    type TweetListTopParams as TweetListTopParams,
    type TweetResolveLinksParams as TweetResolveLinksParams,
    type TweetSearchParams as TweetSearchParams,
    type TweetTranslateParams as TweetTranslateParams,
  };

  export {
    Users as Users,
    type UserRemoveFollowerResponse as UserRemoveFollowerResponse,
    type UserRetrieveBatchResponse as UserRetrieveBatchResponse,
    type UserRetrieveBatchTweetsResponse as UserRetrieveBatchTweetsResponse,
    type UserRetrieveFollowerIDsResponse as UserRetrieveFollowerIDsResponse,
    type UserRetrieveFollowersResponse as UserRetrieveFollowersResponse,
    type UserRetrieveFollowingResponse as UserRetrieveFollowingResponse,
    type UserRetrieveFollowingIDsResponse as UserRetrieveFollowingIDsResponse,
    type UserRetrieveInsightsResponse as UserRetrieveInsightsResponse,
    type UserRetrieveListMembershipsResponse as UserRetrieveListMembershipsResponse,
    type UserRetrieveListsResponse as UserRetrieveListsResponse,
    type UserRetrieveLiveResponse as UserRetrieveLiveResponse,
    type UserRetrieveVerifiedFollowersResponse as UserRetrieveVerifiedFollowersResponse,
    type UserTranslateBioResponse as UserTranslateBioResponse,
    type UserRetrieveParams as UserRetrieveParams,
    type UserRemoveFollowerParams as UserRemoveFollowerParams,
    type UserRetrieveAffiliatesParams as UserRetrieveAffiliatesParams,
    type UserRetrieveArticlesParams as UserRetrieveArticlesParams,
    type UserRetrieveBatchParams as UserRetrieveBatchParams,
    type UserRetrieveBatchTweetsParams as UserRetrieveBatchTweetsParams,
    type UserRetrieveFollowerIDsParams as UserRetrieveFollowerIDsParams,
    type UserRetrieveFollowersParams as UserRetrieveFollowersParams,
    type UserRetrieveFollowersYouKnowParams as UserRetrieveFollowersYouKnowParams,
    type UserRetrieveFollowingParams as UserRetrieveFollowingParams,
    type UserRetrieveFollowingIDsParams as UserRetrieveFollowingIDsParams,
    type UserRetrieveHighlightsParams as UserRetrieveHighlightsParams,
    type UserRetrieveInsightsParams as UserRetrieveInsightsParams,
    type UserRetrieveLikesParams as UserRetrieveLikesParams,
    type UserRetrieveListMembershipsParams as UserRetrieveListMembershipsParams,
    type UserRetrieveListsParams as UserRetrieveListsParams,
    type UserRetrieveLiveParams as UserRetrieveLiveParams,
    type UserRetrieveMediaParams as UserRetrieveMediaParams,
    type UserRetrieveMentionsParams as UserRetrieveMentionsParams,
    type UserRetrieveRepliesParams as UserRetrieveRepliesParams,
    type UserRetrieveSearchParams as UserRetrieveSearchParams,
    type UserRetrieveSimilarParams as UserRetrieveSimilarParams,
    type UserRetrieveSubscriptionsParams as UserRetrieveSubscriptionsParams,
    type UserRetrieveTweetsParams as UserRetrieveTweetsParams,
    type UserRetrieveVerifiedFollowersParams as UserRetrieveVerifiedFollowersParams,
    type UserTranslateBioParams as UserTranslateBioParams,
  };

  export {
    Followers as Followers,
    type FollowerCheckResponse as FollowerCheckResponse,
    type FollowerCheckParams as FollowerCheckParams,
  };

  export {
    Jobs as Jobs,
    type Job as Job,
    type JobRetrieveResponse as JobRetrieveResponse,
    type JobListLocationsResponse as JobListLocationsResponse,
    type JobSearchResponse as JobSearchResponse,
    type JobRetrieveParams as JobRetrieveParams,
    type JobListLocationsParams as JobListLocationsParams,
    type JobSearchParams as JobSearchParams,
  };

  export {
    Dm as Dm,
    type DmDeleteMessageResponse as DmDeleteMessageResponse,
    type DmRetrieveHistoryResponse as DmRetrieveHistoryResponse,
    type DmSendResponse as DmSendResponse,
    type DmDeleteMessageParams as DmDeleteMessageParams,
    type DmRetrieveHistoryParams as DmRetrieveHistoryParams,
    type DmSendParams as DmSendParams,
  };

  export {
    Media as Media,
    type MediaDownloadResponse as MediaDownloadResponse,
    type MediaUploadResponse as MediaUploadResponse,
    type MediaDownloadParams as MediaDownloadParams,
    type MediaUploadParams as MediaUploadParams,
  };

  export {
    Profile as Profile,
    type ProfileUpdateResponse as ProfileUpdateResponse,
    type ProfileUpdateAvatarResponse as ProfileUpdateAvatarResponse,
    type ProfileUpdateBannerResponse as ProfileUpdateBannerResponse,
    type ProfileUpdateParams as ProfileUpdateParams,
    type ProfileUpdateAvatarParams as ProfileUpdateAvatarParams,
    type ProfileUpdateBannerParams as ProfileUpdateBannerParams,
  };

  export {
    Communities as Communities,
    type CommunityCreateResponse as CommunityCreateResponse,
    type CommunityDeleteResponse as CommunityDeleteResponse,
    type CommunityListSuggestedResponse as CommunityListSuggestedResponse,
    type CommunityListTopicsResponse as CommunityListTopicsResponse,
    type CommunityRetrieveInfoResponse as CommunityRetrieveInfoResponse,
    type CommunityCreateParams as CommunityCreateParams,
    type CommunityDeleteParams as CommunityDeleteParams,
    type CommunityFindParams as CommunityFindParams,
    type CommunityListPopularParams as CommunityListPopularParams,
    type CommunityListSuggestedParams as CommunityListSuggestedParams,
    type CommunityListTopicsParams as CommunityListTopicsParams,
    type CommunityRetrieveInfoParams as CommunityRetrieveInfoParams,
    type CommunityRetrieveMembersParams as CommunityRetrieveMembersParams,
    type CommunityRetrieveModeratorsParams as CommunityRetrieveModeratorsParams,
    type CommunityRetrieveSearchParams as CommunityRetrieveSearchParams,
    type CommunitySearchMembersParams as CommunitySearchMembersParams,
  };

  export {
    Accounts as Accounts,
    type XAccount as XAccount,
    type XAccountDetail as XAccountDetail,
    type AccountCreateResponse as AccountCreateResponse,
    type AccountListResponse as AccountListResponse,
    type AccountDeleteResponse as AccountDeleteResponse,
    type AccountBulkRetryResponse as AccountBulkRetryResponse,
    type AccountReauthResponse as AccountReauthResponse,
    type AccountCreateParams as AccountCreateParams,
    type AccountListParams as AccountListParams,
    type AccountReauthParams as AccountReauthParams,
  };

  export {
    AccountConnectionChallenges as AccountConnectionChallenges,
    type AccountConnectionChallengeSubmitResponse as AccountConnectionChallengeSubmitResponse,
    type AccountConnectionChallengeSubmitParams as AccountConnectionChallengeSubmitParams,
  };

  export {
    AccountConnectionAttempts as AccountConnectionAttempts,
    type AccountConnectionAttemptRetrieveResponse as AccountConnectionAttemptRetrieveResponse,
  };

  export {
    Bookmarks as Bookmarks,
    type BookmarkRetrieveFoldersResponse as BookmarkRetrieveFoldersResponse,
    type BookmarkListParams as BookmarkListParams,
    type BookmarkRetrieveFoldersParams as BookmarkRetrieveFoldersParams,
  };

  export {
    Lists as Lists,
    type ListRetrieveResponse as ListRetrieveResponse,
    type ListRetrieveFollowersResponse as ListRetrieveFollowersResponse,
    type ListRetrieveMembersResponse as ListRetrieveMembersResponse,
    type ListRetrieveSearchResponse as ListRetrieveSearchResponse,
    type ListRetrieveParams as ListRetrieveParams,
    type ListRetrieveFollowersParams as ListRetrieveFollowersParams,
    type ListRetrieveMembersParams as ListRetrieveMembersParams,
    type ListRetrieveSearchParams as ListRetrieveSearchParams,
    type ListRetrieveTweetsParams as ListRetrieveTweetsParams,
  };

  export {
    Broadcasts as Broadcasts,
    type BroadcastRetrieveResponse as BroadcastRetrieveResponse,
    type BroadcastRetrieveParams as BroadcastRetrieveParams,
  };

  export {
    CommunityNotes as CommunityNotes,
    type CommunityNotesContributor as CommunityNotesContributor,
    type CommunityNotesRatingOutcome as CommunityNotesRatingOutcome,
    type PaginatedCommunityNotes as PaginatedCommunityNotes,
    type CommunityNoteListContributorDeletedNotesResponse as CommunityNoteListContributorDeletedNotesResponse,
    type CommunityNoteListContributorNotesResponse as CommunityNoteListContributorNotesResponse,
    type CommunityNoteRetrieveContributorResponse as CommunityNoteRetrieveContributorResponse,
    type CommunityNoteListContributorDeletedNotesParams as CommunityNoteListContributorDeletedNotesParams,
    type CommunityNoteListContributorNotesParams as CommunityNoteListContributorNotesParams,
    type CommunityNoteRetrieveContributorParams as CommunityNoteRetrieveContributorParams,
  };

  export {
    Spaces as Spaces,
    type Space as Space,
    type SpaceParticipant as SpaceParticipant,
    type SpaceRetrieveResponse as SpaceRetrieveResponse,
    type SpaceRetrieveReplayResponse as SpaceRetrieveReplayResponse,
    type SpaceSearchResponse as SpaceSearchResponse,
    type SpaceRetrieveParams as SpaceRetrieveParams,
    type SpaceRetrieveReplayParams as SpaceRetrieveReplayParams,
    type SpaceSearchParams as SpaceSearchParams,
  };
}
