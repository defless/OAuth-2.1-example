import fetch from 'node-fetch';

export const request = (server, opts) => fetch(`http://localhost:${server.address().port + opts.url}`, {
  ...opts,
  headers: {
    'Content-Type': 'application/json',
    ...opts.headers,
  },
});

export const get = (server, opts) => request(server, {
  ...opts,
  method: 'GET',
});

export const post = (server, opts) => request(server, {
  ...opts,
  method: 'POST',
});

export const put = (server, opts) => request(server, {
  ...opts,
  method: 'PUT',
});

export const remove = (server, opts) => request(server, {
  ...opts,
  method: 'DELETE',
});
