import React, { Component } from 'react';
import Swipe from 'swipe-js-iso';
import deepEqual from './deepEqual';

export type ReactSwipeProps = {
  childCount?: number;
  children?: React.ReactNode;
  className?: string;
  id?: string;
  swipeOptions?: {
    startSlide?: number;
    speed?: number;
    auto?: number;
    continuous?: boolean;
    disableScroll?: boolean;
    stopPropagation?: boolean;
    swiping?: () => void;
    callback?: () => void;
    transitionEnd?: () => void;
  };
  style?: {
    container?: object;
    wrapper?: object;
    child?: object;
  };
};

export default class ReactSwipe extends Component<ReactSwipeProps> {
  containerEl: any;
  swipe: any;

  static defaultProps = {
    swipeOptions: {},
    style: {
      container: {
        overflow: 'hidden',
        visibility: 'hidden',
        position: 'relative',
      },
      wrapper: {
        overflow: 'hidden',
        position: 'relative',
      },
      child: {
        float: 'left',
        width: '100%',
        position: 'relative',
        transitionProperty: 'transform',
      },
    },
    className: '',
    childCount: 0,
  };

  componentDidMount() {
    this.swipe = Swipe(this.containerEl, this.props.swipeOptions);
  }

  componentDidUpdate(prevProps: ReactSwipeProps) {
    const { childCount, swipeOptions } = this.props;
    const shouldUpdateSwipeInstance =
      prevProps.childCount !== childCount ||
      !deepEqual(prevProps.swipeOptions, swipeOptions);

    if (shouldUpdateSwipeInstance) {
      this.swipe.kill();
      this.swipe = Swipe(this.containerEl, this.props.swipeOptions);
    }
  }

  componentWillUnmount() {
    this.swipe.kill();
    this.swipe = void 0;
  }

  next() {
    this.swipe.next();
  }

  prev() {
    this.swipe.prev();
  }

  slide(...args: any[]) {
    this.swipe.slide(...args);
  }

  getPos() {
    return this.swipe.getPos();
  }

  getNumSlides() {
    return this.swipe.getNumSlides();
  }

  render() {
    const { id, className, style, children } = this.props;

    return (
      <div
        id={id}
        ref={(el) => (this.containerEl = el)}
        className={`react-swipe-container ${className}`}
        style={style?.container}
      >
        <div style={style?.wrapper}>
          {React.Children.map(children, (child: any) => {
            if (!child) {
              return null;
            }

            const childStyle = child.props.style
              ? { ...style?.child, ...child.props.style }
              : style?.child;

            return React.cloneElement(child, { style: childStyle });
          })}
        </div>
      </div>
    );
  }
}
