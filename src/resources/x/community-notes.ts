// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import * as CommunityNotesAPI from './community-notes';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * Community Notes contributors, their notes, ratings & deleted notes
 */
export class CommunityNotes extends APIResource {
  /**
   * Returns the notes a contributor deleted, newest first. X keeps each note's ID,
   * times, rating & tags. A notice replaces its text & post. Each note costs 1
   * credit. A contributor who deleted none returns an empty list, free.
   *
   * @example
   * ```ts
   * const response =
   *   await client.x.communityNotes.listContributorDeletedNotes(
   *     'alias',
   *   );
   * ```
   */
  listContributorDeletedNotes(
    alias: string,
    query: CommunityNoteListContributorDeletedNotesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PaginatedCommunityNotes> {
    return this._client.get(path`/x/community-notes/contributors/${alias}/deleted-notes`, {
      query,
      ...options,
    });
  }

  /**
   * Returns a contributor's notes, newest first, each with the post it is on.
   * Includes notes X has not rated helpful, which x.com shows under no post. Each
   * note costs 1 credit. Follow next_cursor for more.
   *
   * @example
   * ```ts
   * const response =
   *   await client.x.communityNotes.listContributorNotes('alias');
   * ```
   */
  listContributorNotes(
    alias: string,
    query: CommunityNoteListContributorNotesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PaginatedCommunityNotes> {
    return this._client.get(path`/x/community-notes/contributors/${alias}/notes`, { query, ...options });
  }

  /**
   * Returns 1 Community Notes contributor by the alias X gives them. Includes note
   * counts by rating, rating counts & the deleted notes count. Each lookup costs 1
   * credit.
   *
   * @example
   * ```ts
   * const response =
   *   await client.x.communityNotes.retrieveContributor('alias');
   * ```
   */
  retrieveContributor(
    alias: string,
    query: CommunityNoteRetrieveContributorParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<CommunityNoteRetrieveContributorResponse> {
    return this._client.get(path`/x/community-notes/contributors/${alias}`, { query, ...options });
  }
}

/**
 * A Community Notes contributor. X names contributors by an alias, never by their
 * X account. A field X leaves out is left out. Beside a note, X sends its writer
 * with only some of the counts.
 */
export interface CommunityNotesContributor {
  /**
   * The alias X gives the contributor.
   */
  alias: string;

  /**
   * Notes the contributor deleted.
   */
  deletedNotesCount?: number;

  /**
   * Whether the contributor writes notes through X's API.
   */
  isApiContributor?: boolean;

  /**
   * Whether X marks the contributor as a top writer.
   */
  isTopWriter?: boolean;

  /**
   * How many notes a contributor wrote, by X's current rating.
   */
  notesCount?: CommunityNotesContributor.NotesCount;

  /**
   * How a contributor's ratings of other notes went.
   */
  ratingsCount?: CommunityNotesContributor.RatingsCount;
}

export namespace CommunityNotesContributor {
  /**
   * How many notes a contributor wrote, by X's current rating.
   */
  export interface NotesCount {
    /**
     * Notes that need more ratings.
     */
    awaitingMoreRatings?: number;

    /**
     * Notes X rates helpful now.
     */
    currentlyRatedHelpful?: number;

    /**
     * Notes X rates not helpful now.
     */
    currentlyRatedNotHelpful?: number;

    /**
     * When X last counted the notes.
     */
    updatedAt?: string;
  }

  /**
   * How a contributor's ratings of other notes went.
   */
  export interface RatingsCount {
    /**
     * Ratings on notes that need more ratings.
     */
    awaitingMoreRatings?: number;

    /**
     * Ratings made after X rated the note.
     */
    ratedAfterDecision?: number;

    /**
     * Ratings that matched the rating X gave the note.
     */
    successful?: CommunityNotesRatingOutcome;

    /**
     * Ratings that went against the rating X gave the note.
     */
    unsuccessful?: CommunityNotesRatingOutcome;

    /**
     * When X last counted the ratings.
     */
    updatedAt?: string;
  }
}

export interface CommunityNotesRatingOutcome {
  /**
   * Ratings that called a note helpful.
   */
  helpfulCount?: number;

  /**
   * Ratings that called a note not helpful.
   */
  notHelpfulCount?: number;

  /**
   * All ratings in the group, when X sends the sum.
   */
  total?: number;
}

/**
 * 1 page of Community Notes. Follow next_cursor while the response reports more
 * pages.
 */
export interface PaginatedCommunityNotes {
  has_next_page: boolean;

  next_cursor: string;

  notes: Array<PaginatedCommunityNotes.Note>;
}

export namespace PaginatedCommunityNotes {
  /**
   * A Community Note as its writer's page lists it, with the post it is on. A deleted
   * note has no text, classification or post. A field X leaves out is left out.
   */
  export interface Note {
    /**
     * Note ID.
     */
    id: string;

    /**
     * Whether the note scores above X's bar for a possible helpful rating.
     */
    abovePcrhThreshold?: boolean;

    /**
     * Whether the rating is under appeal.
     */
    appealStatus?: string;

    /**
     * What the writer says of the post, such as MisinformedOrPotentiallyMisleading or
     * NotMisleading.
     */
    classification?: string;

    /**
     * The note's writer, with the counts X sends beside a note. GET
     * /x/community-notes/contributors/{alias} serves every count.
     */
    contributor?: CommunityNotesContributor;

    /**
     * When the contributor wrote the note.
     */
    createdAt?: string;

    /**
     * The X scoring model that set the rating.
     */
    decidedBy?: string;

    /**
     * Whether the writer deleted the note.
     */
    deleted?: boolean;

    /**
     * The link a link note is on, as X shows it.
     */
    displayUrl?: string;

    /**
     * Links, tags & accounts inside the text, by character range.
     */
    entities?: Array<Note.Entity>;

    /**
     * Whether X marks that scoring model as fully visible.
     */
    fullyVisibleModel?: boolean;

    /**
     * Why raters called the note helpful.
     */
    helpfulTags?: Array<string>;

    /**
     * Views of the note, when X shares them.
     */
    impressionCount?: number;

    /**
     * Whether the note came through X's API.
     */
    isApiAuthor?: boolean;

    /**
     * Whether the note is about the post's media. X can show such a note on other
     * posts.
     */
    isMediaNote?: boolean;

    /**
     * Whether X offers a translation of the note.
     */
    isTranslatable?: boolean;

    /**
     * Whether the note is on a link.
     */
    isUrlNote?: boolean;

    /**
     * Language code of the note.
     */
    language?: string;

    /**
     * Other posts X matched a media note to.
     */
    mediaNoteMatchCount?: number;

    /**
     * Why raters called the note not helpful.
     */
    notHelpfulTags?: Array<string>;

    /**
     * The post the note is on. Null when X no longer shows it.
     */
    post?: Shared.SearchTweet | null;

    /**
     * ID of the post the note is on.
     */
    postId?: string;

    /**
     * Why X shows no post, when X says.
     */
    postUnavailable?: Note.PostUnavailable;

    /**
     * X's current rating, such as NeedsMoreRatings, CurrentlyRatedHelpful or
     * CurrentlyRatedNotHelpful. x.com shows only helpful notes under posts.
     */
    ratingStatus?: string;

    /**
     * What the note says.
     */
    text?: string;

    /**
     * Milliseconds from the note's creation to its helpful rating.
     */
    timeToHelpfulFromNoteMs?: number;

    /**
     * Milliseconds from the post's creation to the note's helpful rating.
     */
    timeToHelpfulFromPostMs?: number;

    /**
     * X's notice in place of a deleted note.
     */
    tombstone?: string;
  }

  export namespace Note {
    /**
     * A link, tag or account inside a note's text.
     */
    export interface Entity {
      /**
       * Where it starts in the text.
       */
      fromIndex?: number;

      /**
       * What it points at.
       */
      ref?: Entity.Ref;

      /**
       * Where it ends in the text.
       */
      toIndex?: number;
    }

    export namespace Entity {
      /**
       * What it points at.
       */
      export interface Ref {
        /**
         * A mentioned account's username.
         */
        screenName?: string;

        /**
         * A hashtag's or cashtag's text.
         */
        text?: string;

        /**
         * X's kind, such as TimelineUrl.
         */
        type?: string;

        /**
         * The link.
         */
        url?: string;

        /**
         * How X opens the link, such as ExternalUrl.
         */
        urlType?: string;
      }
    }

    /**
     * Why X shows no post, when X says.
     */
    export interface PostUnavailable {
      /**
       * Why X shows no post, as X names it.
       */
      reason: string;
    }
  }
}

export type CommunityNoteListContributorDeletedNotesResponse = CommunityNotesAPI.PaginatedCommunityNotes;

export namespace CommunityNoteListContributorDeletedNotesResponse {
  export type Note = CommunityNotesAPI.PaginatedCommunityNotes.Note;

  export namespace Note {
    export type Contributor = CommunityNotesAPI.CommunityNotesContributor;

    export namespace Contributor {
      export type NotesCount = CommunityNotesAPI.CommunityNotesContributor.NotesCount;

      export type RatingsCount = CommunityNotesAPI.CommunityNotesContributor.RatingsCount;

      export namespace RatingsCount {
        export type Successful = CommunityNotesAPI.CommunityNotesRatingOutcome;

        export type Unsuccessful = CommunityNotesAPI.CommunityNotesRatingOutcome;
      }
    }

    export type Entity = CommunityNotesAPI.PaginatedCommunityNotes.Note.Entity;

    export namespace Entity {
      export type Ref = CommunityNotesAPI.PaginatedCommunityNotes.Note.Entity.Ref;
    }

    export type PostUnavailable = CommunityNotesAPI.PaginatedCommunityNotes.Note.PostUnavailable;
  }
}

export type CommunityNoteListContributorNotesResponse = CommunityNotesAPI.PaginatedCommunityNotes;

export namespace CommunityNoteListContributorNotesResponse {
  export type Note = CommunityNotesAPI.PaginatedCommunityNotes.Note;

  export namespace Note {
    export type Contributor = CommunityNotesAPI.CommunityNotesContributor;

    export namespace Contributor {
      export type NotesCount = CommunityNotesAPI.CommunityNotesContributor.NotesCount;

      export type RatingsCount = CommunityNotesAPI.CommunityNotesContributor.RatingsCount;

      export namespace RatingsCount {
        export type Successful = CommunityNotesAPI.CommunityNotesRatingOutcome;

        export type Unsuccessful = CommunityNotesAPI.CommunityNotesRatingOutcome;
      }
    }

    export type Entity = CommunityNotesAPI.PaginatedCommunityNotes.Note.Entity;

    export namespace Entity {
      export type Ref = CommunityNotesAPI.PaginatedCommunityNotes.Note.Entity.Ref;
    }

    export type PostUnavailable = CommunityNotesAPI.PaginatedCommunityNotes.Note.PostUnavailable;
  }
}

export interface CommunityNoteRetrieveContributorResponse {
  /**
   * A Community Notes contributor. X names contributors by an alias, never by their
   * X account. A field X leaves out is left out. Beside a note, X sends its writer
   * with only some of the counts.
   */
  contributor: CommunityNotesContributor;
}

export namespace CommunityNoteRetrieveContributorResponse {
  export type Contributor = CommunityNotesAPI.CommunityNotesContributor;

  export namespace Contributor {
    export type NotesCount = CommunityNotesAPI.CommunityNotesContributor.NotesCount;

    export type RatingsCount = CommunityNotesAPI.CommunityNotesContributor.RatingsCount;

    export namespace RatingsCount {
      export type Successful = CommunityNotesAPI.CommunityNotesRatingOutcome;

      export type Unsuccessful = CommunityNotesAPI.CommunityNotesRatingOutcome;
    }
  }
}

export interface CommunityNoteListContributorDeletedNotesParams {
  /**
   * Pagination cursor for collection results. Also read as next_cursor, next_token,
   * pagination_token or continuation_token.
   */
  cursor?: string;

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

  /**
   * Notes per page (1-10, default 10). A low credit balance can return fewer. Follow
   * next_cursor for more pages. Also read as limit, count, max_results, maxItems,
   * max_items & per_page.
   */
  pageSize?: number;
}

export interface CommunityNoteListContributorNotesParams {
  /**
   * Pagination cursor for collection results. Also read as next_cursor, next_token,
   * pagination_token or continuation_token.
   */
  cursor?: string;

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

  /**
   * Notes per page (1-10, default 10). A low credit balance can return fewer. Follow
   * next_cursor for more pages. Also read as limit, count, max_results, maxItems,
   * max_items & per_page.
   */
  pageSize?: number;
}

export interface CommunityNoteRetrieveContributorParams {
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

export declare namespace CommunityNotes {
  export {
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
}
