export function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function readApiJson(res) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const error = new Error(data.error || '请求失败，请稍后重试')
    error.status = res.status
    error.payload = data
    throw error
  }
  return data
}

export function getPaywallPayload(error) {
  return error?.payload?.paymentRequired ? error.payload : null
}
