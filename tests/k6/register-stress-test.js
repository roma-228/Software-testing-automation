import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
  ],
};

function generateUserData() {
  const randomSuffix = Math.floor(Math.random() * 100000);
  return {
    username: `user${randomSuffix}`,
    email: `user${randomSuffix}@example.com`,
    password: 'Password123!',
  };
}

export default function () {
  const userData = generateUserData();

  const res = http.post('http://localhost:3000/api/auth/register', JSON.stringify(userData), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, {
    'Статус 200 або 201': (r) => r.status === 200 || r.status === 201,
    'Містить ID користувача': (r) => r.body && r.body.includes('id'),
  });

  sleep(1);
}
