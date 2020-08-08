import Taro, { Component } from "@tarojs/taro";
import geoJson from './chinaData';

function setChartData(chart, data) {
  echarts.registerMap('map', geoJson);
  let option = {
    tooltip: {
    },
    grid: {
      top: '5%',
      left: '5%',
      right: '8%',
      bottom: '5%',
      containLabel: true
    },
    visualMap: {
      show: true,
      range: null,
      itemWidth: 10,
      itemHeight: 10,
      left: 10,
      bottom: 10,
      splitNumber: 5,
      inRange: {
        color: ['#bfe7ff', '#abd2f1', '#608bad']
      },
      textStyle: {
        color: '#999',
        fontSize: 9,
      },
      seriesIndex: 0
    },
    geo: {
      map: 'china',
      show: true,
      label: {
        normal: {
          show: false
        },
        emphasis: {
          show: false,
        }
      },
      roam: false,
      itemStyle: {
        normal: {
          areaColor: '#023677',
          borderColor: '#1180c7',
        },
        emphasis: {
          areaColor: '#4499d0',
        }
      }
    },
    series: [{
      type: 'map',
      mapType: 'map',
      label: {
        normal: {
          show: true,
          color: '#666', // 省份默认的文字颜色
          fontSize: 8,
        },
        emphasis: {
          color: '#000' // 鼠标经过时的文字颜色
        }
      },
      itemStyle: {
        normal: {
          areaColor: '#ddebf8',
          borderColor: '#d3f3ff'
        },
        emphasis: {
          show: false,
          color: '#fff',
          // areaColor: '#ffcc3b' // 鼠标经过时的黄色背景
          areaColor: '#54c7ff' // 鼠标经过时的蓝色背景
        }
      },
      animation: false,
      data: data
    }],
  };
  chart.setOption(option);
}

export default class ChinaMap extends Component {
  config = {
    // usingComponents: {
    //   "ec-canvas": "./ec-canvas/ec-canvas"
    // }
  };

  constructor(props) {
    super(props);
  }

  state = {
    ec: {
      lazyLoad: true
    }
  };

  refresh(data) {
    console.log('data: ', data)
    console.log('this.Chart: ', this.Chart)
    const chart = echarts.init(this.Chart, null, {
      width: '400px',
      height: '300px'
    });
    setChartData(chart, data);
  }

  refChart = node => {
    console.log('❀ node: ', node)
    this.Chart = node
  };

  render() {
    return (
      <ec-canvas
        ref={this.refChart}
        canvas-id="mychart-area"
        ec={this.state.ec}
      />
    );
  }
}
