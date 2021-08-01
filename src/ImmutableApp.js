import React from "react";
import faker from "faker";
import VList from "./VList";
import { css } from "@emotion/css";

const total = 100;
const data = [];
for (let index = 0; index < total; index++) {
  data.push({
    id: index,
    value: faker.lorem.sentences(),
  });
}

const wrapperHeight = 667;
const rowHeight = 66.7;
const bufferSize = 5;

class ImmutableApp extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {};
  // }
  state = {
    scrollTop: 0
  }

  // 可视区域中的数据数量
  limit = Math.ceil(wrapperHeight / rowHeight);

  //当前可视区域中的数据区间起始坐标
  realStartIndex = 0;
  //当前可视区域中的数据区间起始坐标[包含缓冲区]
  startIndex = 0;
  //当前可视区域中的数据区间终点坐标
  endIndex = Math.min(this.startIndex + this.limit, total - 1);

  scrollingContainerRef = React.createRef();

  onScroll = (e) => {
    // 当前滑动的节点是否是可视区域
    if (e.target === this.scrollingContainerRef.current) {
      const { scrollTop } = e.target;
      // 当前最新的起始坐标
      const newStartIndex = Math.floor(scrollTop / rowHeight);
      const { realStartIndex } = this;

      //若不一致，则更新数据
      if (realStartIndex !== newStartIndex) {
        this.realStartIndex = newStartIndex;
        this.startIndex = Math.max(newStartIndex - bufferSize, 0);
        this.endIndex = Math.min(newStartIndex + this.limit + bufferSize, total - 1);
        this.setState({
          scrollTop
        });
      }
    }
  }

  onRenderContent = () => {
    const content = [];
    for (let index = this.startIndex; index <= this.endIndex; index++) {
      content.push(
        <li
          key={index}
          id={index}
          onClick={() => console.log('item-', index)}
          style={{
            width: "100%",
            height: rowHeight - 1 + "px",
            position: "absolute",
            left: 0,
            right: 0,
            top: (index) * rowHeight,
            borderBottom: '1px solid #000',
          }}
        >
          <span>item-{index}</span>
        </li>
      );
    }
    return content;
  }

  render () {
    return (
      <div
        className="scrolling-container"
        onScroll={this.onScroll}
        ref={this.scrollingContainerRef}
        style={{
          width: "100%",
          height: wrapperHeight + "px",
          overflowY: 'auto',
          overflowX: "hidden",
        }}
      >
        <div
          className="phantom-container"
          style={{
            position: 'relative',
            height: rowHeight * total + "px"
          }}
        >
          {this.onRenderContent()}
        </div>
      </div>
    );
  }
}

export default ImmutableApp;