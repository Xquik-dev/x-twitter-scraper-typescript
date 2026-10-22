// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * NFL & college football games, scoreboards, box scores & play-by-play
 */
export class Sports extends APIResource {
  /**
   * Lists NFL or college football games in a time window, with teams & scores.
   * Use it to find game IDs & team IDs. Without from or to, X picks about 5
   * weeks around today. Each request costs 1 credit.
   *
   * @example
   * ```ts
   * const footballSchedule = await client.x.sports.listGames('nfl');
   * ```
   */
  listGames(
    league: FootballLeague,
    query: SportListGamesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<FootballSchedule> {
    return this._client.get(path`/x/sports/${league}/games`, { query, ...options });
  }

  /**
   * Returns 1 game's scoreboard. It has the teams, the score by period, the
   * status & clock, down & distance, the venue & the latest play. Each request
   * costs 1 credit.
   *
   * @example
   * ```ts
   * const footballScoreboard = await client.x.sports.retrieveScoreboard('2055084502741811200', {
   *   league: 'nfl',
   * });
   * ```
   */
  retrieveScoreboard(
    id: string,
    params: SportRetrieveScoreboardParams,
    options?: RequestOptions,
  ): APIPromise<FootballScoreboard> {
    const { league, ...query } = params;
    return this._client.get(path`/x/sports/${league}/games/${id}`, { query, ...options });
  }

  /**
   * Returns each team's totals & each player's stats for 1 game. Stats cover
   * passing, rushing, receiving, defense, kicking & returns. A game that has
   * not started has no stats yet. Each request costs 1 credit.
   *
   * @example
   * ```ts
   * const footballBoxScore = await client.x.sports.retrieveBoxScore('2055084502741811200', {
   *   league: 'nfl',
   * });
   * ```
   */
  retrieveBoxScore(
    id: string,
    params: SportRetrieveBoxScoreParams,
    options?: RequestOptions,
  ): APIPromise<FootballBoxScore> {
    const { league, ...query } = params;
    return this._client.get(path`/x/sports/${league}/games/${id}/box-score`, { query, ...options });
  }

  /**
   * Returns every drive & play of 1 game, by quarter. Each play has its clock,
   * down & distance, details, penalties & linked posts. Each request costs 1
   * credit.
   *
   * @example
   * ```ts
   * const footballPlays = await client.x.sports.retrievePlays('2055084502741811200', {
   *   league: 'nfl',
   * });
   * ```
   */
  retrievePlays(
    id: string,
    params: SportRetrievePlaysParams,
    options?: RequestOptions,
  ): APIPromise<FootballPlays> {
    const { league, ...query } = params;
    return this._client.get(path`/x/sports/${league}/games/${id}/plays`, { query, ...options });
  }
}

/**
 * nfl for the NFL or ncaafb for college football.
 */
export type FootballLeague = 'nfl' | 'ncaafb';

/**
 * A team's side of a game & its points.
 */
export interface FootballTeamScore {
  /**
   * The team, a key of teams.
   */
  teamId: string | null;

  /**
   * The team's points so far.
   */
  points: number | null;
}

/**
 * A period of a listed game.
 */
export interface FootballSchedulePeriod {
  /**
   * X's name for the period, such as Quarter.
   */
  type: string | null;
}

/**
 * Betting odds titles for 1 team, as X shows them.
 */
export interface FootballOdds {
  /**
   * The money line. X sends it for the away team only.
   */
  moneyLine: string | null;

  /**
   * The point spread.
   */
  spread: string | null;

  /**
   * The over or under total.
   */
  total: string | null;
}

/**
 * Betting odds for each team, or null when X has none.
 */
export interface FootballScheduleGameOdds {
  /**
   * Betting odds titles for 1 team, as X shows them.
   */
  home: FootballOdds;

  /**
   * Betting odds titles for 1 team, as X shows them.
   */
  away: FootballOdds;
}

/**
 * A listed game, with its teams & score.
 */
export interface FootballScheduleGame {
  /**
   * The game ID the other sports routes take.
   */
  id: string;

