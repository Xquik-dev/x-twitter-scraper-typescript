// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { fixtureClient } from '../../fixture-client';

const link = {
  id: 'xlink_AAAAAAAAAAAAAAAA',
  accountId: null,
  apiKeyId: '17',
  completedAt: null,
  createdAt: '2025-01-15T12:00:00Z',
  expiresAt: '2025-01-15T12:30:00Z',
  failure: null,
  health: null,
  object: 'x_account_connection_link',
  purpose: 'connect',
  reference: 'user-42',
  returnUrl: 'https://example.com/connected',
  status: 'pending',
  xUserId: null,
  xUsername: null,
};

describe('resource accountConnectionLinks', () => {
  test('create posts the reference, the return URL and the account to reconnect', async () => {
    const created = { ...link, url: 'https://example.com/connect#token' };
    const { client, requests, sent } = fixtureClient(created);

    const response = await client.x.accountConnectionLinks.create({
      accountId: '42',
      reference: 'user-42',
      returnUrl: 'https://example.com/connected',
    });

    expect(requests).toEqual(['POST https://xquik.test/api/v1/x/account-connection-links']);
    expect(await sent[0]?.json()).toEqual({
      accountId: '42',
      reference: 'user-42',
      returnUrl: 'https://example.com/connected',
    });
    expect(response.url).toBe('https://example.com/connect#token');
    expect(response.apiKeyId).toBe('17');
  });

  test('retrieve reads the link by its ID', async () => {
    const { client, requests } = fixtureClient(link);

    const response = await client.x.accountConnectionLinks.retrieve('xlink_AAAAAAAAAAAAAAAA');

    expect(requests).toEqual([
      'GET https://xquik.test/api/v1/x/account-connection-links/xlink_AAAAAAAAAAAAAAAA',
    ]);
    expect(response).toEqual(link);
  });

  test('list sends the cursor and the limit and reads each link with its key', async () => {
    const dashboardLink = { ...link, id: 'xlink_BBBBBBBBBBBBBBBB', apiKeyId: null };
    const { client, requests } = fixtureClient({
      links: [link, dashboardLink],
      hasMore: true,
      nextCursor: 'def456',
    });

    const page = await client.x.accountConnectionLinks.list({ cursor: 'abc123', limit: 20 });

    expect(requests).toEqual([
      'GET https://xquik.test/api/v1/x/account-connection-links?cursor=abc123&limit=20',
    ]);
    expect(page.links.map(({ id, apiKeyId }) => [id, apiKeyId])).toEqual([
      ['xlink_AAAAAAAAAAAAAAAA', '17'],
      ['xlink_BBBBBBBBBBBBBBBB', null],
    ]);
    expect(page.hasMore).toBe(true);
    expect(page.nextCursor).toBe('def456');
  });

  test('list with no options reads the first page', async () => {
    const { client, requests } = fixtureClient({ links: [], hasMore: false });

    const page = await client.x.accountConnectionLinks.list();

    expect(requests).toEqual(['GET https://xquik.test/api/v1/x/account-connection-links']);
    expect(page).toEqual({ links: [], hasMore: false });
  });

  test('delete revokes the link by its ID', async () => {
    const { client, requests } = fixtureClient({ success: true });

    const response = await client.x.accountConnectionLinks.delete('xlink_AAAAAAAAAAAAAAAA');

    expect(requests).toEqual([
      'DELETE https://xquik.test/api/v1/x/account-connection-links/xlink_AAAAAAAAAAAAAAAA',
    ]);
    expect(response).toEqual({ success: true });
  });
});
