//process.env.NODE_ENV = "production"

let BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin

module.exports = (craConfig, configType) => {
  // configType has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.

  console.log('customize webpack config')

  craConfig.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: "report.html",
    })
  )


  // Return the altered config
  return craConfig
}
