// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { type Uploadable } from '../../core/uploads';
import { RequestOptions } from '../../internal/request-options';
import { multipartFormRequestOptions } from '../../internal/uploads';

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
    return this._client.patch('/x/profile', { body, ...options });
  }

  /**
   * Update profile avatar
   *
   * @example
   * ```ts
   * const response = await client.x.profile.updateAvatar({
   *   account: '@elonmusk',
   *   file: fs.createReadStream('path/to/file'),
   * });
   * ```
   */
  updateAvatar(
    body: ProfileUpdateAvatarParams,
    options?: RequestOptions,
  ): APIPromise<ProfileUpdateAvatarResponse> {
    return this._client.patch(
      '/x/profile/avatar',
      multipartFormRequestOptions({ body, ...options }, this._client),
    );
  }

  /**
   * Update profile banner
   *
   * @example
   * ```ts
   * const response = await client.x.profile.updateBanner({
   *   account: '@elonmusk',
   *   file: fs.createReadStream('path/to/file'),
   * });
   * ```
   */
  updateBanner(
    body: ProfileUpdateBannerParams,
    options?: RequestOptions,
  ): APIPromise<ProfileUpdateBannerResponse> {
    return this._client.patch(
      '/x/profile/banner',
      multipartFormRequestOptions({ body, ...options }, this._client),
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
   * X account (@username or ID) for avatar update
   */
  account: string;

  /**
   * Avatar image (max 716KB)
   */
  file: Uploadable;
}

export interface ProfileUpdateBannerParams {
  /**
   * X account (@username or ID) for banner update
   */
  account: string;

  /**
   * Banner image (max 2MB)
   */
  file: Uploadable;
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
