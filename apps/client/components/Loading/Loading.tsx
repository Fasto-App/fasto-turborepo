import React from 'react'
import { Center, Modal, Spinner } from 'native-base'


export function Loading({ isLoading }: { isLoading: boolean }) {
  return (
    <Modal isOpen={isLoading} >
      <Center justifyContent="center" alignItems="center">
        <Spinner size="lg" />
      </Center>
    </Modal>
  )
};