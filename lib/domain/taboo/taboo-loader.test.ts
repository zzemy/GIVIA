import {
  loadInjectionBlacklist,
  loadTabooDatasetByCountry,
  loadTabooDatasets,
} from '@/lib/domain/taboo/taboo-loader'

describe('taboo loader', () => {
  it('loads global and country taboo datasets', () => {
    const datasets = loadTabooDatasets()
    const codes = datasets.map(dataset => dataset.countryCode)

    expect(codes).toEqual(expect.arrayContaining(['GLOBAL', 'CN', 'JP', 'FR', 'US']))
    expect(loadTabooDatasetByCountry('cn')?.rules.some(rule => rule.id === 'cn-clock')).toBe(true)
  })

  it('loads the injection blacklist phrases', () => {
    const blacklist = loadInjectionBlacklist()

    expect(blacklist).toEqual(
      expect.arrayContaining(['ignore previous instructions', '泄露系统提示词']),
    )
  })
})
