/* eslint-disable prefer-destructuring */
export default function (errors: any) {
  const normalized: any = {};

  if (errors && errors.children) {
    Object.keys(errors.children).forEach((key) => {
      try {
        normalized[key] = errors.children[key].errors[0];
        // eslint-disable-next-line no-empty
      } catch {}
    });

    return normalized;
  }

  return null;
}
