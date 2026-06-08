import { useEffect, useState } from "react";
import { api, mediaUrl, type Video } from "../lib/api";

function getEmbedUrl(url: string | null): string | null {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

export default function VideoDetail({ id }: { id: string }) {
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.video(id).then(setVideo).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="aspect-video bg-gray-100 animate-pulse rounded" />;
  }

  if (!video) {
    return <p className="text-gray-400 text-sm text-center py-16">Vidéo introuvable.</p>;
  }

  const embedUrl = getEmbedUrl(video.video_url);
  const fileUrl = mediaUrl(video.video_file);

  return (
    <div className="flex flex-col gap-6">
      <div className="aspect-video bg-black">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : fileUrl && video.free ? (
          <video src={fileUrl} controls className="w-full h-full" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gray-900 text-white p-8 text-center">
            <p className="font-bold text-[18px] sm:text-[20px]">Contenu Premium</p>
            <p className="text-gray-400 text-[14px]">Achetez cette vidéo pour y accéder.</p>
            <a
              href={`/paiement?type=video&id=${video.id}`}
              className="bg-[#00bcd4] hover:bg-[#00acc1] text-white font-bold px-6 py-2.5 rounded-sm transition-colors text-[15px]"
            >
              Acheter
            </a>
          </div>
        )}
      </div>

      <div>
        {video.category && (
          <p className="text-[11px] sm:text-[13px] text-[#00bcd4] font-bold uppercase tracking-wider mb-2">
            {video.category}
          </p>
        )}
        <h1 className="font-bold text-[20px] sm:text-[24px] lg:text-[28px] text-gray-900 leading-snug">
          {video.title}
        </h1>
        {video.description && (
          <p className="text-[13px] sm:text-[14px] lg:text-[16px] text-gray-600 mt-3 whitespace-pre-line">
            {video.description}
          </p>
        )}
      </div>
    </div>
  );
}
