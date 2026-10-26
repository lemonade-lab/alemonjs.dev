import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchEcosystem } from './ecosystem'

const item = {
  id: 'connector-alemonjs-onebot',
  type: 'connector',
  name: '@alemonjs/onebot',
  description: 'OneBot V11&V12',
  sourceCategory: '第三方',
  repositoryUrl:
    'https://github.com/lemonade-lab/alemonjs/tree/main/packages/onebot',
  packageUrl: 'https://www.npmjs.com/package/@alemonjs/onebot',
  legacyNotice: ''
}

afterEach(() => vi.unstubAllGlobals())

describe('ecosystem API boundary', () => {
  it('uses the agreed public address without sending credentials', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(
        new Response(
          JSON.stringify({ data: [item], total: 1, page: 1, pageSize: 20 })
        )
      )
    vi.stubGlobal('fetch', fetcher)
    const signal = new AbortController().signal
    const result = await fetchEcosystem('connector', 'OneBot', 1, signal)
    expect(result.data[0].name).toBe('@alemonjs/onebot')
    expect(fetcher).toHaveBeenCalledWith(
      expect.stringMatching(
        /^https:\/\/open\.alemonjs\.com\/api\/v1\/resources\?/
      ),
      { signal, credentials: 'omit' }
    )
  })

  it('rejects executable links before they reach the page', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            data: [{ ...item, repositoryUrl: 'javascript:alert(1)' }],
            total: 1,
            page: 1,
            pageSize: 20
          })
        )
      )
    )
    await expect(
      fetchEcosystem('connector', '', 1, new AbortController().signal)
    ).rejects.toThrow('无效的资源链接')
  })

  it('rejects mismatched categories and malformed pagination', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: [{ ...item, type: 'skill' }],
            total: 1,
            page: 1,
            pageSize: 20
          })
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ data: [item], total: 1, page: 9, pageSize: 20 })
        )
      )
    vi.stubGlobal('fetch', fetcher)
    await expect(
      fetchEcosystem('connector', '', 1, new AbortController().signal)
    ).rejects.toThrow('无效的资源分类响应')
    await expect(
      fetchEcosystem('connector', '', 1, new AbortController().signal)
    ).rejects.toThrow('无效的资源分页响应')
  })
})