  /**
   * This game's part of the season, such as RegularSeason.
   */
  seasonType: string | null;

  /**
   * This game's week of the season.
   */
  week: number | null;

  /**
   * This game's kickoff time in UTC, or null when Xquik cannot read it.
   */
  startsAt: string | null;

  /**
   * This game's status from X, such as Scheduled, InProgress or Closed.
   */
  status: string | null;

  /**
   * This game's clock, as X writes it.
   */
  clock: string | null;

  /**
   * This game's current or last quarter.
   */
  quarter: number | null;

  /**
   * A team's side of a game & its points.
   */
  home: FootballTeamScore;

  /**
   * A team's side of a game & its points.
   */
  away: FootballTeamScore;

  /**
   * The game's teams, keys of teams.
   */
  teamIds: Array<string>;

  /**
   * The periods played so far.
   */
  periods: Array<FootballSchedulePeriod>;

  /**
   * Betting odds for each team, or null when X has none.
   */
  odds: FootballScheduleGameOdds | null;
}

export interface SportsTeamColor {
  /**
   * Red, from 0 to 255.
   */
  r: number | null;

  /**
   * Green, from 0 to 255.
   */
  g: number | null;

  /**
   * Blue, from 0 to 255.
   */
  b: number | null;
}

/**
 * The team's logo images.
 */
export interface SportsTeamLogos {
  /**
   * The logo X shows by default.
   */
  default: string | null;

  /**
   * The logo for light backgrounds.
   */
  light: string | null;

  /**
   * The logo for dark backgrounds.
   */
  dark: string | null;
}

/**
 * A team, as X's sports pages show it.
 */
export interface SportsTeam {
  /**
   * The team ID that games & players refer to.
   */
  id: string;

  /**
   * The team's full name.
   */
  name: string | null;

  /**
   * The team's short name.
   */
  shortName: string | null;

  /**
   * The team's abbreviation.
   */
  abbreviation: string | null;

  /**
   * Another ID X keeps for the team.
   */
  alternateId: string | null;

  /**
   * The school or place a college team plays for. X sends it only in college
   * football schedules.
   */
  location: string | null;

  /**
   * The team's colors, as red, green & blue from 0 to 255.
   */
  colors: Array<SportsTeamColor>;

  /**
   * The team's logo images.
   */
  logos: SportsTeamLogos;

  /**
   * The user ID of the team's X account.
   */
  xUserId: string | null;
}

/**
 * A league's games in a time window.
 */
export interface FootballSchedule {
  /**
   * The league whose games this list holds.
   */
  league: FootballLeague;

  /**
   * The games, earliest first.
   */
  games: Array<FootballScheduleGame>;

  /**
   * The teams the games name, by team ID.
   */
  teams: { [key: string]: SportsTeam };
}

/**
 * Down & distance now, or null before kickoff.
 */
export interface FootballScoreboardSituation {
  /**
   * The current down, from 1 to 4.
   */
  down: number | null;

  /**
   * The yards the offense needs now for a first down.
   */
  yardsToGo: number | null;

  /**
   * The ball's current yard line.
   */
  yardline: number | null;

  /**
   * The team whose half the ball is in, a key of teams.
   */
  yardlineTeamId: string | null;

  /**
   * The team with the ball, a key of teams.
   */
  possessionTeamId: string | null;
}

/**
 * A team's side of a scoreboard.
 */
export interface FootballSide {
  /**
   * The team, a key of teams.
   */
  teamId: string | null;

  /**
   * The team's points so far.
   */
  points: number | null;

  /**
   * The timeouts the team has left.
   */
  timeoutsLeft: number | null;
}

/**
 * A period of a game & its points.
 */
export interface FootballPeriod {
  /**
   * X's name for the period, such as Quarter.
   */
  type: string | null;

  /**
   * The period's number, or null when X sends no digits.
   */
  number: number | null;

  /**
   * The period's place in the game, from 1.
   */
  sequence: number | null;

  /**
   * The home team's points in the period.
   */
  homePoints: number | null;

