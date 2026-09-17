module.exports = {
  apps: [
    {
      name: 'nest-v12',
      script: 'dist/main.js',
      instances: 2,
      exec_mode: 'cluster',
      watch: true,
    },
  ],
};
