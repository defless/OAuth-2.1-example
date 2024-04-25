declare interface RequestOptions {
  body?: Record<string, any>;
  headers?: Record<string, any>;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

const request = async (url: string, opts: RequestOptions) => {
  const request = await fetch(`http://localhost:3000${url}`, {
    ...opts,
    body: JSON.stringify(opts.body),
    headers: {
      'Content-Type': 'application/json',
      ...opts.headers,
    },
  });
  return await request.json();
};

export const get = (url: string, opts?: RequestOptions) => request(url, {
  ...opts,
  method: 'GET',
});

export const post = (url: string, opts?: RequestOptions) => request(url, {
  ...opts,
  method: 'POST',
});

export const put = (url: string, opts?: RequestOptions) => request(url, {
  ...opts,
  method: 'PUT',
});

export const remove = (url: string, opts?: RequestOptions) => request(url, {
  ...opts,
  method: 'DELETE',
});
