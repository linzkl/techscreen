
export const localStorageMiddleware = ({
  getState,
}: {
  getState: () => any; // eslint-disable-line
}) => {
  return (next: any) => (action: any) => { // eslint-disable-line
    const result = next(action);
    localStorage.setItem("chatState", JSON.stringify(getState()));
    return result;
  };
};
export const loadState = () => {
  try {
    const serialState = localStorage.getItem("chatState");
    if (serialState === null) {
      return undefined;
    }
    return JSON.parse(serialState);
  } catch (err) {
    return undefined;
  }
};
