/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import React, {useEffect, useRef, useState, type PropsWithChildren} from 'react';
import {
  Button,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { Camera, CameraPermissionStatus, useCameraDevices } from 'react-native-vision-camera';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import useInitialization from './useWCV2Client';
import { useInitWCV2Listeners } from './wcListener';
import { createWeb3Wallet, web3wallet } from './web3Wallet';
import {
  Barcode,
  BarcodeFormat,
  useScanBarcodes,
} from "vision-camera-code-scanner";
import 'react-native-reanimated';

const Section: React.FC<
  PropsWithChildren<{
    title: string;
  }>
> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

interface SessionDetails {
  name: string
  icon: string
  address: string
  topic: string
  pairingTopic: string
  isWCV2: boolean
  payload: any
  acknowledged: boolean
}

const App = () => {
  let refreshDappListTimer:NodeJS.Timeout;
  const initialized = useInitialization();
  useInitWCV2Listeners(initialized);
  const devices = useCameraDevices();
  const mountedRef = useRef(true);

  const isDarkMode = useColorScheme() === 'dark';
  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE]);
  const [hasReadCode, setHasReadCode] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [closeCamera, setCloseCamera] = useState(false)
  const [permissionStatus, setPermissionStatus] =
    useState<CameraPermissionStatus>();
    const [activeSessions, setActiveSessions] = useState<Array<SessionDetails>>([]);


  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const updateActiveSessions = () => {
    if(web3wallet) {
      const sessions =  web3wallet.getActiveSessions()
      console.log({activeSessions: JSON.stringify(sessions)});
      setActiveSessions([
        ...(Object.keys(sessions ?? {}) ?? [])
          .map((sessionKey) => {
            const session = sessions[sessionKey];
            const address = session?.namespaces.cosmos.accounts[0]?.split(":")?.[2];
            /***
             * There is no listener we have when the session acknowledged value changes from
             * false to true during connection / reconnection 
             * hence the hack to re-fech the sessions after 3 seconds
             */
            if(!sessions[sessionKey]?.acknowledged) {
              clearTimeout(refreshDappListTimer);
              refreshDappListTimer = setTimeout(() => {
                updateActiveSessions();
              }, 3000)
            }
            return {
              name: session?.peer.metadata.name,
              icon: session?.peer.metadata?.icons[0],
              address,
              topic: session?.topic,
              pairingTopic: session.pairingTopic,
              isWCV2: true,
              payload: session,
              acknowledged: session.acknowledged
            };
          }),
      ]);
    }
  }

  const onCodeRead = async (barcodes:any) => {
    const data: any = barcodes[0]?.content?.data;
    if (!!data && (data as string).startsWith("wc:")) {

      const uri = data;
      if (uri.includes("wc:")) {
        if (uri.includes("@2")) {
          setCloseCamera(true);
          try {
            console.log("Creating paring", uri);
            await web3wallet.core.pairing.pair({ uri, activatePairing: true });
            updateActiveSessions();
          }
          catch(e) {
            updateActiveSessions();
            console.log(e);
          }
          
        }
      }
    }
  }
  useEffect(() => {
    const fn = async () => {
      if (barcodes.length > 0 && !hasReadCode) {
        const err = await onCodeRead(barcodes);
        if (!mountedRef.current) return;
        if (!err) setHasReadCode(true);
        setHasReadCode(false);
      }
    };
    fn();

    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barcodes]);

  const setPermissionData = (status: CameraPermissionStatus) => {
    setPermissionStatus(status);
    if (status === "authorized") {
      setHasPermission(true);
    } else if (status === "denied") {
      setHasPermission(false);
    } else {
      setHasPermission(false);
    }
  };

  const requestCameraPermission = async () => {
    /**
     * Android and iOS handles permissions differently.
     * Android returns 'denied' if the user has denied the permission or if we have not requested yet.
     * iOS returns 'not-determined' if we have not yet requested the permission.
     */
    const status = await Camera.getCameraPermissionStatus();
    setPermissionData(status);
    if (status === "denied") {
      Linking.openSettings();
    } else if (status === "not-determined" || Platform.OS === "android") {
      const cameraPermission = await Camera.requestCameraPermission();
      setPermissionData(cameraPermission);
    }
    setHasReadCode(false);
    setCloseCamera(false);
  };

  console.log(hasPermission);


  useEffect(() => {
    updateActiveSessions();
    return () => {
      refreshDappListTimer && clearTimeout(refreshDappListTimer);
    }
  }, [initialized])

  return (
    <SafeAreaView style={backgroundStyle}>
      <Button onPress={() =>{ requestCameraPermission()}} title="Camera button"/>
      {devices?.back && hasPermission && !closeCamera && (
          <Camera  
            style={{height: '50%'}}
            device={devices?.back}
            isActive={barcodes.length === 0}
            frameProcessor={frameProcessor}
            frameProcessorFps={1}
          />
      )}
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
            {
              activeSessions && (
                <Text>{JSON.stringify(activeSessions, null, 2)}</Text>
              )
            }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
