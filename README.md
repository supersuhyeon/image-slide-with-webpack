## Monsquad Image Slider Project with Webpack

![ezgif com-crop](https://user-images.githubusercontent.com/94214512/218526278-5a327de5-3787-4951-970c-3f49e75eb9e9.gif)<br>
When I worked on my branded website project, Monsquad, I used Swiper library to make a dynamic image slider. However, I was wondering how the dynamic image slider works so I tried to make it from scratch without any libraries this time.<br>
[image slider](https://silly-swan-b52802.netlify.app/)

### Goals of the project

1. build a project in webpack enviornment

### Languages

html, css, javascript, webpack

### Features

1. Build an image slider without library <br>

- autoplay

```js
  togglePlay(e) {
    if (e.target.dataset.status === "play") {
      this.#autoPlay = true;
      this.controlWrapEl.classList.add("play");
      this.controlWrapEl.classList.remove("pause");
      this.initAutoplay();
    } else if (e.target.dataset.status === "pause") {
      this.#autoPlay = false;
      this.controlWrapEl.classList.remove("play");
      this.controlWrapEl.classList.add("pause");
      clearInterval(this.#intervalId);
    }
  }

  initAutoplay() {
    this.#intervalId = setInterval(() => { //setInterval returns value
      this.moveToRight();
    }, 3000);
  }

    moveToRight() {
    this.#currentPosition += 1;
    if (this.#currentPosition === this.#sliderNumber) {
      //when the currentPosition is on the last slide, it moves back to the first slide
      this.#currentPosition = 0;
    }
    this.sliderListEl.style.left = `-${
      this.#sliderWidth * this.#currentPosition
    }px`;

    if (this.#autoPlay) { //when it is on autoplay mode and a user clicked the next.prev button, then clear the current interval and set the new interval
      clearInterval(this.#intervalId);
      this.#intervalId = setInterval(() => {
        this.moveToRight();
      }, 3000);
    }
    this.setIndicator();
  }
```

- indicator

```js
//Creating Indicators Dynamically
export default class ImageSlider {
  //...

  //when a user clicks the indicator then it shows the matched slide
  onClickIndicator(e) {
    const indexPosition = parseInt(e.target.dataset.index, 10); //parseInt(string, radix)
    if (Number.isInteger(indexPosition)) {
      // Number.isInteger(value), boolean
      this.#currentPosition = indexPosition;
      this.sliderListEl.style.left = `-${
        this.#sliderWidth * this.#currentPosition
      }px`;
    }
    this.setIndicator();
  }

  createIndicator() {
    //Used DocumentFragment to optimize the performance
    const docFragment = document.createDocumentFragment();
    for (let i = 0; i < this.#sliderNumber; i += 1) {
      const li = document.createElement("li");
      li.dataset.index = i; //data-index="0" ~ numbers of slides
      docFragment.appendChild(li);
    }
    this.indicatorWrapEl.querySelector("ul").appendChild(docFragment);
  }

  setIndicator() {
    //activate indicator's color along with the present slide
    this.indicatorWrapEl.querySelector("li.active")?.classList.remove("active");
    this.indicatorWrapEl
      .querySelector(`ul li:nth-child(${this.#currentPosition + 1})`)
      .classList.add("active");
  }
}
```

2. How to set up webpack enivronment<br>
   There are quite a lot of concepts to explain for setting up the webpack environment, so I documented it in [my Korean blog](https://blog.naver.com/thvldk0025/223012344450)
   that webpack was much more complicated to deal with than parcel-bundler. But webpack left a strong impression of less network costs by bundling files and how far you can customize your project by adjusting one-by-one in detail in webpack.config.js.

```js
const path = require("path");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  entry: "./src/js/index.js", //Where to start reading the file
  output: {
    // Setting up to return results
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
    clean: true,
  },
  devtool: "source-map",
  mode: "development",
  devServer: {
    host: "localhost",
    port: 8080,
    open: true,
    watchFiles: "index.html",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Monsquad Image Slide",
      template: "./index.html",
      inject: "body",
      favicon: "./favicon.ico",
    }),
    new MiniCssExtractPlugin({ filename: "style.css" }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.jpeg$/,
        type: "asset/inline", // By default the html-webpack-plugin is using the a loader with lodash template syntax - to make the loader aware of the image you can use this syntax: <img src="<%= require('./logo.png' %>">
      },
    ],
  },

  optimization: {
    //performance optimization
    minimizer: [new TerserWebpackPlugin(), new CssMinimizerPlugin()],
  },
};
```

### Reference Links

[how to set up webpack environment from my Korean blog](https://blog.naver.com/thvldk0025/223012344450) <br>
[webpack](https://webpack.js.org/concepts/output/#usage)

### Self-reflection

It takes some time to manually code all the functions without using a library but this exercise helps with learning how it all works.
