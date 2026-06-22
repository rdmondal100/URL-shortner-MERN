const normalizedBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001/"

export const baseDomain = normalizedBaseUrl.endsWith("/")
	? normalizedBaseUrl
	: `${normalizedBaseUrl}/`
