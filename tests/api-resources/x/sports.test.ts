// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper from 'x-twitter-scraper';
import { fixtureClient } from '../../fixture-client';

const schedule: XTwitterScraper.X.FootballSchedule = {
  "league": "nfl",
  "games": [
    {
      "id": "2055084502741811200",
      "seasonType": "RegularSeason",
      "week": 6,
      "startsAt": "2026-10-20T00:15:00.000Z",
      "status": "Closed",
      "clock": "00:00:00",
      "quarter": 4,
      "home": {
        "teamId": "689566294702555136",
        "points": 23
      },
      "away": {
        "teamId": "689566294702555136",
        "points": 23
      },
      "teamIds": [
        "689566294702555136",
        "689566304366292992"
      ],
      "periods": [
        {
          "type": "Quarter"
        }
      ],
      "odds": {
        "home": {
          "moneyLine": "text",
          "spread": "text",
          "total": "text"
        },
        "away": {
          "moneyLine": "text",
          "spread": "text",
          "total": "text"
        }
      }
    }
  ],
  "teams": {
    "689566294702555136": {
      "id": "689566294702555136",
      "name": "San Francisco 49ers",
      "shortName": "49ers",
      "abbreviation": "SF",
      "alternateId": "f0e724b0-4cbf-495a-be47-013907608da9",
      "location": "Virginia Tech",
      "colors": [
        {
          "r": 170,
          "g": 0,
          "b": 0
        }
      ],
      "logos": {
        "default": "https://pbs.twimg.com/semantic_core_img/2094846255792873472/BUi2WqsC?format=png&name=orig",
        "light": "https://pbs.twimg.com/semantic_core_img/2094841642129739776/YCBRBHV5?format=png&name=orig",
        "dark": "https://pbs.twimg.com/semantic_core_img/2094848191451598848/82O7RY0H?format=png&name=orig"
      },
      "xUserId": "43403778"
    }
  }
};

const scoreboard: XTwitterScraper.X.FootballScoreboard = {
  "id": "2055084502741811200",
  "league": "nfl",
  "seasonId": "2039131233582546945",
  "seasonType": "RegularSeason",
  "week": 6,
  "startsAt": "2026-10-20T00:15:00.000Z",
  "venue": "Levi's Stadium",
  "status": "Closed",
  "clock": "00:00:00",
  "quarter": 4,
  "situation": {
    "down": 3,
    "yardsToGo": 22,
    "yardline": 40,
    "yardlineTeamId": "689566294702555136",
    "possessionTeamId": "689566304366292992"
  },
  "home": {
    "teamId": "689566294702555136",
    "points": 23,
    "timeoutsLeft": 2
  },
  "away": {
    "teamId": "689566294702555136",
    "points": 23,
    "timeoutsLeft": 2
  },
  "periods": [
    {
      "number": 1,
      "type": "Quarter",
      "sequence": 1,
      "homePoints": 13,
      "awayPoints": 3
    }
  ],
  "lastPlay": {
    "id": "170",
    "sequence": 9,
    "clock": "00:10:58",
    "type": "Pass",
    "direction": "Left",
    "description": "(10:58) B.Purdy pass short left to G.Kittle for 11 yards, TOUCHDOWN.",
    "scoring": true,
    "homePoints": 6,
    "awayPoints": 0,
    "score": {
      "homePoints": 6,
      "awayPoints": 0,
      "points": 6
    },
    "start": {
      "down": 1,
      "yardsToGo": 10,
      "yardline": 11,
      "yardlineSide": "Away",
      "possession": "5c218a3b-a013-4037-97b6-603c9502b701"
    },
    "onField": {
      "calledBack": false,
      "penaltyOnField": false,
      "timeout": true,
      "underReview": false
    },
    "details": [
      {
        "sequence": 1,
        "category": "Pass",
        "description": "Pass attempt",
        "direction": null,
        "yards": null,
        "players": [
          {
            "playerId": "1520565710329499648",
            "playerRole": "Pass"
          }
        ],
        "penalty": null
      }
    ],
    "post": {
      "id": "2112339130483151117",
      "username": "text"
    },
    "videoPostId": "2112339130483151117",
    "videoReplyPostId": "text"
  },
  "teams": {
    "689566294702555136": {
      "id": "689566294702555136",
      "name": "San Francisco 49ers",
      "shortName": "49ers",
      "abbreviation": "SF",
      "alternateId": "f0e724b0-4cbf-495a-be47-013907608da9",
      "location": "Virginia Tech",
      "colors": [
        {
          "r": 170,
          "g": 0,
          "b": 0
        }
      ],
      "logos": {
        "default": "https://pbs.twimg.com/semantic_core_img/2094846255792873472/BUi2WqsC?format=png&name=orig",
        "light": "https://pbs.twimg.com/semantic_core_img/2094841642129739776/YCBRBHV5?format=png&name=orig",
        "dark": "https://pbs.twimg.com/semantic_core_img/2094848191451598848/82O7RY0H?format=png&name=orig"
      },
      "xUserId": "43403778"
    }
  },
  "players": {
    "1520565710329499648": {
      "id": "1520565710329499648",
      "teamId": "689566294702555136",
      "name": "Brock Purdy",
      "shortName": "B.Purdy",
      "jersey": "13",
      "position": "QB",
      "college": "Iowa State",
      "birthPlace": "Gilbert, AZ, USA",
      "birthDate": "1999-12-27",
      "headshots": {
        "original": "https://ton.twimg.com/twitter-assets/sports-product/headshots/nfl/1520565710329499648_large_c96c3d47bd.png",
        "large": "https://pbs.twimg.com/semantic_core_img/1960525277903106048/qEOJWYP6?format=png&name=orig",
        "medium": "https://pbs.twimg.com/semantic_core_img/1960514226075602944/OZ6rz5aH?format=png&name=orig",
        "small": "https://pbs.twimg.com/semantic_core_img/1960202905849405441/OnS0Xdd9?format=png&name=orig"
      },
      "xUser": {
        "id": "723177170382647296",
        "username": "brockpurdy13",
        "blueVerified": true
      }
    }
  }
};

