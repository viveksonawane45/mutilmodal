import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
    cpus: 1
  },
  typescript: {
    ignoreBuildErrors: true
  },
  turbopack: {
    root
  }
};

export default nextConfig;