  /**
   * The away team's points in the period.
   */
  awayPoints: number | null;
}

/**
 * The points a scoring play added, or null.
 */
export interface FootballPlayScore {
  /**
   * The home team's score once this scoring play counted.
   */
  homePoints: number | null;

  /**
   * The away team's score once this scoring play counted.
   */
  awayPoints: number | null;

  /**
   * The points the play scored.
   */
  points: number | null;
}

/**
 * Down & distance when the play started, or null.
 */
export interface FootballPlayStart {
  /**
   * The down, from 1 to 4.
   */
  down: number | null;

  /**
   * The yards needed for a first down.
   */
  yardsToGo: number | null;

  /**
   * The yard line of the ball.
   */
  yardline: number | null;

  /**
   * Whose half the ball was in. Home or Away in NFL games, the team's
   * alternateId in college games.
   */
  yardlineSide: string | null;

  /**
   * The team with the ball. Home or Away in NFL games, the team's alternateId
   * in college games.
   */
  possession: string | null;
}

/**
 * Flags X shows on the field for the play, or null.
 */
export interface FootballPlayOnField {
  /**
   * Whether a penalty called the play back.
   */
  calledBack: boolean | null;

  /**
   * Whether a flag was thrown.
   */
  penaltyOnField: boolean | null;

  /**
   * Whether a timeout followed the play.
   */
  timeout: boolean | null;

  /**
   * Whether officials were reviewing the play.
   */
  underReview: boolean | null;
}

export interface FootballPlayDetailPlayer {
  /**
   * The player, a key of players.
   */
  playerId: string | null;

  /**
   * The player's role, such as Pass, Receive or Tackle.
   */
  playerRole: string | null;
}

/**
 * The penalty this step called, or null.
 */
export interface FootballPlayDetailPenalty {
  /**
   * The penalty's name.
   */
  description: string | null;

  /**
   * What the penalty does to the down.
   */
  nextDown: string | null;

  /**
   * Whether the penalty was accepted or declined.
   */
  result: string | null;

  /**
   * The penalized team, a key of teams.
   */
  teamId: string | null;

  /**
   * The penalty's yards.
   */
  yards: number | null;
}

/**
 * 1 step of a play, such as a pass, a tackle or a penalty.
 */
export interface FootballPlayDetail {
  /**
   * The step's place in the play, from 1.
   */
  sequence: number | null;

  /**
   * X's kind of step, such as Pass, Tackle or Penalty.
   */
  category: string | null;

  /**
   * What happened in the step.
   */
  description: string | null;

  /**
   * The direction X gives for the step.
   */
  direction: string | null;

  /**
   * The yards the step gained or lost.
   */
  yards: number | null;

  /**
   * The players in the step & their roles.
   */
  players: Array<FootballPlayDetailPlayer>;

  /**
   * The penalty this step called, or null.
   */
  penalty: FootballPlayDetailPenalty | null;
}

/**
 * The post X links to the play, or null.
 */
export interface FootballPlayPost {
  /**
   * The post's ID.
   */
  id: string;

  /**
   * The username of the post's author, when X sends it.
   */
  username: string | null;
}

/**
 * A play, with its situation, steps & linked posts.
 */
export interface FootballPlay {
  /**
   * X's ID for the play within the game.
   */
  id: string | null;

  /**
   * The play's place in its drive, or null when X sends no digits.
   */
  sequence: number | null;

  /**
   * The game clock when the play started, as HH:MM:SS.
   */
  clock: string | null;

  /**
   * X's kind of play, such as Pass, Rush, Punt or Conversion.
   */
  type: string | null;

  /**
   * Where the play went, such as Left or Middle.
   */
  direction: string | null;

  /**
   * The play as the official play-by-play writes it.
   */
  description: string | null;

  /**
   * Whether the play scored points.
   */
  scoring: boolean | null;

  /**
   * The home team's points after the play.
   */
  homePoints: number | null;

  /**
   * The away team's points after the play.
   */
  awayPoints: number | null;

  /**
   * The points a scoring play added, or null.
   */
  score: FootballPlayScore | null;