const boxScore: XTwitterScraper.X.FootballBoxScore = {
  "id": "2055084502741811200",
  "league": "nfl",
  "home": {
    "teamId": "689566294702555136",
    "totals": {
      "firstDowns": 20,
      "thirdDowns": {
        "attempts": 14,
        "successes": 7
      },
      "fumbles": {
        "lost": 1,
        "opponentRecoveryTouchdowns": 0,
        "ownRecoveryTouchdowns": 0
      },
      "passing": {
        "attempts": 29,
        "avgYards": 9.10345,
        "completions": 21,
        "interceptions": 0,
        "netYards": 249,
        "rating": 111.85345,
        "sackYards": 15,
        "sacks": 2,
        "touchdowns": 1,
        "yards": 264
      },
      "penalties": {
        "count": 11,
        "yards": 88
      },
      "rushing": {
        "attempts": 5,
        "avgYards": 5.6,
        "longest": 11,
        "touchdowns": 0,
        "yards": 28
      },
      "timeOfPossessionSeconds": 1785,
      "totalYards": 375,
      "turnovers": 1
    },
    "players": [
      {
        "playerId": "1520565710329499648",
        "passing": {
          "attempts": 29,
          "avgYards": 9.10345,
          "completions": 21,
          "interceptions": 0,
          "netYards": 249,
          "rating": 111.85345,
          "sackYards": 15,
          "sacks": 2,
          "touchdowns": 1,
          "yards": 264
        },
        "rushing": {
          "attempts": 5,
          "avgYards": 5.6,
          "longest": 11,
          "touchdowns": 0,
          "yards": 28
        },
        "receiving": {
          "avgYards": 3,
          "longest": 3,
          "receptions": 1,
          "targets": 1,
          "touchdowns": 0,
          "yards": 3
        },
        "defense": {
          "combined": 8,
          "forcedFumbles": 0,
          "interceptions": 0,
          "passesDefended": 0,
          "sacks": 0.5,
          "tackles": 6,
          "tacklesForLoss": 0
        },
        "fumbles": {
          "lost": 1,
          "opponentRecoveryTouchdowns": 0,
          "ownRecoveryTouchdowns": 0
        },
        "kickReturns": {
          "avgYards": 24,
          "longest": 24,
          "returns": 1,
          "touchdowns": 0,
          "yards": 24
        },
        "puntReturns": {
          "avgYards": 24,
          "longest": 24,
          "returns": 1,
          "touchdowns": 0,
          "yards": 24
        },
        "interceptionReturns": {
          "avgYards": 24,
          "longest": 24,
          "returns": 1,
          "touchdowns": 0,
          "yards": 24
        },
        "punts": {
          "attempts": 4,
          "avgNetYards": 47.8,
          "avgYards": 47.75,
          "inside20": 0,
          "longest": 49,
          "yards": 191
        },
        "fieldGoals": {
          "attempts": 1,
          "longest": 33,
          "made": 1
        },
        "extraPoints": {
          "attempts": 3,
          "made": 2
        },
        "conversions": {
          "defenseSuccesses": 0,
          "passSuccesses": 1,
          "rushSuccesses": 0,
          "turnoverSuccesses": 0
        }
      }
    ]
  },
  "away": {
    "teamId": "689566294702555136",
    "totals": {
      "firstDowns": 20,
      "thirdDowns": {
        "attempts": 14,
        "successes": 7
      },
      "fumbles": {
        "lost": 1,
        "opponentRecoveryTouchdowns": 0,
        "ownRecoveryTouchdowns": 0
      },
      "passing": {
        "attempts": 29,
        "avgYards": 9.10345,
        "completions": 21,
        "interceptions": 0,
        "netYards": 249,
        "rating": 111.85345,
        "sackYards": 15,
        "sacks": 2,
        "touchdowns": 1,
        "yards": 264
      },
      "penalties": {
        "count": 11,
        "yards": 88
      },
      "rushing": {
        "attempts": 5,
        "avgYards": 5.6,
        "longest": 11,
        "touchdowns": 0,
        "yards": 28
      },
      "timeOfPossessionSeconds": 1785,
      "totalYards": 375,
      "turnovers": 1
    },
    "players": [
      {
        "playerId": "1520565710329499648",
        "passing": {
          "attempts": 29,
          "avgYards": 9.10345,
          "completions": 21,
          "interceptions": 0,
          "netYards": 249,
          "rating": 111.85345,
          "sackYards": 15,
          "sacks": 2,
          "touchdowns": 1,
          "yards": 264
        },
        "rushing": {
          "attempts": 5,
          "avgYards": 5.6,
          "longest": 11,
          "touchdowns": 0,
          "yards": 28
        },
        "receiving": {
          "avgYards": 3,
          "longest": 3,
          "receptions": 1,
          "targets": 1,
          "touchdowns": 0,
          "yards": 3
        },
        "defense": {
          "combined": 8,
          "forcedFumbles": 0,
          "interceptions": 0,
          "passesDefended": 0,
          "sacks": 0.5,
          "tackles": 6,
          "tacklesForLoss": 0
        },
        "fumbles": {
          "lost": 1,
          "opponentRecoveryTouchdowns": 0,
          "ownRecoveryTouchdowns": 0
        },
        "kickReturns": {
          "avgYards": 24,
          "longest": 24,
          "returns": 1,
          "touchdowns": 0,
          "yards": 24
        },
        "puntReturns": {
          "avgYards": 24,
          "longest": 24,
          "returns": 1,
          "touchdowns": 0,
          "yards": 24
        },
        "interceptionReturns": {
          "avgYards": 24,
          "longest": 24,
          "returns": 1,
          "touchdowns": 0,
          "yards": 24
        },
        "punts": {
          "attempts": 4,
          "avgNetYards": 47.8,
          "avgYards": 47.75,
          "inside20": 0,
          "longest": 49,
          "yards": 191
        },
        "fieldGoals": {
          "attempts": 1,
          "longest": 33,
          "made": 1
        },
        "extraPoints": {
          "attempts": 3,
          "made": 2
        },
        "conversions": {
          "defenseSuccesses": 0,
          "passSuccesses": 1,
          "rushSuccesses": 0,
          "turnoverSuccesses": 0
        }
      }
    ]
  },
  "teams": {
    "689566294702555136": {
      "id": "689566294702555136",
      "name": "San Francisco 49ers",
      "shortName": "49ers",
      "abbreviation": "SF",
      "alternateId": "f0e724b0-4cbf-495a-be47-013907608da9",
      "location": "Virginia Tech",
      "colors": [
        {
          "r": 170,
          "g": 0,
          "b": 0
        }
      ],
      "logos": {
        "default": "https://pbs.twimg.com/semantic_core_img/2094846255792873472/BUi2WqsC?format=png&name=orig",
        "light": "https://pbs.twimg.com/semantic_core_img/2094841642129739776/YCBRBHV5?format=png&name=orig",
        "dark": "https://pbs.twimg.com/semantic_core_img/2094848191451598848/82O7RY0H?format=png&name=orig"
      },
      "xUserId": "43403778"
    }
  },
  "players": {
    "1520565710329499648": {
      "id": "1520565710329499648",
      "teamId": "689566294702555136",
      "name": "Brock Purdy",
      "shortName": "B.Purdy",
      "jersey": "13",
      "position": "QB",
      "college": "Iowa State",
      "birthPlace": "Gilbert, AZ, USA",
      "birthDate": "1999-12-27",
      "headshots": {
        "original": "https://ton.twimg.com/twitter-assets/sports-product/headshots/nfl/1520565710329499648_large_c96c3d47bd.png",
        "large": "https://pbs.twimg.com/semantic_core_img/1960525277903106048/qEOJWYP6?format=png&name=orig",
        "medium": "https://pbs.twimg.com/semantic_core_img/1960514226075602944/OZ6rz5aH?format=png&name=orig",
        "small": "https://pbs.twimg.com/semantic_core_img/1960202905849405441/OnS0Xdd9?format=png&name=orig"
      },
      "xUser": {
        "id": "723177170382647296",
        "username": "brockpurdy13",
        "blueVerified": true
      }
    }
  }
};

