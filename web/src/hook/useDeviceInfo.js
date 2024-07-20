import { createStore, createHook } from "react-sweet-state";
import { Device } from "@capacitor/device";

const Store = createStore({
  initialState: { device: {} },
  actions: {
    setDeviceInfo:
      (device) =>
      async ({ setState }) => {
        setState({
          device,
        });
      },
  },
});

export default function useDeviceInfo() {
  const DeviceStore = createHook(Store);
  const [{ device }, { setDeviceInfo }] = DeviceStore();

  const getDeviceInfo = async () => {
    const info = await Device.getInfo();
    setDeviceInfo(info);
  };

  return {
    device,
    setDeviceInfo,
    getDeviceInfo,
  };
}
