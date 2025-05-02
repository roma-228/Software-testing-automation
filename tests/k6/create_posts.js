/* eslint-disable */
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '20s',
};

export default function () {
  const url = 'http://localhost:3000/api/posts';

  const payload = JSON.stringify({
    title: `Title ${__ITER}`,
    content: `Content body ${__ITER}`,
    email: 'D3@gmail.com',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 201': (r) => r.status === 201,
    'post created': (r) => JSON.parse(r.body).message === 'Post created successfully',
  });

  sleep(1);
}