const plays: XTwitterScraper.X.FootballPlays = {
  "id": "2055084502741811200",
  "league": "nfl",
  "homeTeamId": "689566294702555136",
  "awayTeamId": "689566304366292992",
  "quarters": [
    {
      "id": "quarter-1",
      "number": 1,
      "sequence": 1,
      "drives": [
        {
          "id": "drive-2",
          "sequence": 2,
          "offense": "Home",
          "defense": "Away",
          "startClock": "00:14:55",
          "endClock": "00:10:53",
          "startReason": "Kickoff",
          "endReason": "Touchdown",
          "playCount": 10,
          "firstDowns": 0,
          "netYards": 64,
          "scoring": true,
          "plays": [
            {
              "id": "170",
              "sequence": 9,
              "clock": "00:10:58",
              "type": "Pass",
              "direction": "Left",
              "description": "(10:58) B.Purdy pass short left to G.Kittle for 11 yards, TOUCHDOWN.",
              "scoring": true,
              "homePoints": 6,
              "awayPoints": 0,
              "score": {
                "homePoints": 6,
                "awayPoints": 0,
                "points": 6
              },
              "start": {
                "down": 1,
                "yardsToGo": 10,
                "yardline": 11,
                "yardlineSide": "Away",
                "possession": "5c218a3b-a013-4037-97b6-603c9502b701"
              },
              "onField": {
                "calledBack": false,
                "penaltyOnField": false,
                "timeout": true,
                "underReview": false
              },
              "details": [
                {
                  "sequence": 1,
                  "category": "Pass",
                  "description": "Pass attempt",
                  "direction": null,
                  "yards": null,
                  "players": [
                    {
                      "playerId": "1520565710329499648",
                      "playerRole": "Pass"
                    }
                  ],
                  "penalty": null
                }
              ],
              "post": {
                "id": "2112339130483151117",
                "username": "text"
              },
              "videoPostId": "2112339130483151117",
              "videoReplyPostId": "text"
            }
          ]
        }
      ]
    }
  ],
  "teams": {
    "689566294702555136": {
      "id": "689566294702555136",
      "name": "San Francisco 49ers",
      "shortName": "49ers",
      "abbreviation": "SF",
      "alternateId": "f0e724b0-4cbf-495a-be47-013907608da9",
      "location": "Virginia Tech",
      "colors": [
        {
          "r": 170,
          "g": 0,
          "b": 0
        }
      ],
      "logos": {
        "default": "https://pbs.twimg.com/semantic_core_img/2094846255792873472/BUi2WqsC?format=png&name=orig",
        "light": "https://pbs.twimg.com/semantic_core_img/2094841642129739776/YCBRBHV5?format=png&name=orig",
        "dark": "https://pbs.twimg.com/semantic_core_img/2094848191451598848/82O7RY0H?format=png&name=orig"
      },
      "xUserId": "43403778"
    }
  },
  "players": {
    "1520565710329499648": {
      "id": "1520565710329499648",
      "teamId": "689566294702555136",
      "name": "Brock Purdy",
      "shortName": "B.Purdy",
      "jersey": "13",
      "position": "QB",
      "college": "Iowa State",
      "birthPlace": "Gilbert, AZ, USA",
      "birthDate": "1999-12-27",
      "headshots": {
        "original": "https://ton.twimg.com/twitter-assets/sports-product/headshots/nfl/1520565710329499648_large_c96c3d47bd.png",
        "large": "https://pbs.twimg.com/semantic_core_img/1960525277903106048/qEOJWYP6?format=png&name=orig",
        "medium": "https://pbs.twimg.com/semantic_core_img/1960514226075602944/OZ6rz5aH?format=png&name=orig",
        "small": "https://pbs.twimg.com/semantic_core_img/1960202905849405441/OnS0Xdd9?format=png&name=orig"
      },
      "xUser": {
        "id": "723177170382647296",
        "username": "brockpurdy13",
        "blueVerified": true
      }
    }
  }
};

