import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';

const Context = React.createContext({});

const AppMenu = ({ children }) => (
  <div className="app-menu">
    <PerfectScrollbar
      id="app-menu-scroll-container"
      options={{ suppressScrollX: true, wheelPropagation: true }}>
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

AppMenu.Context = Context;

export default AppMenu;
