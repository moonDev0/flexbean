var levels = [
  {
    name: 'justify-content 1',
    instructions: {
      'en': '<p>Guide the bean to the bowl on the right by using <cd>justify-content</cd> poperty, which aligns items horizontally.</p>',
      },
    board: 'g',
    style: {'justify-content': 'flex-end'},
    before: "#scene {\n  display: flex;\n",
    after: "}"
  },
  {
    name: 'justify-content 2',
    instructions: {
      'en': '<p>Guide each the bean to its respective bowl using <cd>justify-content</cd> poperty, which aligns items horizontally.</p>',
      },
    board: 'gy',
    style: {'justify-content': 'center'},
    before: "#scene {\n  display: flex;\n",
    after: "}"
  },
  {
    name: 'justify-content 3',
    instructions: {
      'en': '<p>Guide each bean to its respectie bowl using <cd>justify-content</cd>. This time, they have a lot of space all around them.</p>',
      },
    board: 'gyr',
    style: {'justify-content': 'space-around'},
    before: "#scene {\n  display: flex;\n",
    after: "}"
  },
  {
    name: 'justify-content 4',
    instructions: {
      'en': '<p>Guide each bean to its respective bowl using <cd>justify-content</cd> property, this time, they have a lot of space between them.</p>',
      },
    board: 'gyr',
    style: {'justify-content': 'space-between'},
    before: "#scene {\n  display: flex;\n",
    after: "}"
  },
  {
    name: 'align-items 1',
    instructions: {
      'en': '<p>Guide each bean to its respective bowl using <cd>align-items</cd> property, which aligns items verticaly.</p>',
        },
    board: 'gyr',
    style: {'align-items': 'flex-end'},
    before: "#scene {\n  display: flex;\n",
    after: "}"
  },
  {
    name: 'align-items 2',
    instructions: {
      'en': '<p>using a combination of <cd>justify-content</cd> and <cd>align-items,</cd> place the bean in the bowl in the middle.</p>',
      },
    board: 'g',
    style: {'justify-content': 'center', 'align-items': 'center'},
    before: "#scene {\n  display: flex;\n",
    after: "}"
  },
  {
    name: 'align-items 3',
    instructions: {
      'en': '<p>Guide each of the bean to its repective bowl using a combination of <cd>justify-content</cd> and <cd>align-items</cd>.</p>',
      },
    board: 'gyr',
    style: {'justify-content': 'space-around', 'align-items': 'flex-end'},
    before: "#scene {\n  display: flex;\n",
    after: "}"
  },
  {
    name: 'flex-direction 1',
    instructions: {
      'en': '<p>Guide ech bean to its respective bowl using <cd>flex-direction</cd> property, which defines the direction items ae placed.</p>',
       },
    board: 'gyr',
    style: {'flex-direction': 'row-reverse'},
    before: "#scene {\n  display: flex;\n",
    after: "}"
  },
  {
    name: 'flex-direction 2',
    instructions: {
      'en': '<p>Guide each bean to its respective bowl usingc<cd>flex-direction</cd> property, which defines the direction items are placed.</p>',
      },
    board: 'gyr',
    style: {'flex-direction': 'column'},
    before: "#scene {\n  display: flex;\n",
    after: "}"
  },
  {
    name: 'flex-direction 3',
    instructions: {
      'en': '<p>Using a combination of <cd>flex-direction</cd> and <cd>justify-content</cd>, place the beans in their respective bowls.</p>',
       },
    board: 'gyr',
    style: {'flex-direction': 'row-reverse', 'justify-content': 'flex-end'},
    before: "#scene {\n  display: flex;\n",
    after: "}"
  },
  {
    name: 'flex-direction 3',
    instructions: {
      'en': '<p>Using <cd>flex-flow</cd>, place the beans in their respective bowls.</p>',
       },
    board: 'gyr',
    style: {'flex-direction': 'row-reverse', 'justify-content': 'flex-start'},
    before: "#scene {\n  display: flex;\n",
    after: "}"
  }
  ,
  {
    name: 'flex-direction 3',
    instructions: {
      'en': '<p>Using <cd>flex-flow</cd> or <cd> flex-direction</cd> to reverse the column, place the beans in their respective bowls.</p>',
       },
    board: 'gyr',
    style: {'flex-direction': 'column-reverse', 'justify-content': 'flex-start'},
    before: "#scene {\n  display: flex;\n",
    after: "}"
      }
];

var levelWin = {
  name: 'win',
  instructions: {
    'en': '<p>You win! Thanks to your mastery of flexbox, you were able to help all of the beans to their bows. Just look how hoppy they are!</p><p>If you found this ribbeting',
    },
  board: 'gyrgyrgyrgyrgyrgyrgyrgyrg',
  classes: {'#scene, #background': 'wrap'},
  style: {},
  before: "#scene {\n  display: flex;\n",
  after: "}"
};
