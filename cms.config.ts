import { defineConfig, defineFields } from '@geniusofdigital/astro-cms/config'

export default defineConfig({
  collections: {
    // ── Magazines ──────────────────────────────────────────────────────────
    magazines: {
      label: 'Magazines',
      slug: 'magazines',
      fields: {
        title: defineFields.text({ label: 'Titre', required: true }),
        subtitle: defineFields.text({ label: 'Sous-titre' }),
        cover: defineFields.media({ label: 'Couverture' }),
        description: defineFields.richtext({ label: 'Description' }),
        issue_number: defineFields.number({ label: 'Numéro', min: 1 }),
        category: defineFields.select(
          ['Culture', 'Musique', 'Littérature', 'Histoire', 'Politique', 'Société'],
          { label: 'Catégorie' }
        ),
        published_at: defineFields.date({ label: 'Date de publication' }),
        featured: defineFields.boolean({ label: 'Mis en avant', defaultValue: false }),
        price: defineFields.number({ label: 'Prix (FCFA)', min: 0 }),
        pdf_file: defineFields.media({ label: 'Fichier PDF' }),
        pages: defineFields.number({ label: 'Nombre de pages', min: 1 }),
      },
    },

    // ── Audios ─────────────────────────────────────────────────────────────
    audios: {
      label: 'Audios',
      slug: 'audios',
      fields: {
        title: defineFields.text({ label: 'Titre', required: true }),
        artist: defineFields.text({ label: 'Artiste / Auteur', required: true }),
        cover: defineFields.media({ label: 'Pochette' }),
        audio_file: defineFields.media({ label: 'Fichier audio' }),
        description: defineFields.richtext({ label: 'Description' }),
        genre: defineFields.select(
          ['Afrobeats', 'Gospel', 'Jazz', 'Traditionnel', 'Spoken Word', 'Podcast', 'Autre'],
          { label: 'Genre' }
        ),
        duration: defineFields.number({ label: 'Durée (secondes)', min: 0 }),
        published_at: defineFields.date({ label: 'Date de publication' }),
        featured: defineFields.boolean({ label: 'Mis en avant', defaultValue: false }),
        price: defineFields.number({ label: 'Prix (FCFA)', min: 0 }),
        free: defineFields.boolean({ label: 'Gratuit', defaultValue: false }),
        album: defineFields.text({ label: 'Album / Compilation' }),
        lyrics: defineFields.media({ label: 'Fichier lyrics (PDF / TXT)' }),
      },
    },

    // ── Vidéos ─────────────────────────────────────────────────────────────
    videos: {
      label: 'Vidéos',
      slug: 'videos',
      fields: {
        title: defineFields.text({ label: 'Titre', required: true }),
        thumbnail: defineFields.media({ label: 'Miniature' }),
        video_url: defineFields.text({ label: 'URL de la vidéo (YouTube / Vimeo)' }),
        video_file: defineFields.media({ label: 'Fichier vidéo' }),
        description: defineFields.richtext({ label: 'Description' }),
        category: defineFields.select(
          ['Documentaire', 'Interview', 'Concert', 'Clip', 'Court-métrage', 'Conférence', 'Autre'],
          { label: 'Catégorie' }
        ),
        duration: defineFields.number({ label: 'Durée (secondes)', min: 0 }),
        published_at: defineFields.date({ label: 'Date de publication' }),
        featured: defineFields.boolean({ label: 'Mis en avant', defaultValue: false }),
        free: defineFields.boolean({ label: 'Gratuit', defaultValue: false }),
      },
    },

    // ── Hero Sections ──────────────────────────────────────────────────────
    hero_sections: {
      label: 'Hero Sections',
      slug: 'hero-sections',
      fields: {
        page: defineFields.select(
          ['home', 'ebook', 'audio', 'video', 'qui-sommes-nous'],
          { label: 'Page', required: true }
        ),
        title: defineFields.text({ label: 'Titre principal', required: true }),
        subtitle: defineFields.text({ label: 'Sous-titre' }),
        background_image: defineFields.media({ label: 'Image de fond' }),
        cta_label: defineFields.text({ label: 'Texte du bouton CTA' }),
        cta_url: defineFields.text({ label: 'Lien du bouton CTA' }),
        active: defineFields.boolean({ label: 'Actif', defaultValue: true }),
        display_order: defineFields.number({ label: 'Ordre d\'affichage', min: 0 }),
      },
    },
  },
})
