/**
 * Transforms data to store it in Redux.
 * It creates a kind of index from id property:
 *
 * Input:
 *
 * [{ id: 1, name: Foo }, { id: 2, name: Baz }]
 *
 * Output:
 * {
 *     1: { id: 1, name: Foo },
 *     2: { id: 2, name: Baz }
 * }
 *
 * @param data
 * @param key
 */
export function transform(data: any = [], key = 'id') {
  const entities = {};

  data.forEach((entry: any) => {
    const id = entry[key];

    if (!id) {
      throw new Error(`Possible invalid identifier: ${key}`);
    }

    // @ts-ignore
    entities[entry[key]] = entry;
  });

  return entities;
}
