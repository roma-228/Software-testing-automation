import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 30,
  duration: '30s',
};

export default function () {
  const url = 'http://localhost:3000/api/auth/login';

  const payload = JSON.stringify({
    email: 'D3@gmail.com',
    password: '1234',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'contains username': (r) => JSON.parse(r.body).username !== undefined,
  });

  sleep(1);
}