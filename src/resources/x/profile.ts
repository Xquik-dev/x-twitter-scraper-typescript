// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { maybeMultipartFormRequestOptions } from '../../internal/uploads';

/**
 * X write actions (tweets, likes, follows, DMs)
 */
export class Profile extends APIResource {
  /**
   * Update X profile
   *
   * @example
   * ```ts
   * const profile = await client.x.profile.update({
   *   account: '@elonmusk',
   *   description: 'description_value',
   *   location: 'location_value',
   *   name: 'Example Name',
   *   url: 'https://xquik.com/example',
   * });
   * ```
   */
  update(body: ProfileUpdateParams, options?: RequestOptions): APIPromise<ProfileUpdateResponse> {
    return this._client.patch('/x/profile', {
      body,
      ...options,
      __security: { apiKeyAuth: true, oauthBearerAuth: true },
    });
  }

  /**
   * Update profile avatar
   *
   * @example
   * ```ts
   * const response = await client.x.profile.updateAvatar({
   *   account: '@elonmusk',
   *   url: 'https://example.com/avatar.png',
   * });
   * ```
   */
  updateAvatar(
    body: ProfileUpdateAvatarParams,
    options?: RequestOptions,
  ): APIPromise<ProfileUpdateAvatarResponse> {
    return this._client.patch(
      '/x/profile/avatar',
      maybeMultipartFormRequestOptions(
        { body, ...options, __security: { apiKeyAuth: true, oauthBearerAuth: true } },
        this._client,
      ),
    );
  }

  /**
   * Update profile banner
   *
   * @example
   * ```ts
   * const response = await client.x.profile.updateBanner({
   *   account: '@elonmusk',
   *   url: 'https://example.com/banner.png',
   * });
   * ```
   */
  updateBanner(
    body: ProfileUpdateBannerParams,
    options?: RequestOptions,
  ): APIPromise<ProfileUpdateBannerResponse> {
    return this._client.patch(
      '/x/profile/banner',
      maybeMultipartFormRequestOptions(
        { body, ...options, __security: { apiKeyAuth: true, oauthBearerAuth: true } },
        this._client,
      ),
    );
  }
}

export interface ProfileUpdateResponse {
  success: true;
}

export interface ProfileUpdateAvatarResponse {
  success: true;
}

export interface ProfileUpdateBannerResponse {
  success: true;
}

export interface ProfileUpdateParams {
  /**
   * X account (@username or ID) to update profile
   */
  account: string;

  /**
   * Bio description
   */
  description?: string;

  location?: string;

  /**
   * Display name
   */
  name?: string;

  /**
   * Website URL
   */
  url?: string;
}

export interface ProfileUpdateAvatarParams {
  /**
   * X account (@username or ID) receiving avatar from URL
   */
  account: string;

  /**
   * HTTPS URL to the avatar image to download
   */
  url: string;
}

export interface ProfileUpdateBannerParams {
  /**
   * X account (@username or ID) receiving banner from URL
   */
  account: string;

  /**
   * HTTPS URL to the banner image to download
   */
  url: string;
}

export declare namespace Profile {
  export {
    type ProfileUpdateResponse as ProfileUpdateResponse,
    type ProfileUpdateAvatarResponse as ProfileUpdateAvatarResponse,
    type ProfileUpdateBannerResponse as ProfileUpdateBannerResponse,
    type ProfileUpdateParams as ProfileUpdateParams,
    type ProfileUpdateAvatarParams as ProfileUpdateAvatarParams,
    type ProfileUpdateBannerParams as ProfileUpdateBannerParams,
  };
}
