const BASE_URL = "https://snailly.unikom.ac.id";

export const fetcher = async (url, options) => {
  const response = await fetch(BASE_URL + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }

  return response.json();
};

export const fetcherWithToken = async (url, options) => {
  let token;
  chrome.storage.local.get(["token"], (result) => {
    token = result.token;
  });

  if (!token) {
    throw new Error("Token not found.");
  }

  const response = await fetch(BASE_URL + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }

  return response.json();
};
