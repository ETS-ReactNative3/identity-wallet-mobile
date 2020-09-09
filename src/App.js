// @flow
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from './navigation';
import { connect } from 'core/redux';
import modules from 'core/modules';
import TermsOfServiceScreen from './screens/TermsOfServiceScreen';
import ReceiveTokensScreen from './screens/ReceiveTokensScreen';
import SendTokensScreen from './screens/SendTokensScreen';
import { ModalRoot } from './modals';
import { WalletTracker } from './WalletTracker';
import { Snackbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

type AppProps = {
  isLoading: boolean,
  loadApp: () => any,
};

export function App(props: AppProps) {
  const dispatch = useDispatch();
  const snackMessage = useSelector(modules.app.selectors.getSnackMessage)
  const { loadApp, isLoading } = props;

  useEffect(() => {
    WalletTracker.trackEvent({
      action: 'loaded',
      category: 'app',
      level: 'machine'
    });

    loadApp();
  }, []);

  return (
    <React.Fragment>
      <StatusBar barStyle="light-content" />
      <NavigationContainer />
      <ReceiveTokensScreen />
      <SendTokensScreen />
      <ModalRoot />
      {
        !isLoading && (
          <TermsOfServiceScreen />
        )
      }
      <Snackbar
        visible={!!snackMessage}
        onDismiss={() => dispatch(modules.app.actions.setSnackMessage(null))}
        duration={1000}
      >
        { snackMessage }
      </Snackbar>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return ({
    isLoading: state.app.isLoading,
  });
};

const mapActionsToProps = (dispatch) => ({
  loadApp: () => dispatch(modules.app.operations.loadAppOperation()),
});

export default connect(mapStateToProps, mapActionsToProps)(App);
