/**
 * Retry Helper - Exponential Backoff für API-Calls
 */

/**
 * Sleep-Funktion für Delays
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Exponential Backoff Retry-Logic
 * 
 * @param {Function} fn - Async function to retry
 * @param {Object} options - Retry options
 * @returns {Promise} Result of fn
 */
export async function retryWithBackoff(fn, options = {}) {
  const {
    maxAttempts = parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS) || 3,
    initialDelay = parseInt(import.meta.env.VITE_API_RETRY_DELAY) || 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    retryableErrors = [408, 429, 500, 502, 503, 504]
  } = options;

  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Prüfe ob Fehler retryable ist
      const status = error.response?.status;
      const isRetryable = retryableErrors.includes(status) || error.code === 'ECONNABORTED';
      
      if (!isRetryable || attempt === maxAttempts) {
        throw error;
      }
      
      // Berechne Delay mit Exponential Backoff
      const delay = Math.min(initialDelay * Math.pow(backoffFactor, attempt - 1), maxDelay);
      
      console.log(`Retry attempt ${attempt}/${maxAttempts} after ${delay}ms (Status: ${status})`);
      
      await sleep(delay);
    }
  }
  
  throw lastError;
}

/**
 * Prüfe ob ein Fehler retryable ist
 */
export function isRetryableError(error) {
  const retryableStatuses = [408, 429, 500, 502, 503, 504];
  const status = error.response?.status;
  
  return retryableStatuses.includes(status) || 
         error.code === 'ECONNABORTED' ||
         error.code === 'ETIMEDOUT' ||
         error.message?.includes('timeout');
}

/**
 * Wrapper für Axios-Requests mit Retry
 */
export function withRetry(axiosInstance) {
  // Interceptor für automatische Retries
  axiosInstance.interceptors.response.use(
    response => response,
    async error => {
      const config = error.config;
      
      // Verhindere unendliche Loops
      if (!config || config.__retryCount >= 3) {
        return Promise.reject(error);
      }
      
      config.__retryCount = config.__retryCount || 0;
      
      if (isRetryableError(error)) {
        config.__retryCount += 1;
        
        const delay = 1000 * Math.pow(2, config.__retryCount - 1);
        
        console.log(`Auto-retry ${config.__retryCount}/3 after ${delay}ms`);
        
        await sleep(delay);
        
        return axiosInstance(config);
      }
      
      return Promise.reject(error);
    }
  );
  
  return axiosInstance;
}

