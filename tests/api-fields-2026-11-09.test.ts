// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { fixtureClient } from './fixture-client';

const attemptId = 'xatt_0123456789abcdef0123456789abcdef';

describe('API fields added on 2026-11-09', () => {
  test('tweets.create sends media_ids', async () => {
    const { client, sent } = fixtureClient({});

    await client.x.tweets.create({
      account: '@elonmusk',
      'Idempotency-Key': 'write-1',
      media_ids: ['2104371968258560001'],
    });

    expect(await sent[0]?.json()).toEqual({ account: '@elonmusk', media_ids: ['2104371968258560001'] });
  });

  test('accounts.create and reauth send connection_attempt_id and read a pending attempt', async () => {
    const { client, sent } = fixtureClient({
      id: attemptId,
      object: 'x_account_connection_attempt',
      pollAfterMs: 1000,
      status: 'pending',
    });

    await client.x.accounts.create({
      email: 'account@example.invalid',
      password: '<ACCOUNT_PASSWORD>',
      totp_secret: '<TOTP_SECRET>',
      username: 'your_x_username',
      connection_attempt_id: attemptId,
    });
    const reauth = await client.x.accounts.reauth('42', {
      password: '<ACCOUNT_PASSWORD>',
      connection_attempt_id: attemptId,
    });

    expect(await sent[0]?.json()).toMatchObject({ connection_attempt_id: attemptId });
    expect(await sent[1]?.json()).toEqual({
      password: '<ACCOUNT_PASSWORD>',
      connection_attempt_id: attemptId,
    });
    expect(reauth.status === 'pending' ? reauth.pollAfterMs : undefined).toBe(1000);
  });

  test('a finished attempt names the connected account', async () => {
    const { client } = fixtureClient({
      id: attemptId,
      object: 'x_account_connection_attempt',
      status: 'success',
      accountId: '42',
    });

    const attempt = await client.x.accountConnectionAttempts.retrieve(attemptId);

    expect(attempt.status === 'success' ? attempt.accountId : undefined).toBe('42');
  });

  test('media.download returns the posts it had no time to read', async () => {
    const { client } = fixtureClient({ totalMedia: 5, totalTweets: 2, unprocessedTweetIds: ['1234567892'] });

    const response = await client.x.media.download({
      tweetIds: ['1234567890', '1234567891', '1234567892'],
    });

    expect(response.unprocessedTweetIds).toEqual(['1234567892']);
  });
});
