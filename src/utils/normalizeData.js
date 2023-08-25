export default function normalizeData(data) {
  const normalized = Object.keys(data.data).map((key) => {
    return {
      id: key,
      ...data.data[key],
    };
  });
  return normalized;
}
