export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let res = await env.ASSETS.fetch(request);
    if (res.status === 404 && !url.pathname.includes('.')) {
      res = await env.ASSETS.fetch(new Request(new URL('/index.html', request.url), request));
    }
    return res;
  },
};
