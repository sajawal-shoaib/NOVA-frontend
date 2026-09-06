const BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000/api"

export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

/**
 * Every backend response is shaped { success, statusCode, message, data }.
 * This unwraps that envelope, throws an ApiError with the server's own
 * message on failure, and always sends the auth cookie along
 * (credentials: "include") since the backend uses httpOnly cookie auth.
 */
async function request(path, { method = "GET", body, ...rest } = {}) {
  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      credentials: "include",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...rest,
    })
  } catch {
    throw new ApiError("Can't reach the server — check your connection and try again", 0)
  }

  let payload = null
  try {
    payload = await res.json()
  } catch {
    // no JSON body (e.g. a 204) — fine
  }

  if (!res.ok) {
    throw new ApiError(payload?.message || `Request failed (${res.status})`, res.status, payload?.errors)
  }

  return payload
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  delete: (path) => request(path, { method: "DELETE" }),
  /**
   * Multipart upload — used for the image/video upload endpoint. Deliberately
   * bypasses request()'s JSON body handling; the browser sets the correct
   * multipart Content-Type (with boundary) automatically when we pass a
   * FormData body and don't set Content-Type ourselves.
   */
  uploadFile: async (path, file, extraFields = {}) => {
    const formData = new FormData()
    formData.append("file", file)
    Object.entries(extraFields).forEach(([key, value]) => formData.append(key, value))

    let res
    try {
      res = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        credentials: "include",
        body: formData,
      })
    } catch {
      throw new ApiError("Can't reach the server — check your connection and try again", 0)
    }

    let payload = null
    try {
      payload = await res.json()
    } catch {
      // no JSON body — fine
    }

    if (!res.ok) {
      throw new ApiError(payload?.message || `Upload failed (${res.status})`, res.status, payload?.errors)
    }

    return payload
  },
}
