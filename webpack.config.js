var webpack=require('webpack');
var path=require('path');
var HtmlWebpackPlugin=require('html-webpack-plugin')
module.exports={
	// 入口模块
	entry: [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        'react-hot-loader/patch',
        path.join(__dirname, 'app/index.js')
    ],
	// webpack编译的终点,输出文件的路径
	output:{
		path:path.join(__dirname,'/dist/'),
		filename:'[name].js',
		publicPath:'/'
	},
	//  plugin阶段贯穿于webpack的整个编译流程，一般用来做一些优化操作。
	// 碰到比如_这个变量的时候，webpack将从缓存的module中取出underscore模块加载进引用_的文件(compilation.assets)
	plugins:[new HtmlWebpackPlugin({
		template:'./index.tpl.html',
		inject:'body',
		filename:'./index.html'
	}),
	new webpack.optimize.OccurrenceOrderPlugin(),
	new webpack.HotModuleReplacementPlugin(),
	// new webpack.NoErrorsPlugin(), //using new webpack.NoEmitOnErrorsPlugin() install this sentence
	new webpack.NoEmitOnErrorsPlugin(),
	new webpack.DefinePlugin({
		'process.env.NODE_ENV':JSON.stringify('development')
	})],
	module:{
		loaders:[
		{
			test:/\.js$/,
			exclude:/node_modules/,
			loader:"babel-loader",
			query:{
				presets:['react','es2015']
			}
		},
		{
			test:/\.css$/,
			loader:"style!css"
		},
		{
			test:/\.less/,
			loader:'style-loader!css-loader!less-loader'
		}]
	}
}