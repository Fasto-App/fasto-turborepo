import { Heading, HStack, Box, Button, Text, FlatList } from 'native-base'
import React, { useCallback } from 'react'
import { CustomModal } from '../../components/CustomModal/CustomModal'
import { getClientCookies } from '../../cookies'
import { useAcceptInvitationMutation, useGetPendingInvitationsQuery, useDeclineInvitationMutation, GetPendingInvitationsDocument, GetClientSessionDocument } from '../../gen/generated'
import { texts } from './texts'
import { useRouter } from 'next/router'
import { showToast } from '../../components/showToast'

type PendingInvitationModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}

const refetchOptions = [
  { query: GetPendingInvitationsDocument, },
  { query: GetClientSessionDocument }]

export const PendingInvitationModal = (props: PendingInvitationModalProps) => {
  const { isModalOpen, setIsModalOpen } = props

  const { query } = useRouter()
  const { businessId } = query

  const token = getClientCookies(businessId as string)

  const { data, loading } = useGetPendingInvitationsQuery({
    skip: !token,
    pollInterval: 1000 * 60,
    fetchPolicy: "network-only"
  })

  const [acceptInvitation, { loading: acceptLoading }] = useAcceptInvitationMutation({
    refetchQueries: refetchOptions,
    onCompleted: () => {
      showToast({
        message: texts.invitationAccepted,
      })
    },
    onError: (error) => {
      showToast({
        message: texts.errorAcceptingInvitation,
        subMessage: error.message,
        status: "error"
      })
    }
  })
  const [declineInvitation, { loading: declineLoading }] = useDeclineInvitationMutation({
    refetchQueries: refetchOptions,
    onCompleted: () => {
      showToast({
        message: texts.invitationDeclined,
      })
    },
    onError: (error) => {
      showToast({
        message: texts.errorDecliningInvitation,
        subMessage: error.message,
        status: "error"
      })
    }
  })

  const onDecline = useCallback((id: string) => {
    declineInvitation({
      variables: {
        input: {
          _id: id
        }
      }
    })
  }, [declineInvitation])

  const onAccept = useCallback((id: string) => {
    acceptInvitation({
      variables: {
        input: {
          _id: id
        }
      }
    })
  }, [acceptInvitation])

  return (
    <CustomModal
      size={"full"}
      onClose={() => setIsModalOpen(false)}
      isOpen={isModalOpen}
      HeaderComponent={<Heading textAlign={"center"} fontSize={"2xl"}>
        {texts.pendingInvitations}
      </Heading>}
      ModalBody={loading ? <Text>Loading</Text> : <FlatList
        data={data?.getPendingInvitations}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) =>
          <PendingInvitationTile
            index={index}
            name={item?.requestor?.name}
            phone={item?.requestor?.phoneNumber}
            loading={acceptLoading || declineLoading}
            onDecline={() => onDecline(item._id)}
            onAccept={() => onAccept(item._id)}
          />}
        ListEmptyComponent={<Text textAlign={"center"}>{texts.noPendingInvitations}</Text>}
      />}
      ModalFooter={<Button
        colorScheme={"gray"}
        w={"100%"}
        onPress={() => setIsModalOpen(false)}>
        {texts.close}
      </Button>}
    />
  )
}

const PendingInvitationTile = ({ index, onDecline, onAccept, name, phone, loading }: {
  index: number,
  name?: string | null,
  phone?: string | null,
  onDecline: () => void,
  onAccept: () => void
  loading?: boolean
}) => {
  return (
    <HStack
      space={4}
      p={2}
      backgroundColor={index % 2 === 0 ? "secondary.200" : "white"}
      borderRadius={"md"}
      alignItems={"center"}
    >
      <Box flex={1}>
        <Text fontSize={"lg"}>
          {name}
        </Text>
        <Text fontSize={"md"}>
          {phone}
        </Text>
      </Box>
      <Button.Group h={"10"} flex={1} justifyContent={"space-between"} space={4}>
        <Button flex={1} colorScheme={"tertiary"} onPress={onAccept} isLoading={loading}>
          {texts.accept}
        </Button>
        <Button flex={1} onPress={onDecline} isLoading={loading}>
          {texts.decline}
        </Button>
      </Button.Group>
    </HStack>
  )
}
