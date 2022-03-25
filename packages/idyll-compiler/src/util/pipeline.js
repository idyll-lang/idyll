export default function pipeline(...operations) {
  operations = operations.flat();
  return async function(input, ...args) {
    let result = input;
    for (const op of operations) {
      result = await op(result, ...args);
    }
    return result;
  };
}
