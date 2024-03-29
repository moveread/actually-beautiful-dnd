function find<T>(xs: T[], pred: (x: T) => boolean) {
  return xs.find(pred)
}
const supportedEventName: string = ((): string => {
  const base: string = 'visibilitychange';

  // Server side rendering
  if (typeof document === 'undefined') {
    return base;
  }

  // See https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
  const candidates: string[] = [
    base,
    `ms${base}`,
    `webkit${base}`,
    `moz${base}`,
    `o${base}`,
  ];

  const supported = find(
    candidates,
    (eventName: string): boolean => `on${eventName}` in document,
  );

  return supported || base;
})();

export default supportedEventName;