  /**
   * Down & distance when the play started, or null.
   */
  start: FootballPlayStart | null;

  /**
   * Flags X shows on the field for the play, or null.
   */
  onField: FootballPlayOnField | null;

  /**
   * The play's steps, in order.
   */
  details: Array<FootballPlayDetail>;

  /**
   * The post X links to the play, or null.
   */
  post: FootballPlayPost | null;

  /**
   * The ID of a post with the play's video.
   */
  videoPostId: string | null;

  /**
   * The ID of a reply with the play's video.
   */
  videoReplyPostId: string | null;
}

/**
 * Photos of the player. Any of them can be null.
 */
export interface FootballPlayerHeadshots {
  /**
   * The photo X shows on the player's card.
   */
  original: string | null;

  /**
   * The large photo.
   */
  large: string | null;

  /**
   * The medium photo.
   */
  medium: string | null;

  /**
   * The small photo.
   */
  small: string | null;
}

/**
 * The player's X account, or null without one.
 */
export interface FootballPlayerXUser {
  /**
   * The account's user ID.
   */
  id: string;

  /**
   * The account's username, without @.
   */
  username: string | null;

  /**
   * Whether the account has a blue check.
   */
  blueVerified: boolean | null;
}

/**
 * A football player, as X's sports pages show them.
 */
export interface FootballPlayer {
  /**
   * The player ID that plays & stats refer to.
   */
  id: string;

  /**
   * The player's team, a key of teams.
   */
  teamId: string | null;

  /**
   * The player's full name.
   */
  name: string | null;

  /**
   * The name play descriptions use.
   */
  shortName: string | null;

  /**
   * The jersey number, as text.
   */
  jersey: string | null;

  /**
   * The position abbreviation, such as QB or DE.
   */
  position: string | null;

  /**
   * The college the player came from.
   */
  college: string | null;

  /**
   * Where the player was born.
   */
  birthPlace: string | null;

  /**
   * The birth date, as YYYY-MM-DD.
   */
  birthDate: string | null;

  /**
   * Photos of the player. Any of them can be null.
   */
  headshots: FootballPlayerHeadshots;

  /**
   * The player's X account, or null without one.
   */
  xUser: FootballPlayerXUser | null;
}

/**
 * 1 game's scoreboard.
 */
export interface FootballScoreboard {
  /**
   * The game ID from your request.
   */
  id: string;

  /**
   * The league from your request.
   */
  league: FootballLeague;

  /**
   * X's ID for the season. NFL games have one.
   */
  seasonId: string | null;

  /**
   * The part of the season, such as RegularSeason.
   */
  seasonType: string | null;

  /**
   * The week of the season.
   */
  week: number | null;

  /**
   * The kickoff time in UTC, or null when X sends none Xquik can read.
   */
  startsAt: string | null;

  /**
   * The stadium.
   */
  venue: string | null;

  /**
   * X's game status, such as Scheduled, InProgress or Closed.
   */
  status: string | null;

  /**
   * The game clock, as X writes it.
   */
  clock: string | null;

  /**
   * The current or last quarter.
   */
  quarter: number | null;

  /**
   * Down & distance now, or null before kickoff.
   */
  situation: FootballScoreboardSituation | null;

  /**
   * A team's side of a scoreboard.
   */
  home: FootballSide;

  /**
   * A team's side of a scoreboard.
   */
  away: FootballSide;

  /**
   * Points by period, in order.
   */
  periods: Array<FootballPeriod>;

  /**
   * The latest play, or null before kickoff.
   */
  lastPlay: FootballPlay | null;

  /**
   * The teams this answer names, by team ID.
   */
  teams: { [key: string]: SportsTeam };

  /**
   * The players this answer names, by player ID.
   */
  players: { [key: string]: FootballPlayer };
}

/**
 * Third downs tried & converted.
 */
export interface FootballTeamTotalsThirdDowns {
  /**
   * Third downs tried.
   */
  attempts: number | null;

  /**
   * Third downs converted.
   */
  successes: number | null;
}

/**
 * Fumble stats.
 */
export interface FootballFumbleStats {
  /**
   * Fumbles the other team recovered.
   */
  lost: number | null;

