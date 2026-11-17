/** Short reference the guest can quote, e.g. "MDZ-4821". Not unique until bookings have a database. */
export function makeReference() {
  const buf = new Uint32Array(1);
  globalThis.crypto.getRandomValues(buf);
  return `MDZ-${1000 + (buf[0] % 9000)}`;
}
