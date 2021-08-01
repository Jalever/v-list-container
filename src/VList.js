import React from "react";
import BinarySearch from "./BinarySearch";

class VList extends React.Component {
  state = {
    scrollTop: 0
  }

  //可视化区域高度
  visibleWrapperHeight = this.props.wrapperHeight;
  //预估行高
  estimateRowHeight = this.props.estimateRowHeight;
  //缓冲区
  bufferSize = this.props.bufferSize;
  //数据总数
  total = this.props.total;

  //数据节点的配置信息，例如index，实际高度，差值（预估高度-实际高度），距离顶部的距离，节点底部距离顶部的距离...
  cachedPositions = [];

  //获取scrollingContainer，phantomContainer，actualContainer的ref值
  scrollingContainerRef = React.createRef();
  phantomContainerRef = React.createRef();
  actualContainerRef = React.createRef();

  //phantomContainer容器的高度
  phantomHeight = this.estimateRowHeight * this.total;

  //可视区域的数量
  limit = Math.ceil(this.visibleWrapperHeight / this.estimateRowHeight);//可见区域的item数量

  //可视区域对应的数据起始坐标
  originStartIdx = 0;
  //可视区域对应的数据起始坐标[含缓冲区]
  startIdx = 0;
  //可视区域对应的数据起始坐标[含缓冲区]
  endIdx = Math.min(this.originStartIdx + this.bufferSize + this.limit, this.total - 1);

  constructor(props) {
    super(props);
    this.initCachedPosition()
  }


  componentDidMount () {
    if (this.actualContainerRef.current && this.total > 0) {
      this.updateCachedPosition();
    }
  }

  componentDidUpdate () {
    if (this.actualContainerRef.current && this.total > 0) {
      this.updateCachedPosition();
    }
  }

  initCachedPosition = () => {
    const { total } = this;
    for (let index = 0; index < total; index++) {
      this.cachedPositions.push({
        id: index,
        top: index * this.estimateRowHeight,
        bottom: (index * 1 + 1) * this.estimateRowHeight,
        height: this.estimateRowHeight,
        dValue: 0,
      });
    }
  }


  updateCachedPosition = () => {
    //获取到真实dom节点
    const nodes = this.actualContainerRef.current.childNodes;

    nodes.forEach(node => {
      if (!node) return;
      const rect = node.getBoundingClientRect();
      //获取到节点的真实高度
      const realHeight = rect.height;

      //当前节点对应的index
      const idx = Number(node.id.split("-")[1]);
      //获取到对应cachedPositions中的数据条目数据
      const item = this.cachedPositions[idx];
      //差值（预估高度-实际高度）
      const dValue = item.height - realHeight;

      //如果预估高度和实际高度高度不相符，则更新对应节点的cachedPositions数组中的数据
      if (dValue) {
        this.cachedPositions[idx].height = realHeight;
        this.cachedPositions[idx].dValue = dValue;
        this.cachedPositions[idx].bottom -= dValue;
      }
    });

    //获取到当前可视区域的起始坐标和节点
    const startNode = nodes[0];
    let startIdx = 0;
    if (startNode) startIdx = Number(startNode.id.split("-")[1]);

    //每个节点的差值累计
    let cumulativeHeight = this.cachedPositions[startIdx].dValue;
    this.cachedPositions[startIdx].dValue = 0;

    //为了让每个节点衔接流畅和正常
    let len = this.cachedPositions.length;
    for (let index = startIdx + 1; index < len; index++) {
      const node = this.cachedPositions[index];

      this.cachedPositions[index].top = this.cachedPositions[index - 1].bottom;
      this.cachedPositions[index].bottom -= cumulativeHeight;

      if (this.cachedPositions[index].dValue) {
        cumulativeHeight += this.cachedPositions[index].dValue;
        this.cachedPositions[index].dValue = 0;
      }
    }

    //更新phantomContainer的高度值
    const height = this.cachedPositions[this.cachedPositions.length - 1].bottom;
    this.phantomHeight = height;
    this.phantomContainerRef.current.style.height = height + "px";
  }

  renderDisplayContent = () => {
    const content = [];
    for (let index = this.startIdx; index <= this.endIdx; index++) {
      content.push(
        this.props.rowRender(index, {
          width: '100%',
          left: 0,
          right: 0,
        })
      );
    }
    return content;
  }

  getStartIndex = (scrollTop = 0) => {
    let idx = BinarySearch(this.cachedPositions, scrollTop);
    const item = this.cachedPositions[idx];
    if (item.bottom < scrollTop) {
      idx += 1;
    }

    return idx;
  }

  onScroll = (e) => {
    if (e.target === this.scrollingContainerRef.current) {
      const { scrollTop } = e.target;
      const originStartIdx = this.originStartIdx;
      const newStartIdx = this.getStartIndex(scrollTop);

      if (originStartIdx !== newStartIdx) {
        this.originStartIdx = newStartIdx;
        this.startIdx = Math.max(this.originStartIdx - this.bufferSize, 0);

        this.endIdx = Math.min(this.originStartIdx + this.limit + this.bufferSize, this.total - 1);

        this.setState({ scrollTop });
      }
    }
  }

  getTransform = () => {
    return `translate3D(0, ${this.startIdx >= 1 ? this.cachedPositions[this.startIdx - 1].bottom : 0}px, 0)`;
  }

  render () {
    return (
      <div
        className="scrollingContainer"
        ref={this.scrollingContainerRef}
        onScroll={this.onScroll}
        style={{
          overflowX: 'hidden',
          overflowY: 'auto',
          width: '100%',
          height: this.visibleWrapperHeight + "px",
          position: 'relative'
        }}
      >
        <div
          className="phatomContainer"
          ref={this.phantomContainerRef}
          style={{
            height: this.phantomHeight + "px",
            position: 'relative'
          }}
        >
          <div
            className="actualContainer"
            ref={this.actualContainerRef}
            style={{
              width: "100%",
              position: "absolute",
              top: 0,
              transform: this.getTransform()
            }}
          >
            {this.renderDisplayContent()}
          </div>
        </div>
      </div>
    );
  }
}

export default VList;