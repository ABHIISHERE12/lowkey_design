const rawApiUrl = import.meta.env.VITE_API_URL || '';

// Strip trailing slash so `${API_URL}/auth/login` never becomes `.../api//auth/login`
const API_URL = rawApiUrl.replace(/\/+$/, '');

if (!API_URL) {
  console.warn(
    'VITE_API_URL is not set. For local development use Frontend/frontend/.env with VITE_API_URL=http://localhost:5000/api. For Vercel production set VITE_API_URL=https://lowkey-design.onrender.com/api in Project Environment Variables, then redeploy.'
  );
}

export const apiRequest = async (path, { method = 'GET', body, token } = {}) => {
  if (!API_URL) {
    throw new Error('API base URL is not configured (VITE_API_URL).');
  }

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  const response = await fetch(`${API_URL}${normalizedPath}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }

  return data;
};
