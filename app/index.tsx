import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { ImageBackground, View, Text, TouchableOpacity } from 'react-native'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import { styled } from 'nativewind'
import * as SecureStore from 'expo-secure-store'

import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from '@expo-google-fonts/roboto'
import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'

import bgBlur from '../src/assets/bg-blur.png'
import Stripes from '../src/assets/stripes.svg'
import LogoSpacetime from '../src/assets/logo-spacetime.svg'
import { api } from '../src/lib/api'

const NativeStripes = styled(Stripes)

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint:
    'https://github.com/settings/connections/applications/06343eb35612e9412779',
}

export default function App() {
  const router = useRouter()

  const [isLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  })

  // eslint-disable-next-line no-unused-vars
  const [request, response, signInWithGithub] = useAuthRequest(
    {
      clientId: '06343eb35612e9412779',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'spacetime',
      }),
    },
    discovery,
  )

  async function handleGithubOAuthCode(code: string) {
    const response = await api.post('/register', { code })

    const { token } = response.data

    await SecureStore.setItemAsync('spacetime_token', token)

    router.push('/memories')
  }

  useEffect(() => {
    // console.log(
    //   makeRedirectUri({
    //     scheme: 'spacetime',
    //   }),
    // )

    if (response?.type === 'success') {
      const { code } = response.params

      handleGithubOAuthCode(code)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response])

  if (!isLoadedFonts) {
    return null
  }

  return (
    <ImageBackground
      source={bgBlur}
      className="relative flex-1 items-center bg-gray-900 px-8 py-10"
      imageStyle={{ position: 'absolute', left: '-100%' }}
    >
      <StatusBar style="light" translucent />

      <NativeStripes className="absolute left-2" />

      <View className="flex-1 items-center justify-center gap-6">
        <LogoSpacetime />

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-50">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-3"
          onPress={() => signInWithGithub()}
        >
          <Text className="font-alt text-sm uppercase text-black">
            Cadastrar lembrança
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 por Finotelli
      </Text>
    </ImageBackground>
  )
}
