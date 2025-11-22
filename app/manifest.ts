import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NotreColoc",
    short_name: "NotreColoc",
    start_url: "/accueil",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#10b981",
    description: "L’application moderne pour orchestrer la vie en colocation.",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
