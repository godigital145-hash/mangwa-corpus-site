import { defineMiddleware } from 'astro:middleware'

const ADMIN_PASSWORD = "admin1234"

export const onRequest = defineMiddleware((ctx, next) => {
  const path = ctx.url.pathname

  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    const token = ctx.cookies.get('admin_token')?.value
    const secret = ADMIN_PASSWORD //import.meta.env.ADMIN_SECRET

    if (!secret || !token || token !== secret) {
      return ctx.redirect('/admin/login')
    }
  }

  return next()
})
