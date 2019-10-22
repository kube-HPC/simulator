const removeLast = arr => {
  const [, ...rest] = arr.reverse();
  return rest;
};

export { removeLast };
