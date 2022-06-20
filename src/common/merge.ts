export const merge = (dest: any, ...src: any[]) => {
  for (const s of src) {
    if (s === dest) continue;
    for (const k of Object.keys(s)) {
      const newVal = s[k];
      if (newVal !== null && newVal !== undefined) {
        dest[k] = newVal;
      }
    }
  }
  return dest;
};
