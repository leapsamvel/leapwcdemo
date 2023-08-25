
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
  import {
    Barcode,
    BarcodeFormat,
    useScanBarcodes,
  } from "vision-camera-code-scanner";
  import 'react-native-reanimated';
  import { Camera, CameraPermissionStatus, useCameraDevices } from 'react-native-vision-camera';


const Scanner = (props:any) => {
    const devices = useCameraDevices();
  const mountedRef = useRef(true);

  const isDarkMode = useColorScheme() === 'dark';
  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE]);
  const [hasReadCode, setHasReadCode] = useState(false);
    useState<CameraPermissionStatus>();

    const onCodeRead = async (barcodes:any) => {
        props.onCodeRead && props.onCodeRead(barcodes);
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

      

    return <View>
        {devices?.back && props.hasPermission && (
          <Camera  
            style={{height: '100%'}}
            device={devices?.back}
            isActive={barcodes.length === 0}
            frameProcessor={frameProcessor}
            frameProcessorFps={1}
          />
      )}
    </View>
}


export default Scanner;