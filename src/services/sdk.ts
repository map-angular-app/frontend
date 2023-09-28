import axios from 'axios';
import { environment } from 'src/environments/environment';

const PREFIX = environment.prefix ?? 'api';
const BASE_API_URL = environment.apiBaseUrl ?? 'http://localhost:8000';

export const sdk = axios.create({
  baseURL: `${BASE_API_URL}${PREFIX}`,
  headers: {},
});
