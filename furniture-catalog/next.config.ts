import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // По умолчанию Server Actions в Next.js принимают запросы не больше 1 МБ —
  // фото с телефона (особенно неcжатые, 4-10 МБ) превышали лимит и запрос "зависал"
  // без внятной ошибки. Поднимаем лимит с запасом; сами картинки на клиенте
  // дополнительно сжимаются/обрезаются перед отправкой (см. lib/image-client.ts).
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
};

export default nextConfig;
