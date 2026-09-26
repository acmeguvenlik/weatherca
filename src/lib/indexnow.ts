export const INDEXNOW_KEY = 'weatherca9f84b6118d20e40aa86cf5c';
export const INDEXNOW_KEY_LOCATION = `https://weatherca.net/${INDEXNOW_KEY}.txt`;

/**
 * Submits a list of URLs to the global IndexNow API (Bing, Yandex, Seznam, etc.)
 * for instantaneous crawler dispatch.
 */
export async function submitUrlsToIndexNow(urls: string[]): Promise<{ success: boolean; status?: number; error?: string }> {
  if (!urls || urls.length === 0) {
    return { success: false, error: 'URL list cannot be empty' };
  }

  const payload = {
    host: 'weatherca.net',
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: urls.slice(0, 10000), // IndexNow batch maximum
  };

  try {
    const response = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status === 200 || response.status === 202) {
      return { success: true, status: response.status };
    }

    return {
      success: false,
      status: response.status,
      error: `IndexNow API returned HTTP status ${response.status}`,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown network failure communicating with IndexNow',
    };
  }
}
