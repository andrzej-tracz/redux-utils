// eslint-disable-next-line import/no-extraneous-dependencies
import http from 'axios';

http.interceptors.response.use((response: any) => response.data);

// configure your http client

export default http;
