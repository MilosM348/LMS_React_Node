import React from 'react'
import 'react-notifications/lib/notifications.css'
import {NotificationContainer} from 'react-notifications'

import Routes from './router/index'
import {SettingProvider} from './provider/setting'

const App = () => (
    <>
      <NotificationContainer />
      <SettingProvider>
        <Routes />
      </SettingProvider>
    </>
  );

export default App