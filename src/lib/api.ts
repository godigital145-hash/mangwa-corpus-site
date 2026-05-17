const API_URL = 'https://serveur.mangwacorpus.com'

export function mediaUrl(key: string | null | undefined): string | null {
  if (!key) return null
  return `${API_URL}/api/media/${key}`
}

export type Magazine = {
  id: number
  title: string
  subtitle: string | null
  cover: string | null
  description: string | null
  issue_number: number | null
  category: string | null
  published_at: string | null
  featured: number
  price: number | null
  pdf_file: string | null
  pdf_preview: string | null
  preview_start_page: number | null
  pages: number | null
  created_at: string
  updated_at: string
}

export type Audio = {
  id: number
  title: string
  artist: string
  cover: string | null
  audio_file: string | null
  description: string | null
  genre: string | null
  duration: number | null
  published_at: string | null
  featured: number
  price: number | null
  free: number
  album: string | null
  album_id: number | null
  lyrics: string | null
  waveform: string | null
  preview_start: number | null
  preview_end: number | null
  created_at: string
  updated_at: string
}

export type Video = {
  id: number
  title: string
  thumbnail: string | null
  video_url: string | null
  video_file: string | null
  description: string | null
  category: string | null
  duration: number | null
  published_at: string | null
  featured: number
  free: number
  created_at: string
  updated_at: string
}

export type HeroSection = {
  id: number
  page: string
  title: string
  subtitle: string | null
  image_desktop: string | null
  image_tablet: string | null
  image_mobile: string | null
  cta_label: string | null
  cta_url: string | null
  active: number
  display_order: number
  created_at: string
  updated_at: string
}

export type MediaFile = {
  id: number
  key: string
  filename: string
  content_type: string | null
  size: number | null
  folder: string | null
  created_at: string
}

export type User = {
  id: number
  name: string
  email: string
  role: string
  active: number
  created_at: string
}

export type NewsletterSubscriber = {
  id: number
  email: string
  name: string | null
  active: number
  subscribed_at: string
}

export type PaymentMethod = {
  id: number
  name: string
  type: string
  active: number
  created_at: string
}

export type Payment = {
  id: number
  amount: number
  currency: string
  status: string
  reference: string | null
  entity_type: string | null
  entity_id: number | null
  created_at: string
  user_name: string | null
  user_email: string | null
  method_name: string | null
}

export type Album = {
  id: number
  title: string
  artist: string | null
  cover: string | null
  description: string | null
  genre: string | null
  published_at: string | null
  featured: number
  price: number | null
  free: number
  created_at: string
  updated_at: string
}

export type AlbumTrack = {
  audio_id: number
  track_order: number
  title: string
  artist: string | null
  cover: string | null
  audio_file: string | null
  duration: number | null
  free: number
  price: number | null
  preview_start: number | null
  preview_end: number | null
}

export type ActivityEntry = {
  id: number
  action: 'create' | 'update' | 'delete'
  entity_type: 'magazine' | 'audio' | 'video' | 'media' | 'hero'
  entity_id: number | null
  entity_name: string | null
  entity_image: string | null
  created_at: string
}

export const api = {
  magazines: (): Promise<Magazine[]> =>
    fetch(`${API_URL}/api/magazines`).then((r) => r.json()),
  magazine: (id: string): Promise<Magazine> =>
    fetch(`${API_URL}/api/magazines/${id}`).then((r) => r.json()),
  audios: (): Promise<Audio[]> =>
    fetch(`${API_URL}/api/audios`).then((r) => r.json()),
  audio: (id: string): Promise<Audio> =>
    fetch(`${API_URL}/api/audios/${id}`).then((r) => r.json()),
  videos: (): Promise<Video[]> =>
    fetch(`${API_URL}/api/videos`).then((r) => r.json()),
  hero: (page?: string): Promise<HeroSection[]> =>
    fetch(`${API_URL}/api/hero${page ? `?page=${encodeURIComponent(page)}` : ''}`).then((r) => r.json()),
  media: (): Promise<MediaFile[]> =>
    fetch(`${API_URL}/api/media`).then((r) => r.json()),
  albums: (): Promise<Album[]> =>
    fetch(`${API_URL}/api/albums`).then((r) => r.json()),
  album: (id: string): Promise<Album & { tracks: AlbumTrack[] }> =>
    fetch(`${API_URL}/api/albums/${id}`).then((r) => r.json()),
  audioAlbum: (audioId: string): Promise<(Album & { tracks: Audio[] }) | null> =>
    fetch(`${API_URL}/api/audios/${audioId}/album`).then((r) => r.json()),
}

