const nextConfig = {
  outputFileTracingExcludes: {
    '*': ['node_modules/**'],
  },

  output: "standalone",
};

module.exports = nextConfig;