export const CONFIG = {
  API_ENDPOINT: 'https://api.groq.com/openai/v1/chat/completions',
  getApiKey: () => import.meta.env.VITE_GROQ_API_KEY || '',
  MODEL: 'llama-3.3-70b-versatile',
};

export default CONFIG;
