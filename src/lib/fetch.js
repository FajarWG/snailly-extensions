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
  // let token =
  //   "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMxNTMzNmQyLWJlNmMtNDcwOS05OGVhLWE3ZjBlOTZhNTAzMiIsImVtYWlsIjoiZmFqYXJ3Z0BnbWFpbC5jb20iLCJuYW1lIjoiRmFqYXJXRyIsImlhdCI6MTczMzA5Nzk0NywiZXhwIjoxNzMzMTg0MzQ3fQ.RdxVbuC8QTSUHKzBU2MMNluWP1z8_seUiWhs_0x3FmCrwN8gM2VWpBHocdK5hMrzdGvlwWtzw9zmaEQOQhY82mwxj67muXPij2xPS9IU-2qZ5P_LSpNuw5ntfu-CeWecLZYVlPc9Zf8v3Mcui_Q734Py9kuaOx7r43rwMKbZMSc";
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
