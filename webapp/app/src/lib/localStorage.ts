export const localStorageMiddleware = ({
  getState,
}: {
  getState: () => any; // eslint-disable-line
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (next: any) => (action: any) => {
    if (typeof window !== "undefined") {
      const result = next(action);
      localStorage.setItem("chatState", JSON.stringify(getState()));
      return result;
    }
  };
};
export const loadState = () => {
  if (typeof window !== "undefined") {
    const serialState = localStorage.getItem("chatState");
    if (serialState === null) {
      throw new Error("No state in localStorage");
    }
    return JSON.parse(serialState);
  }
};
