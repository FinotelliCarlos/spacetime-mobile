import { StatusBar } from 'expo-status-bar'
import { styled } from 'nativewind'
import { useEffect, useState } from 'react'
import { ImageBackground } from 'react-native'
import * as SecureStore from 'expo-secure-store'

import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'
import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from '@expo-google-fonts/roboto'

import { SplashScreen, Stack } from 'expo-router'
import bgBlur from '../src/assets/bg-blur.png'
import Stripes from '../src/assets/stripes.svg'

const NativeStripes = styled(Stripes)

export default function Layout() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<
    null | boolean
  >(null)

  const [isLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  })

  useEffect(() => {
    SecureStore.getItemAsync('spacetime_token').then((token) => {
      setIsUserAuthenticated(!!token)
    })
  }, [isUserAuthenticated])

  if (!isLoadedFonts) {
    return <SplashScreen />
  }

  return (
    <ImageBackground
      source={bgBlur}
      className="relative flex-1 bg-gray-900"
      imageStyle={{ position: 'absolute', left: '-100%' }}
    >
      <StatusBar style="light" translucent />

      <NativeStripes className="absolute left-2" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: 'transparent',
          },
        }}
      >
        <Stack.Screen name="index" redirect={isUserAuthenticated} />
        <Stack.Screen name="new" />
        <Stack.Screen name="memories" />
      </Stack>
    </ImageBackground>
  )
}
