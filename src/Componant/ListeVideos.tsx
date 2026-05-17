import { useState, useEffect } from "react";
import Container from "./Container";
import Banniere from "./Banniere";
import { api, mediaUrl, type Video } from "../lib/api";

function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function getEmbedUrl(url: string | null): string | null {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`;
  return null;
}

const PlayIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="26" cy="26" r="26" fill="rgba(0,0,0,0.55)" />
    <path d="M21 17l16 9-16 9V17z" fill="white" />
  </svg>
);

export default function ListeVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Video | null>(null);

  useEffect(() => {
    api.videos()
      .then(setVideos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const embedUrl = active ? getEmbedUrl(active.video_url) : null;
  const fileUrl = active ? mediaUrl(active.video_file) : null;
  const canPlay = active ? (!!embedUrl || (!!fileUrl && !!active.free)) : false;

  return (
    <section className="w-full py-6">
      <Container>
        <Banniere page="video" />
      </Container>

      <Container>
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-video bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        )}

        {!loading && videos.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-16">
            Aucune vidéo disponible pour le moment.
          </p>
        )}

        {!loading && videos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {videos.map((video) => (
              <div
                key={video.id}
                className="group cursor-pointer"
                onClick={() => setActive(video)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-900 overflow-hidden rounded-sm">
                  {mediaUrl(video.thumbnail) ? (
                    <img
                      src={mediaUrl(video.thumbnail)!}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800" />
                  )}

                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                    <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                      <PlayIcon />
                    </div>
                  </div>

                  {/* Duration badge */}
                  {video.duration != null && (
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[11px] px-1.5 py-0.5 rounded">
                      {formatDuration(video.duration)}
                    </span>
                  )}

                  {/* Premium badge */}
                  {!video.free && (
                    <span className="absolute top-2 left-2 bg-[#00bcd4] text-white text-[11px] font-bold px-2 py-0.5 rounded-sm">
                      Premium
                    </span>
                  )}
                </div>

                {/* Meta */}
                <div className="mt-2.5">
                  {video.category && (
                    <p className="text-[11px] text-[#00bcd4] font-bold uppercase tracking-wider mb-1">
                      {video.category}
                    </p>
                  )}
                  <h3 className="font-bold text-[14px] sm:text-[15px] lg:text-[16px] text-gray-900 line-clamp-2 leading-snug">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-[13px] text-gray-500 mt-1 line-clamp-2">{video.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>

      {/* Modal player */}
      {active && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setActive(null)}
        >
          <div className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActive(null)}
              className="absolute -top-9 right-0 text-white text-sm font-medium hover:text-gray-300 transition-colors"
            >
              ✕ Fermer
            </button>

            {/* Player */}
            <div className="aspect-video bg-black">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : fileUrl && active.free ? (
                <video src={fileUrl} controls autoPlay className="w-full h-full" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gray-900 text-white p-8 text-center">
                  <p className="font-bold text-[18px] sm:text-[20px]">Contenu Premium</p>
                  <p className="text-gray-400 text-[14px]">Achetez cette vidéo pour y accéder.</p>
                  <a
                    href={`/paiement?type=video&id=${active.id}`}
                    className="bg-[#00bcd4] hover:bg-[#00acc1] text-white font-bold px-6 py-2.5 rounded-sm transition-colors text-[15px]"
                  >
                    Acheter
                  </a>
                </div>
              )}
            </div>

            {/* Info bar */}
            <div className="bg-gray-900 text-white px-4 py-3">
              <h2 className="font-bold text-[15px] sm:text-[17px] line-clamp-1">{active.title}</h2>
              {active.description && (
                <p className="text-gray-400 text-[13px] mt-0.5 line-clamp-2">{active.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
