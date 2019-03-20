const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');

module.exports = function override(config, env) {
    config = injectBabelPlugin(
        ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }], // change importing css to less
        config,
    );
    config = rewireLess.withLoaderOptions({
        modifyVars: {
            '@ant-prefix': 'ant',
            '@font-family': 'monospace, Roboto, sans-serif;' // Change font at Layout.css
        },
        javascriptEnabled: true,
    })(config, env);
    return config;
};