  /**
   * Touchdowns scored after recovering the other team's fumble.
   */
  opponentRecoveryTouchdowns: number | null;

  /**
   * Touchdowns scored after recovering an own fumble.
   */
  ownRecoveryTouchdowns: number | null;
}

/**
 * Passing stats.
 */
export interface FootballPassingStats {
  /**
   * Passes thrown.
   */
  attempts: number | null;

  /**
   * Yards per pass.
   */
  avgYards: number | null;

  /**
   * Passes caught.
   */
  completions: number | null;

  /**
   * Passes intercepted.
   */
  interceptions: number | null;

  /**
   * Passing yards minus sack yards.
   */
  netYards: number | null;

  /**
   * The passer rating.
   */
  rating: number | null;

  /**
   * Yards lost to sacks.
   */
  sackYards: number | null;

  /**
   * Times sacked.
   */
  sacks: number | null;

  /**
   * Passing touchdowns.
   */
  touchdowns: number | null;

  /**
   * Passing yards.
   */
  yards: number | null;
}

/**
 * Penalties against the team.
 */
export interface FootballTeamTotalsPenalties {
  /**
   * Penalties.
   */
  count: number | null;

  /**
   * Penalty yards.
   */
  yards: number | null;
}

/**
 * Rushing stats.
 */
export interface FootballRushingStats {
  /**
   * Rushes.
   */
  attempts: number | null;

  /**
   * Yards per rush.
   */
  avgYards: number | null;

  /**
   * The longest rush, in yards.
   */
  longest: number | null;

  /**
   * Rushing touchdowns.
   */
  touchdowns: number | null;

  /**
   * Rushing yards.
   */
  yards: number | null;
}

/**
 * A team's totals for 1 game.
 */
export interface FootballTeamTotals {
  /**
   * First downs.
   */
  firstDowns: number | null;

  /**
   * Third downs tried & converted.
   */
  thirdDowns: FootballTeamTotalsThirdDowns | null;

  /**
   * The team's fumbles, or null.
   */
  fumbles: FootballFumbleStats | null;

  /**
   * The team's passing, or null.
   */
  passing: FootballPassingStats | null;

  /**
   * Penalties against the team.
   */
  penalties: FootballTeamTotalsPenalties | null;

  /**
   * The team's rushing, or null.
   */
  rushing: FootballRushingStats | null;

  /**
   * Time with the ball, in seconds.
   */
  timeOfPossessionSeconds: number | null;

  /**
   * Total yards.
   */
  totalYards: number | null;

  /**
   * Turnovers.
   */
  turnovers: number | null;
}

/**
 * Receiving stats.
 */
export interface FootballPlayerStatsReceiving {
  /**
   * Yards per catch.
   */
  avgYards: number | null;

  /**
   * The longest catch, in yards.
   */
  longest: number | null;

  /**
   * Catches.
   */
  receptions: number | null;

  /**
   * Passes thrown to the player.
   */
  targets: number | null;

  /**
   * Receiving touchdowns.
   */
  touchdowns: number | null;

  /**
   * Receiving yards.
   */
  yards: number | null;
}

/**
 * Defensive stats.
 */
export interface FootballPlayerStatsDefense {
  /**
   * Solo & assisted tackles together.
   */
  combined: number | null;

  /**
   * Fumbles forced.
   */
  forcedFumbles: number | null;

  /**
   * Interceptions.
   */
  interceptions: number | null;

  /**
   * Passes defended.
   */
  passesDefended: number | null;

  /**
   * Sacks, with a shared sack as 0.5.
   */
  sacks: number | null;

  /**
   * Solo tackles.
   */
  tackles: number | null;

  /**
   * Tackles for a loss.
   */
  tacklesForLoss: number | null;
}

/**
 * Kick, punt or interception return stats.
 */
export interface FootballReturnStats {
  /**
   * Yards per return.
   */
  avgYards: number | null;

  /**
   * The longest return, in yards.
   */
  longest: number | null;