describe('resource sports', () => {
  test('listGames sends the league & window', async () => {
    const { client, requests } = fixtureClient(schedule);

    const response = await client.x.sports.listGames('nfl', {
      from: '2026-10-01',
      to: '2026-10-08',
      team: '689566294702555136',
    });

    expect(requests).toEqual([
      'GET https://xquik.test/api/v1/x/sports/nfl/games?from=2026-10-01&to=2026-10-08&team=689566294702555136',
    ]);
    expect(response).toEqual(schedule);
    expect(response.teams['689566294702555136']!.abbreviation).toBe('SF');
  });

  test('retrieveScoreboard reads 1 game', async () => {
    const { client, requests } = fixtureClient(scoreboard);

    const response = await client.x.sports.retrieveScoreboard('2055084502741811200', {
      league: 'nfl',
      fields: 'id,home',
    });

    expect(requests).toEqual([
      'GET https://xquik.test/api/v1/x/sports/nfl/games/2055084502741811200?fields=id%2Chome',
    ]);
    expect(response.home.timeoutsLeft).toBe(2);
    expect(response.lastPlay!.id).toBe('170');
  });

  test('retrieveBoxScore reads team & player stats', async () => {
    const { client, requests } = fixtureClient(boxScore);

    const response = await client.x.sports.retrieveBoxScore('2055084502741811200', { league: 'ncaafb' });

    expect(requests).toEqual(['GET https://xquik.test/api/v1/x/sports/ncaafb/games/2055084502741811200/box-score']);
    expect(response.home.totals!.thirdDowns).toEqual({ attempts: 14, successes: 7 });
    expect(response.home.players[0]!.passing!.yards).toBe(264);
  });

  test('retrievePlays reads drives & plays', async () => {
    const { client, requests } = fixtureClient(plays);

    const response = await client.x.sports.retrievePlays('2055084502741811200', {
      league: 'nfl',
      omit: 'players',
    });

    expect(requests).toEqual([
      'GET https://xquik.test/api/v1/x/sports/nfl/games/2055084502741811200/plays?omit=players',
    ]);
    expect(response.quarters[0]!.drives[0]!.plays[0]!.type).toBe('Pass');
  });
});
