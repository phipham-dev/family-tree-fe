import React, { useEffect, useRef, useState } from 'react';
// import '../../../../assets/css/FamilyChart.css';
import f3 from '../../../../lib/chart/index.js';
import * as d3 from 'd3';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min.js';
import axiosHelper from 'helpers/axios.helper.js';
import { DRAW_FAMILY_VERTICAL_PATH } from '../variables/path.js';
import lodash from 'lodash';
import './family-chart.css';

const DrawVerticalFamilyTree = () => {
  const containerRef = useRef(null);
  const chartRef = useRef(null); // Ref to store chart instances
  const location = useLocation();
  const [initData, setInitData] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [mainId, setMainId] = useState('');

  const fetchDataById = async (id) => {
    try {
      const result = await axiosHelper.be1.get(`${DRAW_FAMILY_VERTICAL_PATH}?id=${id}`);
      const data = lodash.get(result, 'data.metadata', {});
      console.log('data::: ', data);
      setTreeData(lodash.get(data, 'familyData', []));
      setMainId(lodash.get(data, 'mainId', null));
      setInitData(true);
    } catch (error) {
      console.error('Error fetching data:', error);
      setInitData(false);
    }
  };

  // Effect for fetching data
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    if (id && !initData) {
      fetchDataById(id);
    }
  }, [location.search, initData]);

  // Effect for rendering chart
  useEffect(() => {
    if (!containerRef.current || !treeData.length || !mainId) return;

    // Cleanup previous chart
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    // Set dimensions for the chart
    const width = 1200;
    const height = 800;

    // Create SVG with explicit dimensions
    const svg = d3
      .select(containerRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Create store with data and configuration
    const store = f3.createStore({
      data: treeData,
      node_separation: 250,
      level_separation: 150,
      main_id: mainId,
    });

    // Create view with d3 animation
    const view = f3.d3AnimationView({
      store,
      cont: containerRef.current,
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
        (d) => `${d.data['firstName'] || ''} ${d.data['lastName'] || ''}`,
        (d) => `${d.data['birthday'] || ''}`,
        (d) => `${d.data['differentName'] || ''}`,
        (d) => `${d.id}`,
      ],
      mini_tree: true,
      link_break: false,
    });

    // Set up view and updates
    view.setCard(Card);
    store.setOnUpdate((props) => view.update(props || {}));
    store.update.tree({ initial: true });

    // Save instances for cleanup
    chartRef.current = {
      store,
      view,
      svg,
    };

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      // Clear chart instances
      chartRef.current = null;
    };
  }, [treeData, mainId]); // Re-run effect when treeData or mainId changes

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
      ref={containerRef}
      style={containerStyle}
    />
  );
};

export default DrawVerticalFamilyTree;
