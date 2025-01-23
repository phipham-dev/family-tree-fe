import React from 'react';
// import './family-chart.css';
import treeData from './data';
import f3 from '../../../lib/chart/index.js';
import * as d3 from 'd3';

export default class FamilyTree extends React.Component {
  cont = React.createRef();

  componentDidMount() {
    try {
      if (!this.cont.current) return;

      // Set dimensions for the chart
      const width = 1200;
      const height = 800;

      // Create SVG with explicit dimensions
      const svg = d3
        .select(this.cont.current)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height]);

      // Create store with data and configuration
      const store = f3.createStore({
        data: this.getData(),
        node_separation: 250,
        level_separation: 150,
        main_id: '0',
      });

      // Create view with d3 animation
      const view = f3.d3AnimationView({
        store,
        cont: this.cont.current,
        svg: svg,
      });

      // Create cards for nodes
      const Card = f3.elements.Card({
        store,
        svg: view.svg,
        card_dim: {
          w: 220,
          h: 100,
          text_x: 75,
          text_y: 40,
          img_w: 60,
          img_h: 60,
          img_x: 5,
          img_y: 5,
        },
        card_display: [
          (d) => `${d.data['firstName'] || ''} ${d.data['last name'] || ''}`,
          (d) => `${d.data['birthday'] || ''}`,
          (d) => `${d.data['other_name'] || ''}`,
          (d) => `${d.id}`,
        ],
        mini_tree: true,
        link_break: false,
      });

      // Set up view and updates
      view.setCard(Card);
      store.setOnUpdate((props) => view.update(props || {}));
      store.update.tree({ initial: true });
    } catch (error) {}
  }

  getData() {
    return treeData;
  }

  componentWillUnmount() {
    // Cleanup
    if (this.cont.current) {
      this.cont.current.innerHTML = '';
    }
  }

  render() {
    const containerStyle = {
      width: '100vw',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
    };

    return (
      <div
        className="f3"
        id="FamilyChart"
        ref={this.cont}
        style={containerStyle}
      />
    );
  }
}