  /**
   * Returns.
   */
  returns: number | null;

  /**
   * Return touchdowns.
   */
  touchdowns: number | null;

  /**
   * Return yards.
   */
  yards: number | null;
}

/**
 * Punting stats.
 */
export interface FootballPlayerStatsPunts {
  /**
   * Punts.
   */
  attempts: number | null;

  /**
   * Net yards per punt, after returns.
   */
  avgNetYards: number | null;

  /**
   * Yards per punt.
   */
  avgYards: number | null;

  /**
   * Punts downed inside the 20.
   */
  inside20: number | null;

  /**
   * The longest punt, in yards.
   */
  longest: number | null;

  /**
   * Punting yards.
   */
  yards: number | null;
}

/**
 * Field goal stats.
 */
export interface FootballPlayerStatsFieldGoals {
  /**
   * Field goals tried.
   */
  attempts: number | null;

  /**
   * The longest made field goal, in yards.
   */
  longest: number | null;

  /**
   * Field goals made.
   */
  made: number | null;
}

/**
 * Extra point kicks.
 */
export interface FootballPlayerStatsExtraPoints {
  /**
   * Extra points tried.
   */
  attempts: number | null;

  /**
   * Extra points made.
   */
  made: number | null;
}

/**
 * 2-point conversions.
 */
export interface FootballPlayerStatsConversions {
  /**
   * Defensive 2-point returns.
   */
  defenseSuccesses: number | null;

  /**
   * 2-point conversions by pass.
   */
  passSuccesses: number | null;

  /**
   * 2-point conversions by rush.
   */
  rushSuccesses: number | null;

  /**
   * 2-point conversions after a turnover.
   */
  turnoverSuccesses: number | null;
}

/**
 * 1 player's stats for 1 game. Only the stat groups X sent are present.
 */
export interface FootballPlayerStats {
  /**
   * The player these stats belong to, a key of players.
   */
  playerId: string | null;

  /**
   * Passing stats.
   */
  passing?: FootballPassingStats;

  /**
   * Rushing stats.
   */
  rushing?: FootballRushingStats;

  /**
   * Receiving stats.
   */
  receiving?: FootballPlayerStatsReceiving;

  /**
   * Defensive stats.
   */
  defense?: FootballPlayerStatsDefense;

  /**
   * Fumble stats.
   */
  fumbles?: FootballFumbleStats;

  /**
   * Kick, punt or interception return stats.
   */
  kickReturns?: FootballReturnStats;

  /**
   * Kick, punt or interception return stats.
   */
  puntReturns?: FootballReturnStats;

  /**
   * Kick, punt or interception return stats.
   */
  interceptionReturns?: FootballReturnStats;

  /**
   * Punting stats.
   */
  punts?: FootballPlayerStatsPunts;

  /**
   * Field goal stats.
   */
  fieldGoals?: FootballPlayerStatsFieldGoals;

  /**
   * Extra point kicks.
   */
  extraPoints?: FootballPlayerStatsExtraPoints;

  /**
   * 2-point conversions.
   */
  conversions?: FootballPlayerStatsConversions;
}

/**
 * 1 team's totals & player stats.
 */
export interface FootballTeamBox {
  /**
   * The team these totals belong to, a key of teams.
   */
  teamId: string | null;

  /**
   * The team's totals, or null before kickoff.
   */
  totals: FootballTeamTotals | null;

  /**
   * Each player with stats, 1 entry per player.
   */
  players: Array<FootballPlayerStats>;
}

/**
 * 1 game's team totals & player stats.
 */
export interface FootballBoxScore {
  /**
   * The ID of the game this box score covers.
   */
  id: string;

  /**
   * The league of the game this box score covers.
   */
  league: FootballLeague;

  /**
   * 1 team's totals & player stats.
   */
  home: FootballTeamBox;

  /**
   * 1 team's totals & player stats.
   */
  away: FootballTeamBox;

  /**
   * The teams this box score names, by team ID.
   */
  teams: { [key: string]: SportsTeam };

