import { useEffect, useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as SecureStore from 'expo-secure-store'
import Icon from '@expo/vector-icons/Feather'
import { Link, useRouter } from 'expo-router'
import { api } from '../src/lib/api'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import LogoSpacetime from '../src/assets/logo-spacetime.svg'

dayjs.locale(ptBR)

interface Memory {
  coverUrl: string
  excerpt: string
  id: string
  createdAt: string
}

export default function Memories() {
  const { bottom, top } = useSafeAreaInsets()
  const router = useRouter()
  const [memories, setMemories] = useState<Memory[]>([])

  const currentDate = (createdAt: string): string => {
    const date = dayjs(createdAt).format('D[ de ]MMMM[, ]YYYY')

    return date
  }

  async function signOut() {
    await SecureStore.deleteItemAsync('spacetime_token')

    router.push('/')
  }

  async function loadMemories() {
    const token = await SecureStore.getItemAsync('spacetime_token')

    const response = await api.get('/memories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    setMemories(response.data)
  }

  useEffect(() => {
    loadMemories()
  }, [])

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex-row items-center justify-between px-8">
        <LogoSpacetime />

        <View className="flex-row gap-2">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={signOut}
            className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
          >
            <Icon name="log-out" size={16} color="#fff" />
          </TouchableOpacity>

          <Link href="/new" asChild>
            <TouchableOpacity
              className="h-10 w-10 items-center justify-center rounded-full bg-green-500"
              activeOpacity={0.7}
            >
              <Icon name="plus" size={16} color="#000" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View className="mb-10  mt-6 space-y-10">
        {memories.map((memory) => {
          return (
            <View className="space-y-4" key={memory.id}>
              <View className="flex-row items-center gap-2">
                <View className="h-px w-5 bg-gray-50" />
                <Text className="font-body text-xs text-gray-100">
                  {currentDate(memory.createdAt)}
                </Text>
              </View>
              <View className="space-y-4 px-8">
                <Image
                  source={{
                    uri: memory.coverUrl,
                  }}
                  className="aspect-video w-full rounded-lg"
                  alt=""
                />
                <Text className="font-body text-base leading-relaxed text-gray-100">
                  {memory.excerpt}
                </Text>
                <Link href={`/memories/${memory.id}`} asChild>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    className="flex-row items-center gap-2"
                  >
                    <Text className="font-body text-sm text-gray-200">
                      Ler mais
                    </Text>
                    <Icon name="arrow-right" size={16} color="#9e9ea0" />
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}
