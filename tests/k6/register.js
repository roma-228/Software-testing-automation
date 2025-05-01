// import http from 'k6/http';
// import { check, sleep } from 'k6';

// export const options = {
//     vus: 250, // 10 віртуальних користувачів
//     duration: '15s', // тест триватиме 30 секунд
// };

// export default function () {
//     const res = http.get('http://localhost:3000/api/posts');

//     check(res, {
//         'status is 200': (r) => r.status === 200,
//         'response time < 500ms': (r) => r.timings.duration < 500,
//     });

//     sleep(1);
// }

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,
  duration: '30s',
};

export default function () {
  const url = 'http://localhost:3000/api/auth/register';

  const payload = JSON.stringify({
    email: `test${__VU}_${__ITER}@gmail.com`,
    username: `test${__VU}${__ITER}`,
    password: 'test123',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 201': (r) => r.status === 201,
    'response has message': (r) => JSON.parse(r.body).message === 'User registered successfully',
  });

  sleep(1);
}