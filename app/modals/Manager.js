import { useReducer, createContext } from 'react';
import dynamic from 'next/dynamic';
import { Modal } from 'reactstrap';
import { withRouter } from 'next/router';
import classNames from 'classnames';

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
  AddEvent: {
    size: 'md',
    Component: dynamic(() => import('./AddEvent')),
  },
  ViewEvent: {
    size: 'sm',
    autoClose: true,
    Component: dynamic(() => import('./ViewEvent')),
  },
  EditEvent: {
    size: 'md',
    Component: dynamic(() => import('./EditEvent')),
  },
  AddZoomAccount: {
    size: 'sm',
    Component: dynamic(() => import('./AddZoomAccount')),
  },
  Impersonate: {
    size: 'md',
    Component: dynamic(() => import('./Impersonate')),
  },
};

const ModalsManager = withRouter(
  React.memo(({ children, router }) => {
    const [state, dispatch] = useReducer(reducer, []);

    const actions = Object.keys(modals).reduce((acm, name) => {
      acm[name] = {
        open: (props) =>
          dispatch({ type: 'openModal', payload: { name, props } }),
        close: () => dispatch({ type: 'closeModal', payload: { name } }),
        isOpen: () => !!state.find((modal) => modal.name === name),
      };

      return acm;
    }, {});

    const embed = router?.query?.hasOwnProperty('embed');

    return (
      <Context.Provider value={actions}>
        {children}
        {state.map(({ name, props }, index) => {
          const config = modals[name];
          const ModalComponent = config.Component;

          ModalComponent.displayName = name;

          const onClose = async (...args) => {
            const { onClose } = props;

            if (typeof onClose === 'function') await onClose(...args);

            return actions[name].close();
          };

          return (
            <Modal
              key={`${name}-${index}`}
              className={classNames({ embed })}
              isOpen={true}
              size={props.size || config.size}
              backdrop={!embed}
              toggle={() => !embed && config.autoClose && onClose()}>
              <ModalComponent
                {...props}
                embed={embed}
                autoClose={config.autoClose}
                onClose={onClose}
              />
            </Modal>
          );
        })}
      </Context.Provider>
    );
  }),
);

ModalsManager.Context = Context;

export default ModalsManager;
