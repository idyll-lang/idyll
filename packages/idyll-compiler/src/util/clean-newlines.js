export default function cleanNewlines(input) {
  return input.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}
