import React from "react";
import faker from "faker";
import VList from "./VList";
import { css } from "@emotion/css";
import "./App.css";

// const router = new VueRouter({ ... })

// router.beforeEach((to, from, next) => {
//   // ...
// })

const total = 100000;
const data = [];
for (let index = 0; index < total; index++) {
  data.push({
    id: index,
    value: faker.lorem.sentences(),
  });
}

const wrapperHeight = 667;
const estimateRowHeight = 66.7;
const bufferSize = 5;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    const total = 100000;
    const data = [];
    for (let index = 0; index < total; index++) {
      data.push({
        id: index,
        value: faker.lorem.sentences(),
      });
    }
  }

  render () {
    return (
      <React.Fragment>
        <h1 class='global-title'>bracket Title</h1>
        <VList
          wrapperHeight={wrapperHeight}
          estimateRowHeight={estimateRowHeight}
          bufferSize={bufferSize}
          total={total}
          rowRender={(index, styleData) => {
            return (
              <div
                key={index}
                id={`item-${index}`}
                style={styleData}
                className={css`
                width: 100%;
                padding: 20px;
                border-bottom: 1px solid #000;
              `}
              >
                <span style={{ width: '100%', display: 'flex', }}>{data[index].id}</span>
                <span style={{ width: '100%', display: 'flex', }}>{data[index].value}</span>
              </div>
            );
          }}
        >
        </VList>
      </React.Fragment>
    );
  }
}

export default App;