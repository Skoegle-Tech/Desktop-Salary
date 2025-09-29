const serverUrl =
  import.meta.env.VITE_ENV === "local"
    ? import.meta.env.VITE_LOCAL_URL
    : import.meta.env.VITE_WEB_URL;

export const apiUrl = `http://52.66.43.15:3000/api`;
