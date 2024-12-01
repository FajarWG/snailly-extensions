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
  const token =
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIxOTA3MTBmLTNhMzYtNDE0Yy1hNjJlLTRhNzkyN2ZlZWZmZCIsImVtYWlsIjoiZGV2QGdtYWlsLmNvbSIsIm5hbWUiOiJkZXZlbG9wbWVudCIsImlhdCI6MTczMzA1MzgyOSwiZXhwIjoxNzMzMTQwMjI5fQ.JmaqTeTi6viFHCqAU-x96A0T4J0hhRgP9nvdvjxK5YhZ0s_TjNBUe9y8U6Ormu5cZRuWa8ZCB2oSHfgb2pvlT7z99HgUzUSowfWHlli3AGc5R5xxpsXg8GHlG-RMo6RuRxElHZHN8RpDBL7t1-MIztAogqHzMQ5FJUB6PelkPoc";

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
