export const config = {
  runner: 'local',
  port: 4723,

  specs: ['./tests/exercises/**/*.js'],

  capabilities: [],

  logLevel: 'info',

  framework: 'mocha',
  reporters: ['spec'],

  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },

  services: [
    [
      'appium',
      {
        command: 'appium',
        args: {
          relaxedSecurity: true,
        },
      },
    ],
  ],
};
