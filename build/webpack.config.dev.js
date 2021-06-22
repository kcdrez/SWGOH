'use strict'

const webpack = require('webpack');
const jquery = require('jquery');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: [
    './src/app.js'
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devServer: {
    hot: true,
    watchOptions: {
      poll: true
    }
  },  
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      // {
      // 	test: /\.css$/,
      // 	use: [
      // 		'css-loader', 'vue-style-loader'
      // 	]
      // },
      {
      	test: /\.scss$/,
      	use: [ 'vue-style-loader', 'css-loader', 
      		{
      			loader: 'sass-loader',
      			options: { 
      				// sassOptions: { indentedSyntax: true },
      				// prependData: 'src/styles/variables.scss'
      			}
      		}
    		]
      },
      {    
      	test: /\.css$/,    
      	use: ['style-loader','css-loader']  
      },  
      {    
      	test: /\.png$/,    
      	use: "url-loader?limit=100000"  
      },  
      {     
      	test: /\.jpg$/,     
      	use: "file-loader"  
      }, 
      {    
      	test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,    
      	use: 'url-loader?limit=10000&mimetype=application/font-woff'  
      },  
      {     
      	test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,     
      	use: 'url-loader?limit=10000&mimetype=application/octet-stream'  
      },  
    	{     
    		test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,     
    		use: 'file-loader'  
    	},  
    	{    
    		test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    
    		use: 'url-loader?limit=10000&mimetype=image/svg+xml'  
    	}
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jquery: 'jquery'
    })
  ]
}