import React, { Component } from "react";
import JSMpeg from "@cycjimmy/jsmpeg-player";

export default class JsmpegPlayer extends Component {
  constructor(props) {
    super(props);

    this.els = {
      videoWrapper: null,
    };
  }

  // eslint-disable-next-line react/sort-comp
  render() {
    return (
      <div
        /* eslint-disable-next-line react/destructuring-assignment,react/prop-types */
        className={this.props.wrapperClassName}
        style={{
          // eslint-disable-next-line react/destructuring-assignment,react/prop-types
          aspectRatio: `${this.props.ratio}`,
          // eslint-disable-next-line react/destructuring-assignment,react/prop-types
          display: `${this.props.disabled ? "none" : "block"}`,
          zIndex: 10,
        }}
        /* eslint-disable-next-line no-return-assign */
        ref={(videoWrapper) => (this.els.videoWrapper = videoWrapper)}
      />
    );
  }

  componentDidMount() {
    // Reference documentation, pay attention to the order of parameters.
    // https://github.com/cycjimmy/jsmpeg-player#usage
    this.video = new JSMpeg.VideoElement(
      this.els.videoWrapper,
      // eslint-disable-next-line react/destructuring-assignment,react/prop-types
      this.props.videoUrl,
      // eslint-disable-next-line react/destructuring-assignment,react/prop-types
      this.props.options,
      // eslint-disable-next-line react/destructuring-assignment,react/prop-types
      this.props.overlayOptions
    );

    // eslint-disable-next-line react/destructuring-assignment,react/prop-types
    if (this.props.onRef) {
      // eslint-disable-next-line react/destructuring-assignment,react/prop-types
      this.props.onRef(this);
    }
  }

  componentWillUnmount() {
    this.video.destroy();
  }

  // eslint-disable-next-line react/no-unused-class-component-methods
  play() {
    this.video.play();
  }

  // eslint-disable-next-line react/no-unused-class-component-methods
  pause() {
    this.video.pause();
  }

  // eslint-disable-next-line react/no-unused-class-component-methods
  stop() {
    this.video.stop();
  }

  // eslint-disable-next-line react/no-unused-class-component-methods
  destroy() {
    this.video.destroy();
  }
}
