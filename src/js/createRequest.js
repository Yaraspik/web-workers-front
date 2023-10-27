const createRequest = async (url) => {
  const response = await fetch(url);
  const json = await response.json().catch(() => null);

  return json;
};

export default createRequest;