  /**
   * The players this box score names, by player ID.
   */
  players: { [key: string]: FootballPlayer };
}

/**
 * A drive, with its result & plays.
 */
export interface FootballDrive {
  /**
   * X's ID for the drive within the game.
   */
  id: string | null;

  /**
   * The drive's place in the game, from 1.
   */
  sequence: number | null;

  /**
   * The team that drove. Home or Away in NFL games, the team's alternateId in
   * college games.
   */
  offense: string | null;

  /**
   * The team on defense. Home or Away in NFL games, the team's alternateId in
   * college games.
   */
  defense: string | null;

  /**
   * The game clock when the drive started, as HH:MM:SS.
   */
  startClock: string | null;

  /**
   * The game clock when the drive ended, as HH:MM:SS.
   */
  endClock: string | null;

  /**
   * How the drive started, such as Kickoff or Punt.
   */
  startReason: string | null;

  /**
   * How the drive ended, such as Touchdown or Punt.
   */
  endReason: string | null;

  /**
   * The drive's plays.
   */
  playCount: number | null;

  /**
   * The first downs the drive gained.
   */
  firstDowns: number | null;

  /**
   * The yards the drive gained.
   */
  netYards: number | null;

  /**
   * Whether the drive scored.
   */
  scoring: boolean | null;

  /**
   * The drive's plays, in order.
   */
  plays: Array<FootballPlay>;
}

/**
 * A quarter & its drives.
 */
export interface FootballQuarter {
  /**
   * X's ID for the quarter within the game.
   */
  id: string | null;

  /**
   * The quarter's number.
   */
  number: number | null;

  /**
   * The quarter's place in the game, from 1.
   */
  sequence: number | null;

  /**
   * The quarter's drives, in order.
   */
  drives: Array<FootballDrive>;
}

/**
 * 1 game's drives & plays, by quarter.
 */
export interface FootballPlays {
  /**
   * The ID of the game these plays come from.
   */
  id: string;

  /**
   * The league of the game these plays come from.
   */
  league: FootballLeague;

  /**
   * The home team, a key of teams.
   */
  homeTeamId: string | null;

  /**
   * The away team, a key of teams.
   */
  awayTeamId: string | null;

  /**
   * The game's quarters, in order. Empty before kickoff.
   */
  quarters: Array<FootballQuarter>;

  /**
   * The teams these plays name, by team ID.
   */
  teams: { [key: string]: SportsTeam };

  /**
   * The players these plays name, by player ID.
   */
  players: { [key: string]: FootballPlayer };
}

export interface SportListGamesParams {
  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields,
   * such as author.username. A list keeps the field in each item. Case &
   * underscores do not matter. A row that lacks a field leaves it out. Cursors,
   * counts & diagnostics always stay. An unknown name answers 400 unknown_field
   * with the valid names, before any read. The price stays the same. SDK row
   * types then hold only the named fields.
   */
  fields?: string;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Start of the window. Takes an ISO 8601 date or time, such as 2026-10-01, or
   * Unix seconds. A time without a zone reads as UTC. Defaults to 7 days before
   * to. Alias sinceTime.
   */
  from?: string;

  /**
   * Keeps only 1 team's games, by team ID. Each game lists its teamIds. Aliases
   * teamId & team_id.
   */
  team?: string;

