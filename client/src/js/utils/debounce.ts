function debounce(fn: (e: Event) => void, ms: number): (e: Event) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return function (this: unknown, e: Event): void {
    const fnCall = () => {
      fn.call(this, e);
    };

    clearTimeout(timeout);
    timeout = setTimeout(fnCall, ms);
  };
}

export default debounce;
