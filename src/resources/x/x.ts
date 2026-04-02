// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as AccountsAPI from './accounts';
import {
  AccountCreateParams,
  AccountCreateResponse,
  AccountDeleteResponse,
  AccountListResponse,
  AccountReauthParams,
  AccountReauthResponse,
  AccountRetrieveResponse,
  Accounts,
  XAccount,
  XAccountDetail,
} from './accounts';
import * as BookmarksAPI from './bookmarks';
import {
  BookmarkListParams,
  BookmarkListResponse,
  BookmarkRetrieveFoldersResponse,
  Bookmarks,
} from './bookmarks';
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
  SearchTweet,
  TweetAuthor,
  TweetCreateParams,
  TweetCreateResponse,
  TweetDetail,
  TweetGetFavoritersParams,
  TweetGetFavoritersResponse,
  TweetGetQuotesParams,
  TweetGetQuotesResponse,
  TweetGetRepliesParams,
  TweetGetRepliesResponse,
  TweetGetRetweetersParams,
  TweetGetRetweetersResponse,
  TweetGetThreadParams,
  TweetGetThreadResponse,
  TweetListParams,
  TweetSearchParams,
  TweetSearchResponse,
  Tweets,
} from './tweets/tweets';
import * as UsersAPI from './users/users';
import {
  UserProfile,
  UserRetrieveBatchParams,
  UserRetrieveFollowersParams,
  UserRetrieveFollowersYouKnowParams,
  UserRetrieveFollowersYouKnowResponse,
  UserRetrieveFollowingParams,
  UserRetrieveLikesParams,
  UserRetrieveLikesResponse,
  UserRetrieveMediaParams,
  UserRetrieveMediaResponse,
  UserRetrieveMentionsParams,
  UserRetrieveSearchParams,
  UserRetrieveTweetsParams,
  UserRetrieveTweetsResponse,
  UserRetrieveVerifiedFollowersParams,
  Users,
} from './users/users';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * X data lookups (subscription required)
 */
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
   */
  getArticle(tweetID: string, options?: RequestOptions): APIPromise<XGetArticleResponse> {
    return this._client.get(path`/x/articles/${tweetID}`, options);
  }

  /**
   * Get home timeline
   */
  getHomeTimeline(
    query: XGetHomeTimelineParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<XGetHomeTimelineResponse> {
    return this._client.get('/x/timeline', { query, ...options });
  }

  /**
   * Get notifications
   */
  getNotifications(
    query: XGetNotificationsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<XGetNotificationsResponse> {
    return this._client.get('/x/notifications', { query, ...options });
  }

  /**
   * Get trending topics
   */
  getTrends(options?: RequestOptions): APIPromise<void> {
    return this._client.get('/x/trends', {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface XGetArticleResponse {
  article: XGetArticleResponse.Article;

  author?: XGetArticleResponse.Author;
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

  export interface Author {
    id: string;

    followers: number;

    username: string;

    verified: boolean;

    profilePicture?: string;
  }
}

export interface XGetHomeTimelineResponse {
  has_next_page: boolean;

  next_cursor: string;

  tweets: Array<XGetHomeTimelineResponse.Tweet>;
}

export namespace XGetHomeTimelineResponse {
  export interface Tweet {
    id: string;

    text: string;

    author?: Tweet.Author;

    bookmarkCount?: number;

    createdAt?: string;

    likeCount?: number;

    quoteCount?: number;

    replyCount?: number;

    retweetCount?: number;

    viewCount?: number;
  }

  export namespace Tweet {
    export interface Author {
      id: string;

      name: string;

      username: string;

      verified?: boolean;
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

export interface XGetHomeTimelineParams {
  /**
   * Pagination cursor from previous response
   */
  cursor?: string;

  /**
   * Comma-separated tweet IDs to exclude from results
   */
  seenTweetIds?: string;
}

export interface XGetNotificationsParams {
  /**
   * Pagination cursor from previous response
   */
  cursor?: string;

  /**
   * Notification type filter
   */
  type?: 'All' | 'Verified' | 'Mentions';
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
    type XGetHomeTimelineResponse as XGetHomeTimelineResponse,
    type XGetNotificationsResponse as XGetNotificationsResponse,
    type XGetHomeTimelineParams as XGetHomeTimelineParams,
    type XGetNotificationsParams as XGetNotificationsParams,
  };

  export {
    Tweets as Tweets,
    type SearchTweet as SearchTweet,
    type TweetAuthor as TweetAuthor,
    type TweetDetail as TweetDetail,
    type TweetCreateResponse as TweetCreateResponse,
    type TweetGetFavoritersResponse as TweetGetFavoritersResponse,
    type TweetGetQuotesResponse as TweetGetQuotesResponse,
    type TweetGetRepliesResponse as TweetGetRepliesResponse,
    type TweetGetRetweetersResponse as TweetGetRetweetersResponse,
    type TweetGetThreadResponse as TweetGetThreadResponse,
    type TweetSearchResponse as TweetSearchResponse,
    type TweetCreateParams as TweetCreateParams,
    type TweetListParams as TweetListParams,
    type TweetGetFavoritersParams as TweetGetFavoritersParams,
    type TweetGetQuotesParams as TweetGetQuotesParams,
    type TweetGetRepliesParams as TweetGetRepliesParams,
    type TweetGetRetweetersParams as TweetGetRetweetersParams,
    type TweetGetThreadParams as TweetGetThreadParams,
    type TweetSearchParams as TweetSearchParams,
  };

  export {
    Users as Users,
    type UserProfile as UserProfile,
    type UserRetrieveFollowersYouKnowResponse as UserRetrieveFollowersYouKnowResponse,
    type UserRetrieveLikesResponse as UserRetrieveLikesResponse,
    type UserRetrieveMediaResponse as UserRetrieveMediaResponse,
    type UserRetrieveTweetsResponse as UserRetrieveTweetsResponse,
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
    type AccountRetrieveResponse as AccountRetrieveResponse,
    type AccountListResponse as AccountListResponse,
    type AccountDeleteResponse as AccountDeleteResponse,
    type AccountReauthResponse as AccountReauthResponse,
    type AccountCreateParams as AccountCreateParams,
    type AccountReauthParams as AccountReauthParams,
  };

  export {
    Bookmarks as Bookmarks,
    type BookmarkListResponse as BookmarkListResponse,
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
