import { useReducer, createContext } from 'react';
import dynamic from 'next/dynamic';

const Context = createContext();

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'openModal':
      return [...state, { name: payload.name, props: payload.props || {} }];
    case 'closeModal':
      const index = state.findIndex(({ name }) => name === payload.name);

      if (index === -1) return state;

      return state.slice(0, index);
    default:
      return state;
  }
};

const modals = {
  AddEvent: dynamic(() => import('./AddEvent')),
  ViewEvent: dynamic(() => import('./ViewEvent')),
};

const ModalsManager = React.memo(({ children }) => {
  const [state, dispatch] = useReducer(reducer, []);

  const actions = Object.keys(modals).reduce((acm, name) => {
    acm[name] = {
      open: props => dispatch({ type: 'openModal', payload: { name, props } }),
      close: () => dispatch({ type: 'closeModal', payload: { name } }),
    };

    return acm;
  }, {});

  return (
    <>
      <Context.Provider value={actions}>{children}</Context.Provider>
      {state.map(({ name, props }, index) => {
        const Modal = modals[name];

        Modal.displayName = name;

        return (
          <Modal
            key={`${name}-${index}`}
            {...props}
            onClose={async (...args) => {
              const { onClose } = props;

              if (typeof onClose === 'function') await onClose(...args);

              return actions[name].close();
            }}
          />
        );
      })}
    </>
  );
});

ModalsManager.Context = Context;

export default ModalsManager;
