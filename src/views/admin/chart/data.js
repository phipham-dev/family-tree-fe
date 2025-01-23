const treeData = [
  {
    id: '0',
    rels: {
      spouses: ['8c92765f-92d3-4120-90dd-85a28302504c', '1'],
      father: '4',
      mother: '0fa5c6bc-5b58-40f5-a07e-d787e26d8b56',
      children: ['ce2fcb9a-6058-4326-b56a-aced35168561', 'f626d086-e2d6-4722-b4f3-ca4f15b109ab', '3'],
    },
    data: {
      firstName: 'Phạm Phú A',
      'last name': '',
      birthday: '1970',
      avatar:
        'https://static8.depositphotos.com/1009634/988/v/950/depositphotos_9883921-stock-illustration-no-user-profile-picture.jpg',
      gender: 'M',
    },
  },

  // vợ 2
  {
    id: '1',
    rels: {
      spouses: ['0'],
      children: ['3'],
    },
    data: {
      firstName: 'Nguyễn Thị Vợ 2 A',
      'last name': '',
      birthday: '1978',
      gender: 'F',
      other_name: 'Mẹ kế',
      avatar: 'https://fastly.picsum.photos/id/590/200/300.jpg?hmac=rMKCd22eXuQjtVujiifOrJzm-dBuhO8blicB93xN4y4',
    },
  },

  // con trai vợ 2
  {
    id: '3',
    data: {
      gender: 'M',
      firstName: 'Phạm Phú Con Trai V2 A',
      'last name': '',
      birthday: '1998',
      avatar: 'https://fastly.picsum.photos/id/351/200/300.jpg?hmac=OSQYmRI8IZkaMcC4ERotpBhe0AymVYajIIKPJFDzGBY',
    },
    rels: {
      mother: '1',
      father: '0',
    },
  },

  // vợ
  {
    id: '8c92765f-92d3-4120-90dd-85a28302504c',
    data: {
      gender: 'F',
      firstName: 'Trần Thị Vợ',
      'last name': '',
      birthday: '1985',
      avatar: 'https://fastly.picsum.photos/id/181/200/300.jpg?hmac=3b280Ezwkze55gQeG0IWLTJ9e_Pawe5ZL4mhe-LO_WE',
      other_name: 'Chánh thất',
    },
    rels: {
      spouses: ['0'],
      children: ['ce2fcb9a-6058-4326-b56a-aced35168561', 'f626d086-e2d6-4722-b4f3-ca4f15b109ab'],
    },
  },

  // Cha
  {
    id: '4',
    data: {
      gender: 'M',
      firstName: 'Phạm Phú Cha',
      'last name': '',
      birthday: '',
      avatar: '',
    },
    rels: {
      children: ['0'],
      spouses: ['0fa5c6bc-5b58-40f5-a07e-d787e26d8b56', '5'],
    },
  },

  // vợ 2 của cha
  {
    id: '5',
    data: {
      gender: 'F',
      firstName: 'Lê Thị 2 Vợ của cha',
      'last name': '',
      birthday: '',
      avatar: '',
    },
    rels: {
      spouses: ['4'],
      children: ['6'],
    },
  },

  // con gái v2 của cha
  {
    id: '6',
    rels: {
      father: '4',
      mother: '5',
      children: ['7'],
    },
    data: {
      firstName: 'Phạm Con Gái Vợ 2 Của Cha',
      'last name': '',
      birthday: '1980',
      avatar:
        'https://static8.depositphotos.com/1009634/988/v/950/depositphotos_9883921-stock-illustration-no-user-profile-picture.jpg',
      gender: 'F',
    },
  },

  // con của con gái v2 của cha
  {
    id: '7',
    rels: {
      mother: '6',
    },
    data: {
      firstName: 'Phạm con của con gái v2 của cha',
      'last name': '',
      isEnd: true,
      birthday: '1995',
      avatar:
        'https://static8.depositphotos.com/1009634/988/v/950/depositphotos_9883921-stock-illustration-no-user-profile-picture.jpg',
      gender: 'F',
    },
  },

  // vợ của cha
  {
    id: '0fa5c6bc-5b58-40f5-a07e-d787e26d8b56',
    data: {
      gender: 'F',
      firstName: 'Lê Thị Vợ của Cha',
      'last name': '',
      birthday: '',
      avatar: '',
    },
    rels: {
      spouses: ['4'],
      children: ['0'],
    },
  },

  // con trai 1
  {
    id: 'ce2fcb9a-6058-4326-b56a-aced35168561',
    data: {
      gender: 'M',
      firstName: 'Phạm Phú Con trai A',
      'last name': '',
      birthday: '',
      avatar: '',
    },
    rels: {
      mother: '8c92765f-92d3-4120-90dd-85a28302504c',
      father: '0',
      spouses: ['b4e33c68-20a7-47ba-9dcc-1168a07d5b52'],
      children: ['240a3f71-c921-42d7-8a13-dec5e1acc4fd'],
    },
  },

  // Con gái A
  {
    id: 'f626d086-e2d6-4722-b4f3-ca4f15b109ab',
    data: {
      gender: 'F',
      firstName: 'Phạm Thị Con gái A',
      'last name': '',
      birthday: '',
      avatar: '',
    },
    rels: {
      mother: '8c92765f-92d3-4120-90dd-85a28302504c',
      father: '0',
      spouses: ['10'],
      children: ['11'],
    },
  },

  // chồng của Con gái A
  {
    id: '10',
    data: {
      gender: 'M',
      firstName: 'Lê Chồng của con gái A',
      'last name': '',
      birthday: '2002',
      avatar: '',
    },
    rels: {
      spouses: ['f626d086-e2d6-4722-b4f3-ca4f15b109ab'],
      children: ['11'],
    },
  },

  // con của Con gái A
  {
    id: '11',
    data: {
      gender: 'M',
      firstName: 'Lê Con của con gái A',
      'last name': '',
      birthday: '2005',
      avatar: '',
    },
    rels: {
      father: '10',
      mother: 'f626d086-e2d6-4722-b4f3-ca4f15b109ab',
    },
  },

  // Vợ của con trai
  {
    id: 'b4e33c68-20a7-47ba-9dcc-1168a07d5b52',
    data: {
      gender: 'F',
      firstName: 'Lê Thị Vợ CTA',
      'last name': '',
      birthday: '',
      avatar: '',
    },
    rels: {
      spouses: ['ce2fcb9a-6058-4326-b56a-aced35168561'],
      children: ['240a3f71-c921-42d7-8a13-dec5e1acc4fd'],
    },
  },

  // con của con trai
  {
    id: '240a3f71-c921-42d7-8a13-dec5e1acc4fd',
    data: {
      gender: 'F',
      firstName: 'Phạm Con Gái của Con trai A',
      'last name': '',
      birthday: '',
      avatar: '',
    },
    rels: {
      mother: 'b4e33c68-20a7-47ba-9dcc-1168a07d5b52',
      father: 'ce2fcb9a-6058-4326-b56a-aced35168561',
    },
  },
];
export default treeData;
