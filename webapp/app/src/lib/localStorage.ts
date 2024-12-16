export const localStorageMiddleware = ({
  getState,
}: {
  getState: () => any; // eslint-disable-line
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (next: any) => (action: any) => {
    if (typeof window !== "undefined") {
      const result = next(action);
      window.localStorage?.setItem("chatState", JSON.stringify(getState()));
      return result;
    }
  };
};
export const loadState = () => {
  if (typeof window !== "undefined") {
    const serialState = window.localStorage?.getItem("chatState");
    if (serialState !== null) {
      return JSON.parse(serialState);
    }
  }
};
