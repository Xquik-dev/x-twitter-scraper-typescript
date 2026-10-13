// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * Public X job listings, search and details
 */
export class Jobs extends APIResource {
  /**
   * Returns a public job listing with its description as text & Markdown, work type,
   * seniority, salary, company & apply link. A job that closed returns job_not_found
   * & is free.
   *
   * @example
   * ```ts
   * const job = await client.x.jobs.retrieve(
   *   '1899202395210649861',
   * );
   * ```
   */
  retrieve(
    id: string,
    query: JobRetrieveParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<JobRetrieveResponse> {
    return this._client.get(path`/x/jobs/${id}`, { query, ...options });
  }

  /**
   * Returns the places whose names match a query, each with the location ID that GET
   * /x/jobs/search takes. No match returns an empty list, free.
   *
   * @example
   * ```ts
   * const response = await client.x.jobs.listLocations({
   *   q: 'new york',
   * });
   * ```
   */
  listLocations(
    query: JobListLocationsParams,
    options?: RequestOptions,
  ): APIPromise<JobListLocationsResponse> {
    return this._client.get('/x/jobs/locations', { query, ...options });
  }

  /**
   * Returns job listings with title, location, salary, company & apply link. Add
   * filters to narrow them. A job that closed is left out & free. Follow next_cursor
   * for more.
   *
   * @example
   * ```ts
   * const response = await client.x.jobs.search({
   *   q: 'engineer',
   * });
   * ```
   */
  search(query: JobSearchParams, options?: RequestOptions): APIPromise<JobSearchResponse> {
    return this._client.get('/x/jobs/search', { query, ...options });
  }
}

export interface JobRetrieveResponse {
  /**
   * Public X job listing. A search returns the fields down to the salary, plus
   * company & account. A lookup adds work type, seniority, function, team &
   * descriptions. A field X leaves empty is left out.
   */
  job: JobRetrieveResponse.Job;
}

export namespace JobRetrieveResponse {
  /**
   * Public X job listing. A search returns the fields down to the salary, plus
   * company & account. A lookup adds work type, seniority, function, team &
   * descriptions. A field X leaves empty is left out.
   */
  export interface Job {
    /**
     * Job ID.
     */
    id: string;

    /**
     * The job page on X.
     */
    url: string;

    /**
     * The X account that posted a job. A job has none when X imported it from a job
     * board or no longer shows the account.
     */
    account?: Job.Account;

    /**
     * Where applicants apply, off X.
     */
    applyUrl?: string;

    /**
     * The company profile of a job X imported from a job board.
     */
    company?: Job.Company;

    /**
     * Full description as plain text, 1 line per paragraph.
     */
    description?: string;

    /**
     * Full description as Markdown, with headings, lists, links, bold & italics.
     */
    descriptionMarkdown?: string;

    /**
     * Contract type (full_time, full_time_contract, part_time or contract_to_hire).
     */
    employmentType?: string;

    /**
     * Whether X features the job.
     */
    featured?: boolean;

    /**
     * Salary as X shows it.
     */
    formattedSalary?: string;

    /**
     * Job function, such as software_engineering.
     */
    jobFunction?: string;

    /**
     * Location as the employer wrote it.
     */
    location?: string;

    /**
     * Where the work happens (onsite, remote or hybrid).
     */
    locationType?: string;

    /**
     * When the employer posted the job.
     */
    postedAt?: string;

    /**
     * ISO 4217 currency code of the salary.
     */
    salaryCurrencyCode?: string;

    /**
     * Pay period of the salary (annually or hourly).
     */
    salaryInterval?: string;

    /**
     * Highest salary, in salaryCurrencyCode per salaryInterval.
     */
    salaryMax?: number;

    /**
     * Lowest salary, in salaryCurrencyCode per salaryInterval.
     */
    salaryMin?: number;

    /**
     * Seniority (intern, entry_level, junior, mid_level, senior, lead, manager or
     * executive).
     */
    seniorityLevel?: string;

    /**
     * Short summary of the job, as plain text.
     */
    shortDescription?: string;

    /**
     * Team inside the company.
     */
    team?: string;

    /**
     * Job title.
     */
    title?: string;
  }

  export namespace Job {
    /**
     * The X account that posted a job. A job has none when X imported it from a job
     * board or no longer shows the account.
     */
    export interface Account {
      /**
       * X user ID of the account.
       */
      id: string;

      /**
       * Whether X shows a verification badge on the account.
       */
      verified: boolean;

      /**
       * Bio of the account. A job lookup returns it.
       */
      description?: string;

      /**
       * Display name of the account that posted the job.
       */
      name?: string;

      /**
       * Avatar shape, such as Circle or Square.
       */
      profileImageShape?: string;

      /**
       * Avatar URL of the account that posted the job.
       */
      profilePicture?: string;

      /**
       * Handle without @.
       */
      username?: string;

      /**
       * Badge type, such as Business or Government.
       */
      verifiedType?: string;
    }

    /**
     * The company profile of a job X imported from a job board.
     */
    export interface Company {
      /**
       * X company profile ID.
       */
      id: string;

      /**
       * Company logo URL.
       */
      logoUrl?: string;

      /**
       * Company name.
       */
      name?: string;
    }
  }
}

/**
 * The places whose names match a query.
 */
export interface JobListLocationsResponse {
  /**
   * Places returned, each charged 1 credit.
   */
  count: number;

  /**
   * Matching places, best match first.
   */
  locations: Array<JobListLocationsResponse.Location>;
}

export namespace JobListLocationsResponse {
  /**
   * A place a job search can name by its ID.
   */
  export interface Location {
    /**
     * Location ID, which the job search locationId takes.
     */
    id: string;

