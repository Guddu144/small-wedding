import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
 
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: "http",
        hostname: "https://via.placeholder.com/150/92c952",
       
      },
    ],
  },
};

export default nextConfig;
