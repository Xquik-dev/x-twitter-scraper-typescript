// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as PlatformLinksAPI from './platform-links';
import { PlatformLinks } from './platform-links';

export class Bot extends APIResource {
  platformLinks: PlatformLinksAPI.PlatformLinks = new PlatformLinksAPI.PlatformLinks(this._client);
}

Bot.PlatformLinks = PlatformLinks;

export declare namespace Bot {
  export { PlatformLinks as PlatformLinks };
}