  /**
   * End of the window. Takes the forms of from. Defaults to 7 days after from.
   * Alias untilTime.
   */
  to?: string;
}

export interface SportRetrieveScoreboardParams {
  /**
   * Path param: nfl for the NFL or ncaafb for college football, in any case.
   * Another value gets a free 400 `invalid_league` before X is read.
   */
  league: FootballLeague;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields,
   * such as author.username. A list keeps the field in each item. Case &
   * underscores do not matter. A row that lacks a field leaves it out. Cursors,
   * counts & diagnostics always stay. An unknown name answers 400 unknown_field
   * with the valid names, before any read. The price stays the same. SDK row
   * types then hold only the named fields.
   */
  fields?: string;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;
}

export interface SportRetrieveBoxScoreParams {
  /**
   * Path param: nfl for the NFL or ncaafb for college football, in any case.
   * Another value gets a free 400 `invalid_league` before X is read.
   */
  league: FootballLeague;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields,
   * such as author.username. A list keeps the field in each item. Case &
   * underscores do not matter. A row that lacks a field leaves it out. Cursors,
   * counts & diagnostics always stay. An unknown name answers 400 unknown_field
   * with the valid names, before any read. The price stays the same. SDK row
   * types then hold only the named fields.
   */
  fields?: string;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;
}

export interface SportRetrievePlaysParams {
  /**
   * Path param: nfl for the NFL or ncaafb for college football, in any case.
   * Another value gets a free 400 `invalid_league` before X is read.
   */
  league: FootballLeague;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields,
   * such as author.username. A list keeps the field in each item. Case &
   * underscores do not matter. A row that lacks a field leaves it out. Cursors,
   * counts & diagnostics always stay. An unknown name answers 400 unknown_field
   * with the valid names, before any read. The price stays the same. SDK row
   * types then hold only the named fields.
   */
  fields?: string;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;
}

export declare namespace Sports {
  export {
    type FootballLeague as FootballLeague,
    type FootballTeamScore as FootballTeamScore,
    type FootballSchedulePeriod as FootballSchedulePeriod,
    type FootballOdds as FootballOdds,
    type FootballScheduleGameOdds as FootballScheduleGameOdds,
    type FootballScheduleGame as FootballScheduleGame,
    type SportsTeamColor as SportsTeamColor,
    type SportsTeamLogos as SportsTeamLogos,
    type SportsTeam as SportsTeam,
    type FootballSchedule as FootballSchedule,
    type FootballScoreboardSituation as FootballScoreboardSituation,
    type FootballSide as FootballSide,
    type FootballPeriod as FootballPeriod,
    type FootballPlayScore as FootballPlayScore,
    type FootballPlayStart as FootballPlayStart,
    type FootballPlayOnField as FootballPlayOnField,
    type FootballPlayDetailPlayer as FootballPlayDetailPlayer,
    type FootballPlayDetailPenalty as FootballPlayDetailPenalty,
    type FootballPlayDetail as FootballPlayDetail,
    type FootballPlayPost as FootballPlayPost,
    type FootballPlay as FootballPlay,
    type FootballPlayerHeadshots as FootballPlayerHeadshots,
    type FootballPlayerXUser as FootballPlayerXUser,
    type FootballPlayer as FootballPlayer,
    type FootballScoreboard as FootballScoreboard,
    type FootballTeamTotalsThirdDowns as FootballTeamTotalsThirdDowns,
    type FootballFumbleStats as FootballFumbleStats,
    type FootballPassingStats as FootballPassingStats,
    type FootballTeamTotalsPenalties as FootballTeamTotalsPenalties,
    type FootballRushingStats as FootballRushingStats,
    type FootballTeamTotals as FootballTeamTotals,
    type FootballPlayerStatsReceiving as FootballPlayerStatsReceiving,
    type FootballPlayerStatsDefense as FootballPlayerStatsDefense,
    type FootballReturnStats as FootballReturnStats,
    type FootballPlayerStatsPunts as FootballPlayerStatsPunts,
    type FootballPlayerStatsFieldGoals as FootballPlayerStatsFieldGoals,
    type FootballPlayerStatsExtraPoints as FootballPlayerStatsExtraPoints,
    type FootballPlayerStatsConversions as FootballPlayerStatsConversions,
    type FootballPlayerStats as FootballPlayerStats,
    type FootballTeamBox as FootballTeamBox,
    type FootballBoxScore as FootballBoxScore,
    type FootballDrive as FootballDrive,
    type FootballQuarter as FootballQuarter,
    type FootballPlays as FootballPlays,
    type SportListGamesParams as SportListGamesParams,
    type SportRetrieveScoreboardParams as SportRetrieveScoreboardParams,
    type SportRetrieveBoxScoreParams as SportRetrieveBoxScoreParams,
    type SportRetrievePlaysParams as SportRetrievePlaysParams,
  };
}
