import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware((ctx, next) => {
  const path = ctx.url.pathname

  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    const token = ctx.cookies.get('admin_token')?.value
    const secret = import.meta.env.ADMIN_SECRET

    if (!secret || !token || token !== secret) {
      return ctx.redirect('/admin/login')
    }
  }

  return next()
})
