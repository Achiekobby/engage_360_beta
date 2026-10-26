export async function publishReward(reward) {
  const response = await fetch('/api/published-rewards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reward),
  });
  if (!response.ok) {
    let message = 'The recipient shop could not be updated. Refresh and try again.';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      /* keep the fallback */
    }
    throw new Error(message);
  }
  return response.json();
}
