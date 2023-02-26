import React from 'react'
import { VStack } from 'native-base'
import { MenuList } from './MenuList'
import MenuProducts from './MenuProducts'
import { ModalFeedback } from '../../components/ModalFeedback/ModalFeedback'
import { Box } from 'native-base';
import { useGetAllMenusByBusinessIdQuery } from '../../gen/generated'
import { useAppStore } from '../UseAppStore'
import { Loading } from '../../components/Loading'

const MenuScreen = () => {
  const setNetworkState = useAppStore(state => state.setNetworkState)
  const { data, loading: loadingQuery } = useGetAllMenusByBusinessIdQuery({
    onError: () => {
      setNetworkState("error")
    }
  });

  return (
    <Box flex={1}>
      <Box
        backgroundColor={"primary.500"}
        h={100}
        w={"100%"}
        position={"absolute"}
        zIndex={-1}
      />
      <VStack flex={1} m={"4"} space={"4"}>
        <MenuList menusData={data?.getAllMenusByBusinessID ?? []} />
        {data?.getAllMenusByBusinessID ? (
          <MenuProducts
            menusData={data?.getAllMenusByBusinessID}
          />
        ) : null}
      </VStack>
      <Loading isLoading={loadingQuery} />
    </Box>
  )
}

export { MenuScreen }