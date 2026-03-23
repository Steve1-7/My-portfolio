const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  outputFileTracingExcludes: {
    '*': ['node_modules/**'],
  },

  output: "standalone",
};

module.exports = nextConfig;