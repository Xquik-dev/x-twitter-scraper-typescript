// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import * as AccountsAPI from './accounts';
import {
  AccountBulkRetryResponse,
  AccountCreateParams,
  AccountCreateResponse,
  AccountDeleteResponse,
  AccountListResponse,
  AccountReauthParams,
  AccountReauthResponse,
  Accounts,
  XAccount,
  XAccountDetail,
} from './accounts';
import * as BookmarksAPI from './bookmarks';
import { BookmarkListParams, BookmarkRetrieveFoldersResponse, Bookmarks } from './bookmarks';
import * as DmAPI from './dm';
import { Dm, DmRetrieveHistoryParams, DmRetrieveHistoryResponse, DmSendParams, DmSendResponse } from './dm';
import * as FollowersAPI from './followers';
import { FollowerCheckParams, FollowerCheckResponse, Followers } from './followers';
import * as ListsAPI from './lists';
import {
  ListRetrieveFollowersParams,
  ListRetrieveMembersParams,
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
import * as CommunitiesAPI from './communities/communities';
import {
  Communities,
  CommunityActionResult,
  CommunityCreateParams,
  CommunityCreateResponse,
  CommunityDeleteParams,
  CommunityDeleteResponse,
  CommunityRetrieveInfoResponse,
  CommunityRetrieveMembersParams,
  CommunityRetrieveModeratorsParams,
  CommunityRetrieveSearchParams,
} from './communities/communities';
import * as TweetsAPI from './tweets/tweets';
import {
  TweetAuthor,
  TweetCreateParams,
  TweetCreateResponse,
  TweetDeleteParams,
  TweetDeleteResponse,
  TweetDetail,
  TweetGetFavoritersParams,
  TweetGetQuotesParams,
  TweetGetRepliesParams,
  TweetGetRetweetersParams,
  TweetGetThreadParams,
  TweetListParams,
  TweetRetrieveResponse,
  TweetSearchParams,
  Tweets,
} from './tweets/tweets';
import * as UsersAPI from './users/users';
import {
  UserRetrieveBatchParams,
  UserRetrieveFollowersParams,
  UserRetrieveFollowersYouKnowParams,
  UserRetrieveFollowingParams,
  UserRetrieveLikesParams,
  UserRetrieveMediaParams,
  UserRetrieveMentionsParams,
  UserRetrieveSearchParams,
  UserRetrieveTweetsParams,
  UserRetrieveVerifiedFollowersParams,
  Users,
} from './users/users';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class X extends APIResource {
  tweets: TweetsAPI.Tweets = new TweetsAPI.Tweets(this._client);
  users: UsersAPI.Users = new UsersAPI.Users(this._client);
  followers: FollowersAPI.Followers = new FollowersAPI.Followers(this._client);
  dm: DmAPI.Dm = new DmAPI.Dm(this._client);
  media: MediaAPI.Media = new MediaAPI.Media(this._client);
  profile: ProfileAPI.Profile = new ProfileAPI.Profile(this._client);
  communities: CommunitiesAPI.Communities = new CommunitiesAPI.Communities(this._client);
  accounts: AccountsAPI.Accounts = new AccountsAPI.Accounts(this._client);
  bookmarks: BookmarksAPI.Bookmarks = new BookmarksAPI.Bookmarks(this._client);
  lists: ListsAPI.Lists = new ListsAPI.Lists(this._client);

  /**
   * Retrieve the full content of an X Article (long-form post) by tweet ID.
   *
   * @example
   * ```ts
   * const response = await client.x.getArticle('tweetId');
   * ```
   */
  getArticle(tweetID: string, options?: RequestOptions): APIPromise<XGetArticleResponse> {
    return this._client.get(path`/x/articles/${tweetID}`, options);
  }

  /**
   * Get home timeline
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
   * Get notifications
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
   * Get trending hashtags & topics from X by region
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
}

export interface XGetArticleResponse {
  article: XGetArticleResponse.Article;

  /**
   * Author of a tweet with follower count and verification status.
   */
  author?: TweetsAPI.TweetAuthor;
}

export namespace XGetArticleResponse {
  export interface Article {
    contents?: Array<Article.Content>;

    coverImageUrl?: string;

    createdAt?: string;

    likeCount?: number;

    previewText?: string;

    quoteCount?: number;

    replyCount?: number;

    title?: string;

    viewCount?: number;
  }

  export namespace Article {
    export interface Content {
      height?: number;

      text?: string;

      /**
       * Block type: unstyled, header-one, header-two, header-three, unordered-list-item,
       * ordered-list-item, image, gif, divider
       */
      type?: string;

      /**
       * Media URL for image/gif blocks
       */
      url?: string;

      width?: number;
    }
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

export interface XGetTrendsResponse {
  count: number;

  trends: Array<XGetTrendsResponse.Trend>;

  woeid: number;
}

export namespace XGetTrendsResponse {
  export interface Trend {
    name: string;

    description?: string;

    query?: string;

    rank?: number;
  }
}

export interface XGetHomeTimelineParams {
  /**
   * Pagination cursor for timeline
   */
  cursor?: string;

  /**
   * Comma-separated tweet IDs to exclude from results
   */
  seenTweetIds?: string;
}

export interface XGetNotificationsParams {
  /**
   * Pagination cursor for notifications
   */
  cursor?: string;

  /**
   * Notification type filter
   */
  type?: 'All' | 'Verified' | 'Mentions';
}

export interface XGetTrendsParams {
  /**
   * Number of trending topics to return (1-50, default 30)
   */
  count?: number;

  /**
   * Region WOEID (1=Worldwide, 23424977=US, 23424975=UK, 23424969=Turkey)
   */
  woeid?: number;
}

X.Tweets = Tweets;
X.Users = Users;
X.Followers = Followers;
X.Dm = Dm;
X.Media = Media;
X.Profile = Profile;
X.Communities = Communities;
X.Accounts = Accounts;
X.Bookmarks = Bookmarks;
X.Lists = Lists;

export declare namespace X {
  export {
    type XGetArticleResponse as XGetArticleResponse,
    type XGetNotificationsResponse as XGetNotificationsResponse,
    type XGetTrendsResponse as XGetTrendsResponse,
    type XGetHomeTimelineParams as XGetHomeTimelineParams,
    type XGetNotificationsParams as XGetNotificationsParams,
    type XGetTrendsParams as XGetTrendsParams,
  };

  export {
    Tweets as Tweets,
    type TweetAuthor as TweetAuthor,
    type TweetDetail as TweetDetail,
    type TweetCreateResponse as TweetCreateResponse,
    type TweetRetrieveResponse as TweetRetrieveResponse,
    type TweetDeleteResponse as TweetDeleteResponse,
    type TweetCreateParams as TweetCreateParams,
    type TweetListParams as TweetListParams,
    type TweetDeleteParams as TweetDeleteParams,
    type TweetGetFavoritersParams as TweetGetFavoritersParams,
    type TweetGetQuotesParams as TweetGetQuotesParams,
    type TweetGetRepliesParams as TweetGetRepliesParams,
    type TweetGetRetweetersParams as TweetGetRetweetersParams,
    type TweetGetThreadParams as TweetGetThreadParams,
    type TweetSearchParams as TweetSearchParams,
  };

  export {
    Users as Users,
    type UserRetrieveBatchParams as UserRetrieveBatchParams,
    type UserRetrieveFollowersParams as UserRetrieveFollowersParams,
    type UserRetrieveFollowersYouKnowParams as UserRetrieveFollowersYouKnowParams,
    type UserRetrieveFollowingParams as UserRetrieveFollowingParams,
    type UserRetrieveLikesParams as UserRetrieveLikesParams,
    type UserRetrieveMediaParams as UserRetrieveMediaParams,
    type UserRetrieveMentionsParams as UserRetrieveMentionsParams,
    type UserRetrieveSearchParams as UserRetrieveSearchParams,
    type UserRetrieveTweetsParams as UserRetrieveTweetsParams,
    type UserRetrieveVerifiedFollowersParams as UserRetrieveVerifiedFollowersParams,
  };

  export {
    Followers as Followers,
    type FollowerCheckResponse as FollowerCheckResponse,
    type FollowerCheckParams as FollowerCheckParams,
  };

  export {
    Dm as Dm,
    type DmRetrieveHistoryResponse as DmRetrieveHistoryResponse,
    type DmSendResponse as DmSendResponse,
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
    type CommunityActionResult as CommunityActionResult,
    type CommunityCreateResponse as CommunityCreateResponse,
    type CommunityDeleteResponse as CommunityDeleteResponse,
    type CommunityRetrieveInfoResponse as CommunityRetrieveInfoResponse,
    type CommunityCreateParams as CommunityCreateParams,
    type CommunityDeleteParams as CommunityDeleteParams,
    type CommunityRetrieveMembersParams as CommunityRetrieveMembersParams,
    type CommunityRetrieveModeratorsParams as CommunityRetrieveModeratorsParams,
    type CommunityRetrieveSearchParams as CommunityRetrieveSearchParams,
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
    type AccountReauthParams as AccountReauthParams,
  };

  export {
    Bookmarks as Bookmarks,
    type BookmarkRetrieveFoldersResponse as BookmarkRetrieveFoldersResponse,
    type BookmarkListParams as BookmarkListParams,
  };

  export {
    Lists as Lists,
    type ListRetrieveFollowersParams as ListRetrieveFollowersParams,
    type ListRetrieveMembersParams as ListRetrieveMembersParams,
    type ListRetrieveTweetsParams as ListRetrieveTweetsParams,
  };
}
