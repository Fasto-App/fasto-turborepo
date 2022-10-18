import {
  GetSpacesFromBusinessDocument,
  useCreateSpaceMutation,
  useGetSpacesFromBusinessQuery
} from "../gen/generated";


export const useSpacesMutationHook = () => {
  const [createSpace, { loading: createSpaceIsLoading }] = useCreateSpaceMutation({
    onCompleted: () => {
      console.log('space created')
    },
    update: (cache, { data: { createSpace } }) => {
      console.log('space created', createSpace)

      // @ts-ignore
      const { getSpacesFromBusiness } = cache.readQuery({ query: GetSpacesFromBusinessDocument });
      cache.writeQuery({
        query: GetSpacesFromBusinessDocument,
        data: { getSpacesFromBusiness: [createSpace, ...getSpacesFromBusiness] }
      });
    }
  });

  const { data } = useGetSpacesFromBusinessQuery();

  return {
    allSpaces: data?.getSpacesFromBusiness ?? [],
    createSpace,
  }
}


