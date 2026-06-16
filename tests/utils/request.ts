declare interface RequestOptions {
  body?: Record<string, any>;
  headers?: Record<string, any>;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

let baseUrl = 'http://localhost:3000';

export const setBaseUrl = (url: string) => {
  baseUrl = url;
};

const request = async (url: string, opts: RequestOptions): Promise<any> => {
  const fetchOpts: RequestInit = {
    method: opts.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...opts.headers,
    },
  };

  if (opts.body && opts.method !== 'GET') {
    fetchOpts.body = JSON.stringify(opts.body);
  }

  const res = await fetch(`${baseUrl}${url}`, fetchOpts);

  if (!res.ok) {
    return res.json().catch(() => ({ status: res.status }));
  }

  return res.json();
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
