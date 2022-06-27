const pfReactIconsMapper = {
  IconSize: '@patternfly/react-icons/dist/js/createIcon',
};

module.exports = {
  presets: [['@babel/preset-env', {
    targets: {
      browsers: '> 0.25%, not dead',
      // As of Nov 2021, we have Node 12 in CI.  Most people have newer (14-16) locally,
      // could use 'current' but prefer testing exactly same code locally as on CI.
      node: '12',
    },
  }], '@babel/preset-react'],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-object-assign',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-transform-modules-commonjs',
    'transform-class-properties',
    'istanbul',
    [
      'transform-imports',
      {
        '@patternfly/react-icons': {
          transform: importName => pfReactIconsMapper[importName] || `@patternfly/react-icons/dist/js/icons/${importName
            .split(/(?=[A-Z])/)
            .join('-')
            .toLowerCase()}`,
          preventFullImport: true,
        },
      },
      'react-icons',
    ],
    ['@babel/plugin-transform-runtime',
      {
        regenerator: true,
      },
    ]
  ],
};
