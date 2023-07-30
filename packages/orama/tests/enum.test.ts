import t from 'tap'
import { ScalarSearchableType, ScalarSearchableValue, create, getByID, insert, insertMultiple, load, remove, save, search, update } from '../src/index.js'

t.test('create should support array of string', async t => {
  const db = await create({
    schema: {
      categoryId: 'enum',
    },
  })

  const c1 = await insert(db, {
    categoryId: 1,
  })
  const [c2, c3, c5] = await insertMultiple(db, [
    { categoryId: 2 },
    { categoryId: 3 },
    { categoryId: "5" },
  ])

  const tests: {value: ScalarSearchableValue, expected: string[] }[] = [
    { value: 1, expected: [c1] },
    { value: 2, expected: [c2] },
    { value: 3, expected: [c3] },
    { value: '5', expected: [c5] },
    { value: 'unknown', expected: [] },
  ]

  for (const { value, expected } of tests) {
    t.test(`search for ${value}`, async t => {
      const result = await search(db, {
        term: '',
        where: {
          categoryId: { eq: value },
        }
      })
      t.equal(result.hits.length, expected.length)
      t.strictSame(result.hits.map(h => h.id), expected)
    })
  }

  

  t.end()
})
