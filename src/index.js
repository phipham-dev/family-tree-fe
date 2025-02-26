import './utils/errorSuppress';
import React from 'react';
import ReactDOM from 'react-dom';
import 'assets/css/App.css';
// import 'assets/css/FamilyChart.css';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthLayout from 'layouts/auth';
import AdminLayout from 'layouts/admin';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (1 === 1 ? <Component {...props} /> : <Redirect to="/auth/login" />)}
    />
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <ChakraProvider theme={theme}>
      <React.StrictMode>
        <ThemeEditorProvider>
          <HashRouter>
            <Switch>
              <Route
                path={`/auth`}
                component={AuthLayout}
              />
              <ProtectedRoute
                path={`/admin`}
                component={AdminLayout}
              />
              <Redirect
                from="/"
                to="/admin"
              />
            </Switch>
          </HashRouter>
        </ThemeEditorProvider>
      </React.StrictMode>
    </ChakraProvider>,
  );
}

// import AuthService from './services/AuthService';

// const App = () => {
//   return (
//     <ChakraProvider theme={theme}>
//       <HashRouter>
//         <Switch>
//           <Route
//             path="/auth"
//             component={AuthLayout}
//           />
//           <ProtectedRoute
//             path="/admin"
//             component={AdminLayout}
//           />
//           <Redirect
//             from="/"
//             to="/auth/login"
//           />
//         </Switch>
//       </HashRouter>
//     </ChakraProvider>
//   );
// };
