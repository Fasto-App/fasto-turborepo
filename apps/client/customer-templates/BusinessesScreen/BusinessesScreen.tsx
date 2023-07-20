import React, { useEffect } from "react"
import Link from 'next/link';
import { Image, HStack, Text, Center, VStack, useBreakpointValue, Skeleton, Box, Pressable, AspectRatio, FlatList, Heading } from "native-base"
import { useRouter } from "next/router";
import { Helmet } from "react-helmet";
import { useGetAllBusinessQuery } from "../../gen/generated";
import { NavigationButton } from "../../components/atoms/NavigationButton";
import { businessRoute, customerRoute } from "fasto-route";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase/init";

const width = {
  base: 220,
  sm: 270
}

const LoadingTiles = () => {
  return (
    <VStack space={6} justifyContent="center" alignItems={"center"} p={4} w={"100%"}>
      {[1, 2, 3].map((i) => {
        return (
          <Box w="100%" h="32" key={i} bg="primary.100" rounded="md" shadow={3}>
            <Skeleton w="100%" h="100%" rounded="md" />
          </Box>
        )
      })}
    </VStack>
  )
}

export const BusinessesScreen = () => {
  const { data, loading, error } = useGetAllBusinessQuery()
  const router = useRouter()

  const columnNum = useBreakpointValue({
    base: 1,
    lg: 2
  });

  useEffect(() => {
    analytics && logEvent(analytics, "page_view", {
      page_title: "Partners",
      page_path: router.pathname
    })
  }, [router.pathname])

  return (
    <Box flex={1} background={"white"}>
      <Box backgroundColor={"pink"} h={"full"}>
        <HStack position={"revert"} justifyContent={"space-between"} p={8}>
          <Image src="/images/fasto-logo.svg" alt="Fasto Logo" height={36} width={180} />
          <Center>
            <div style={{
              background: "linear-gradient(349deg, rgba(227,232,0,1) 0%, rgba(255,102,0,1) 25%)",
              borderRadius: "100%"
            }}>
              <NavigationButton
                type={"UserAdd"}
                color="black"
                onPress={function (): void {
                  router.push(businessRoute.login);
                }} />
            </div>
          </Center>
        </HStack>
        <FlatList
          key={columnNum}
          numColumns={columnNum}
          data={data?.getAllBusiness}
          ListEmptyComponent={
            loading ? <LoadingTiles /> :
              error ? <Text>Error</Text> : null
          }
          ItemSeparatorComponent={() => <Box h={4} />}
          renderItem={({ item: business }) => {
            if (!business?._id) return null
            return (<BusinessCard
              name={business.name}
              _id={business._id}
              description={business.description}
              imageUrl={business.picture}
            />)
          }}
        />
      </Box >
      <Helmet>
        <title>Fasto</title>
        <script type="application/javascript" async>
          {`
						console.log("Hello World")
					`}
        </script>
      </Helmet>
    </Box>
  );
}

const numChars = 150

const BusinessCard = ({ name, _id, description, imageUrl }: { name: string, _id: string, description?: string | null, imageUrl?: string | null }) => {

  // if description is too Long, cut it 
  if (description && description.length > numChars) {
    description = description.slice(0, numChars) + "..."
  }

  return (
    <Pressable key={_id}
      p={4}
      flex={1}
      marginX={4}
      borderRadius={"md"}
      borderWidth={1}
      borderColor={"gray.200"}
      _hover={{
        backgroundColor: "gray.50",
        shadow: "2",
      }}>
      <Link href={`${customerRoute["/customer/[businessId]"].replace(`[businessId]`, _id)}`}>
        <HStack flex={1} space={4}>
          <Box>
            <AspectRatio
              height={{ base: 100, sm: 120 }}
              ratio={{ base: 1, sm: 1 }}>
              <Image
                borderRadius={"md"}
                src={imageUrl ?? "/images/fasto-logo.svg"} alt={name}
                resizeMode={"cover"} />
            </AspectRatio>
          </Box>
          <VStack flex={1} space={2}>
            <Heading size={"md"}>{name}</Heading>
            <Text color={"gray.600"}>{description}</Text>
          </VStack>
        </HStack>
      </Link>
    </Pressable>
  )
}