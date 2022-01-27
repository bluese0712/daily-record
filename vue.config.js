const merge = require('webpack-merge');
const tsImportPluginFactory = require('ts-import-plugin');

module.exports = {
    lintOnSave: true,
    // publicPath: './',
    // parallel: false,
    chainWebpack: config => {
        config.module
            .rule('ts')
            .use('ts-loader')
            .tap(options => {
                options = merge(options, {
                    happyPackMode: true,
                    transpileOnly: true,
                    getCustomTransformers: () => ({
                        before: [
                            tsImportPluginFactory({
                                libraryName: 'vant',
                                libraryDirectory: 'es',
                                style: true
                            })
                        ]
                    }),
                    compilerOptions: {
                        module: 'es2015'
                    }
                });
                return options;
            });
    },
    devServer: {
        proxy: 'http://127.0.0.1:8000'
    }
};