    /**
     * Place name with its region or country code.
     */
    name: string;
  }
}

/**
 * One page of job listings. Follow next_cursor while the response reports more
 * pages.
 */
export interface JobSearchResponse {
  has_next_page: boolean;

  jobs: Array<JobSearchResponse.Job>;

  next_cursor: string;
}

export namespace JobSearchResponse {
  /**
   * Public X job listing. A search returns the fields down to the salary, plus
   * company & account. A lookup adds work type, seniority, function, team &
   * descriptions. A field X leaves empty is left out.
   */
  export interface Job {
    /**
     * Job ID.
     */
    id: string;

    /**
     * The job page on X.
     */
    url: string;

    /**
     * The X account that posted a job. A job has none when X imported it from a job
     * board or no longer shows the account.
     */
    account?: Job.Account;

    /**
     * Where applicants apply, off X.
     */
    applyUrl?: string;

    /**
     * The company profile of a job X imported from a job board.
     */
    company?: Job.Company;

    /**
     * Full description as plain text, 1 line per paragraph.
     */
    description?: string;

    /**
     * Full description as Markdown, with headings, lists, links, bold & italics.
     */
    descriptionMarkdown?: string;

    /**
     * Contract type (full_time, full_time_contract, part_time or contract_to_hire).
     */
    employmentType?: string;

    /**
     * Whether X features the job.
     */
    featured?: boolean;

    /**
     * Salary as X shows it.
     */
    formattedSalary?: string;

    /**
     * Job function, such as software_engineering.
     */
    jobFunction?: string;

    /**
     * Location as the employer wrote it.
     */
    location?: string;

    /**
     * Where the work happens (onsite, remote or hybrid).
     */
    locationType?: string;

    /**
     * When the employer posted the job.
     */
    postedAt?: string;

    /**
     * ISO 4217 currency code of the salary.
     */
    salaryCurrencyCode?: string;

    /**
     * Pay period of the salary (annually or hourly).
     */
    salaryInterval?: string;

    /**
     * Highest salary, in salaryCurrencyCode per salaryInterval.
     */
    salaryMax?: number;

    /**
     * Lowest salary, in salaryCurrencyCode per salaryInterval.
     */
    salaryMin?: number;

    /**
     * Seniority (intern, entry_level, junior, mid_level, senior, lead, manager or
     * executive).
     */
    seniorityLevel?: string;

    /**
     * Short summary of the job, as plain text.
     */
    shortDescription?: string;

    /**
     * Team inside the company.
     */
    team?: string;

    /**
     * Job title.
     */
    title?: string;
  }

  export namespace Job {
    /**
     * The X account that posted a job. A job has none when X imported it from a job
     * board or no longer shows the account.
     */
    export interface Account {
      /**
       * X user ID of the account.
       */
      id: string;

      /**
       * Whether X shows a verification badge on the account.
       */
      verified: boolean;

      /**
       * Bio of the account. A job lookup returns it.
       */
      description?: string;

      /**
       * Display name of the account that posted the job.
       */
      name?: string;

      /**
       * Avatar shape, such as Circle or Square.
       */
      profileImageShape?: string;

      /**
       * Avatar URL of the account that posted the job.
       */
      profilePicture?: string;

      /**
       * Handle without @.
       */
      username?: string;

      /**
       * Badge type, such as Business or Government.
       */
      verifiedType?: string;
    }

    /**
     * The company profile of a job X imported from a job board.
     */
    export interface Company {
      /**
       * X company profile ID.
       */
      id: string;

      /**
       * Company logo URL.
       */
      logoUrl?: string;

      /**
       * Company name.
       */
      name?: string;
    }
  }
}

export interface JobRetrieveParams {
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

export interface JobListLocationsParams {
  /**
   * Place name or its start, such as new york. Alias: query.
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
   * Most places to return. Without it, every match returns. Aliases: pageSize,
   * count, max_results, maxItems, max_items & per_page.
   */
  limit?: number;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;
}

export interface JobSearchParams {
  /**
   * Keyword, such as a job title or skill. Alias: query.
   */
  q: string;

  /**
   * Company name to match.
   */
  company?: string;

  /**
   * Pagination cursor for collection results. Also read as next_cursor, next_token,
   * pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * Comma list of full_time, full_time_contract, part_time & contract_to_hire. Any
   * case works, with spaces or hyphens between words.
   */
  employmentType?: string;

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
   * City, region or country as text, such as Berlin.
   */
  location?: string;

  /**
   * Location ID from GET /x/jobs/locations. Replaces location when both are sent.
   */
  locationId?: string;

  /**
   * Where the work happens. Comma list of onsite, remote & hybrid. Any case works,
   * with spaces or hyphens between words.
   */
  locationType?: string;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Items per page (1-100, default 20). Source, filters or credits can return fewer.
   * Follow next_cursor for more pages. Aliases: limit, count, max_results, maxItems,
   * max_items & per_page.
   */
  pageSize?: number;

  /**
   * Comma list of intern, entry_level, junior, mid_level, senior, lead, manager &
   * executive. Any case works, with spaces or hyphens between words.
   */
  seniority?: string;
}

export declare namespace Jobs {
  export {
    type JobRetrieveResponse as JobRetrieveResponse,
    type JobListLocationsResponse as JobListLocationsResponse,
    type JobSearchResponse as JobSearchResponse,
    type JobRetrieveParams as JobRetrieveParams,
    type JobListLocationsParams as JobListLocationsParams,
    type JobSearchParams as JobSearchParams,
  };
}