export function adminApi(token: string) {
  const auth = { Authorization: `Bearer ${token}` }
  return {
    magazines: {
      create: (form: FormData) =>
        fetch(`${API_URL}/admin/magazines`, { method: 'POST', headers: auth, body: form }),
      update: (id: number, form: FormData) =>
        fetch(`${API_URL}/admin/magazines/${id}`, { method: 'PUT', headers: auth, body: form }),
      delete: (id: number) =>
        fetch(`${API_URL}/admin/magazines/${id}`, { method: 'DELETE', headers: auth }),
    },
    audios: {
      create: (form: FormData) =>
        fetch(`${API_URL}/admin/audios`, { method: 'POST', headers: auth, body: form }),
      update: (id: number, form: FormData) =>
        fetch(`${API_URL}/admin/audios/${id}`, { method: 'PUT', headers: auth, body: form }),
      delete: (id: number) =>
        fetch(`${API_URL}/admin/audios/${id}`, { method: 'DELETE', headers: auth }),
    },
    videos: {
      create: (form: FormData) =>
        fetch(`${API_URL}/admin/videos`, { method: 'POST', headers: auth, body: form }),
      update: (id: number, form: FormData) =>
        fetch(`${API_URL}/admin/videos/${id}`, { method: 'PUT', headers: auth, body: form }),
      delete: (id: number) =>
        fetch(`${API_URL}/admin/videos/${id}`, { method: 'DELETE', headers: auth }),
    },
    hero: {
      create: (form: FormData) =>
        fetch(`${API_URL}/admin/hero`, { method: 'POST', headers: auth, body: form }),
      update: (id: number, form: FormData) =>
        fetch(`${API_URL}/admin/hero/${id}`, { method: 'PUT', headers: auth, body: form }),
      delete: (id: number) =>
        fetch(`${API_URL}/admin/hero/${id}`, { method: 'DELETE', headers: auth }),
    },
    albums: {
      create: (form: FormData) =>
        fetch(`${API_URL}/admin/albums`, { method: 'POST', headers: auth, body: form }),
      update: (id: number, form: FormData) =>
        fetch(`${API_URL}/admin/albums/${id}`, { method: 'PUT', headers: auth, body: form }),
      delete: (id: number) =>
        fetch(`${API_URL}/admin/albums/${id}`, { method: 'DELETE', headers: auth }),
      tracks: (id: number): Promise<AlbumTrack[]> =>
        fetch(`${API_URL}/admin/albums/${id}/tracks`, { headers: auth }).then((r) => r.json()),
      setTracks: (id: number, tracks: { audio_id: number; track_order: number }[]) =>
        fetch(`${API_URL}/admin/albums/${id}/tracks`, {
          method: 'PUT',
          headers: { ...auth, 'Content-Type': 'application/json' },
          body: JSON.stringify({ tracks }),
        }),
    },
    media: {
      upload: (form: FormData) =>
        fetch(`${API_URL}/admin/media`, { method: 'POST', headers: auth, body: form }),
      delete: (key: string) =>
        fetch(`${API_URL}/admin/media/${key}`, { method: 'DELETE', headers: auth }),
    },
    activity: {
      list: (limit = 30): Promise<ActivityEntry[]> =>
        fetch(`${API_URL}/admin/activity?limit=${limit}`, { headers: auth }).then((r) => r.json()),
    },
    users: {
      list: (): Promise<User[]> =>
        fetch(`${API_URL}/admin/users`, { headers: auth }).then((r) => r.json()),
      create: (data: { name: string; email: string; role?: string }) =>
        fetch(`${API_URL}/admin/users`, { method: 'POST', headers: { ...auth, 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
      update: (id: number, data: Partial<User>) =>
        fetch(`${API_URL}/admin/users/${id}`, { method: 'PUT', headers: { ...auth, 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
      delete: (id: number) =>
        fetch(`${API_URL}/admin/users/${id}`, { method: 'DELETE', headers: auth }),
    },
    newsletter: {
      list: (): Promise<NewsletterSubscriber[]> =>
        fetch(`${API_URL}/admin/newsletter`, { headers: auth }).then((r) => r.json()),
      toggle: (id: number, active: number) =>
        fetch(`${API_URL}/admin/newsletter/${id}`, { method: 'PUT', headers: { ...auth, 'Content-Type': 'application/json' }, body: JSON.stringify({ active }) }),
      delete: (id: number) =>
        fetch(`${API_URL}/admin/newsletter/${id}`, { method: 'DELETE', headers: auth }),
    },
    paymentMethods: {
      list: (): Promise<PaymentMethod[]> =>
        fetch(`${API_URL}/admin/payment-methods`, { headers: auth }).then((r) => r.json()),
      create: (data: { name: string; type?: string }) =>
        fetch(`${API_URL}/admin/payment-methods`, { method: 'POST', headers: { ...auth, 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
      update: (id: number, data: Partial<PaymentMethod>) =>
        fetch(`${API_URL}/admin/payment-methods/${id}`, { method: 'PUT', headers: { ...auth, 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
      delete: (id: number) =>
        fetch(`${API_URL}/admin/payment-methods/${id}`, { method: 'DELETE', headers: auth }),
    },
    payments: {
      list: (page = 1): Promise<Payment[]> =>
        fetch(`${API_URL}/admin/payments?page=${page}`, { headers: auth }).then((r) => r.json()),
      updateStatus: (id: number, status: string) =>
        fetch(`${API_URL}/admin/payments/${id}`, { method: 'PUT', headers: { ...auth, 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }),
      delete: (id: number) =>
        fetch(`${API_URL}/admin/payments/${id}`, { method: 'DELETE', headers: auth }),
    },
    audiosUpload: {
      create: (form: FormData, onProgress: (pct: number) => void) =>
        xhrUpload(`${API_URL}/admin/audios`, 'POST', form, onProgress),
      update: (id: number, form: FormData, onProgress: (pct: number) => void) =>
        xhrUpload(`${API_URL}/admin/audios/${id}`, 'PUT', form, onProgress),
    },
    magazinesUpload: {
      create: (form: FormData, onProgress: (pct: number) => void) =>
        xhrUpload(`${API_URL}/admin/magazines`, 'POST', form, onProgress),
      update: (id: number, form: FormData, onProgress: (pct: number) => void) =>
        xhrUpload(`${API_URL}/admin/magazines/${id}`, 'PUT', form, onProgress),
    },
    mediaUpload: {
      upload: (form: FormData, onProgress: (pct: number) => void) =>
        xhrUpload(`${API_URL}/admin/media`, 'POST', form, onProgress),
    },
    albumsUpload: {
      create: (form: FormData, onProgress: (pct: number) => void) =>
        xhrUpload(`${API_URL}/admin/albums`, 'POST', form, onProgress),
      update: (id: number, form: FormData, onProgress: (pct: number) => void) =>
        xhrUpload(`${API_URL}/admin/albums/${id}`, 'PUT', form, onProgress),
    },
  }

  function xhrUpload(url: string, method: 'POST' | 'PUT', form: FormData, onProgress: (pct: number) => void): Promise<Response> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () => resolve(new Response(xhr.responseText, { status: xhr.status }));
      xhr.onerror = () => reject(new Error('Erreur réseau'));
      xhr.send(form);
    });
  }
}
