import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import useViewer from 'Hooks/useViewer';

const Context = React.createContext({});

const AppMenu = ({ children }) => {
  const viewer = useViewer();
  return (
    <div
      className={`app-menu  ${
        viewer.user.role === 'Admin' ? 'show-admin' : ''
      }`}>
      <PerfectScrollbar
        id="app-menu-scroll-container"
        options={{ suppressScrollX: true, wheelPropagation: false }}>
        <div className="scroll">
          <div className="scrollbar-container overflow-auto">
            <div className="p-4">
              <Context.Provider value={{ target: 'app-menu-scroll-container' }}>
                {children}
              </Context.Provider>
            </div>
          </div>
        </div>
      </PerfectScrollbar>
    </div>
  );
};

AppMenu.Context = Context;

export default AppMenu;
