const defaultState = {
  windowLevelData: {
    1: { description: 'CT 1', window: '35', level: '70' },
    2: { description: 'CT 2', window: '40', level: '40' },
    3: { description: 'CT 3', window: '120', level: '90' },
    4: { description: '', window: '', level: '' },
    5: { description: '', window: '', level: '' },
    6: { description: '', window: '', level: '' },
    7: { description: '', window: '', level: '' },
    8: { description: '', window: '', level: '' },
    9: { description: '', window: '', level: '' },
    10: { description: '', window: '', level: '' },
  },
  generalPreferences: {
    // language: 'en-US'
  },
};

const preferences = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_USER_PREFERENCES': {
      return Object.assign({}, state, action.state);
    }
    default:
      return state;
  }
};

export { defaultState };
export default preferences;
