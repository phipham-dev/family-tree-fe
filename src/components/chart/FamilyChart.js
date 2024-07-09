import React from 'react';
// import f3, { elements } from "family-chart"; // npm i family-chart
import './family-chart.css';
import treeData from './data.js'; // create file 'family-chart.css' in same directory, copy/paste css from examples/create-tree

import f3 from '../../chart/lib/chart/index.js';

export default class FamilyTree extends React.Component {
  cont = React.createRef();

  componentDidMount() {
    if (!this.cont.current) return; // Nếu không tìm thấy container, thoát

    // Tạo một store với dữ liệu, khoảng cách giữa các node và level
    const store = f3.createStore({
      data: data(),
      node_separation: 250, //cách nhau chiều ngang
      level_separation: 150, // cách nhau chiều dọc
      main_id: '4',
    });

    // Tạo view với animation từ d3
    const view = f3.d3AnimationView({
      store,
      cont: document.querySelector('#FamilyChart'), // Chọn container để render
    });
    // Tạo các thẻ (cards) cho các node
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
      mini_tree: true, // Kích thước mini tree
      link_break: false, // Đường link giữa các node
    });

    view.setCard(Card); // Thiết lập card cho view
    store.setOnUpdate((props) => view.update(props || {})); // Cập nhật view khi có thay đổi
    store.update.tree({ initial: true }); // Cập nhật cây gia phả ban đầu

    // Hàm data() trả về dữ liệu gia phả
    function data() {
      return treeData;
      // return [
      //   {
      //     id: "0",
      //     rels: {
      //       spouses: ["8c92765f-92d3-4120-90dd-85a28302504c"],
      //       father: "0c09cfa0-5e7c-4073-8beb-94f6c69ada19",
      //       mother: "0fa5c6bc-5b58-40f5-a07e-d787e26d8b56",
      //       children: [
      //         "ce2fcb9a-6058-4326-b56a-aced35168561",
      //         "f626d086-e2d6-4722-b4f3-ca4f15b109ab",
      //       ],
      //     },
      //     data: {
      //       "firstName": "Agnus",
      //       "last name": "",
      //       birthday: "1970",
      //       avatar:
      //         "https://static8.depositphotos.com/1009634/988/v/950/depositphotos_9883921-stock-illustration-no-user-profile-picture.jpg",
      //       gender: "M",
      //     },
      //   },
      //   {
      //     id: "8c92765f-92d3-4120-90dd-85a28302504c",
      //     data: {
      //       gender: "F",
      //       "firstName": "Andrea",
      //       "last name": "",
      //       birthday: "",
      //       avatar: "",
      //     },
      //     rels: {
      //       spouses: ["0"],
      //       children: [
      //         "ce2fcb9a-6058-4326-b56a-aced35168561",
      //         "f626d086-e2d6-4722-b4f3-ca4f15b109ab",
      //       ],
      //     },
      //   },
      //   {
      //     id: "0c09cfa0-5e7c-4073-8beb-94f6c69ada19",
      //     data: {
      //       gender: "M",
      //       "firstName": "Zen",
      //       "last name": "",
      //       birthday: "",
      //       avatar: "",
      //     },
      //     rels: {
      //       children: ["0"],
      //       spouses: ["0fa5c6bc-5b58-40f5-a07e-d787e26d8b56"],
      //     },
      //   },
      //   {
      //     id: "0fa5c6bc-5b58-40f5-a07e-d787e26d8b56",
      //     data: {
      //       gender: "F",
      //       "firstName": "Zebra",
      //       "last name": "",
      //       birthday: "",
      //       avatar: "",
      //     },
      //     rels: {
      //       spouses: ["0c09cfa0-5e7c-4073-8beb-94f6c69ada19"],
      //       children: ["0"],
      //       father: "12a9bddf-855a-4583-a695-c73fa8c0e9b2",
      //       mother: "bd56a527-b613-474d-9f38-fcac0aae218b",
      //     },
      //   },
      //   {
      //     id: "ce2fcb9a-6058-4326-b56a-aced35168561",
      //     data: {
      //       gender: "M",
      //       "firstName": "Ben",
      //       "last name": "",
      //       birthday: "",
      //       avatar: "",
      //     },
      //     rels: {
      //       mother: "8c92765f-92d3-4120-90dd-85a28302504c",
      //       father: "0",
      //       spouses: ["b4e33c68-20a7-47ba-9dcc-1168a07d5b52"],
      //       children: [
      //         "eabd40c9-4518-4485-af5e-e4bc3ffd27fb",
      //         "240a3f71-c921-42d7-8a13-dec5e1acc4fd",
      //       ],
      //     },
      //   },
      //   {
      //     id: "f626d086-e2d6-4722-b4f3-ca4f15b109ab",
      //     data: {
      //       gender: "F",
      //       "firstName": "Becky",
      //       "last name": "",
      //       birthday: "",
      //       avatar: "",
      //     },
      //     rels: {
      //       mother: "8c92765f-92d3-4120-90dd-85a28302504c",
      //       father: "0",
      //     },
      //   },
      //   {
      //     id: "eabd40c9-4518-4485-af5e-e4bc3ffd27fb",
      //     data: {
      //       gender: "M",
      //       "firstName": "Carlos",
      //       "last name": "",
      //       birthday: "",
      //       avatar: "",
      //     },
      //     rels: {
      //       mother: "b4e33c68-20a7-47ba-9dcc-1168a07d5b52",
      //       father: "ce2fcb9a-6058-4326-b56a-aced35168561",
      //     },
      //   },
      //   {
      //     id: "b4e33c68-20a7-47ba-9dcc-1168a07d5b52",
      //     data: {
      //       gender: "F",
      //       "firstName": "Branka",
      //       "last name": "",
      //       birthday: "",
      //       avatar: "",
      //     },
      //     rels: {
      //       spouses: ["ce2fcb9a-6058-4326-b56a-aced35168561"],
      //       children: [
      //         "eabd40c9-4518-4485-af5e-e4bc3ffd27fb",
      //         "240a3f71-c921-42d7-8a13-dec5e1acc4fd",
      //       ],
      //     },
      //   },
      //   {
      //     id: "240a3f71-c921-42d7-8a13-dec5e1acc4fd",
      //     data: {
      //       gender: "F",
      //       "firstName": "Carla",
      //       "last name": "",
      //       birthday: "",
      //       avatar: "",
      //     },
      //     rels: {
      //       mother: "b4e33c68-20a7-47ba-9dcc-1168a07d5b52",
      //       father: "ce2fcb9a-6058-4326-b56a-aced35168561",
      //     },
      //   },
      //   {
      //     id: "12a9bddf-855a-4583-a695-c73fa8c0e9b2",
      //     data: {
      //       gender: "M",
      //       "firstName": "Yvo",
      //       "last name": "",
      //       birthday: "",
      //       avatar: "",
      //     },
      //     rels: {
      //       children: ["0fa5c6bc-5b58-40f5-a07e-d787e26d8b56"],
      //       spouses: ["bd56a527-b613-474d-9f38-fcac0aae218b"],
      //     },
      //   },
      //   {
      //     id: "bd56a527-b613-474d-9f38-fcac0aae218b",
      //     data: {
      //       gender: "F",
      //       "firstName": "Yva",
      //       "last name": "",
      //       birthday: "",
      //       avatar: "",
      //     },
      //     rels: {
      //       spouses: ["12a9bddf-855a-4583-a695-c73fa8c0e9b2"],
      //       children: ["0fa5c6bc-5b58-40f5-a07e-d787e26d8b56"],
      //     },
      //   },
      // ];
    }
  }

  render() {
    return (
      <div
        className="f3"
        id="FamilyChart"
        ref={this.cont}
      ></div>
    );
  }
}
