import { DeviceDataContext } from "./DeviceDataContext";

<DeviceDataContext.Consumer>
  {
    values => {
      if (window._REACT_CONTEXT_DEVTOOL) {
        window._REACT_CONTEXT_DEVTOOL({ id: 'uniqContextId', displayName: 'Context Display Name', values });
      }
      return null;
    }
  }
</DeviceDataContext.Consumer>