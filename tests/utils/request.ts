declare interface RequestOptions {
  url: string;
  body?: Record<string, any>;
  headers?: Record<string, any>;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

const request = async (opts: RequestOptions) => {
  const request = await fetch('http://localhost:3000' + opts.url, {
    ...opts,
    body: JSON.stringify(opts.body),
    headers: {
      'Content-Type': 'application/json',
      ...opts.headers,
    },
  });
  return await request.json();
};

export const get = (opts: RequestOptions) => request({
  ...opts,
  method: 'GET',
});

export const post = (opts: RequestOptions) => request({
  ...opts,
  method: 'POST',
});

export const put = (opts: RequestOptions) => request({
  ...opts,
  method: 'PUT',
});

export const remove = (opts: RequestOptions) => request({
  ...opts,
  method: 'DELETE',
});
