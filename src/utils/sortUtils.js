export const sortByKey = (list, key, order = 'asc') => {
  return [...list].sort((a, b) => {
    const valA = a[key] || '';
    const valB = b[key] || '';
    if (order === 'asc') return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });
};
