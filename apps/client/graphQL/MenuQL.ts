import { gql, useMutation, useQuery } from "@apollo/client";
import { useAppStore } from "../business-templates/UseAppStore";
import { useGetAllMenusByBusinessIdQuery, useCreateMenuMutation, useUpdateMenuMutation, useUpdateMenuInfoMutation, useDeleteMenuMutation, GetAllMenusByBusinessIdDocument } from "../gen/generated";

const useMenuMutationHook = () => {

  const { data: allMenusByBusiness } = useGetAllMenusByBusinessIdQuery({
    onCompleted: (data) => { },
    fetchPolicy: 'network-only', // Used for first execution
    nextFetchPolicy: 'cache-first', // Used for subsequent executions
    displayName: "GET ALL MENUS"
  });

  const [createMenu,
    {
      data: newlyCreatedProduct,
      loading: createMenuIsLoading,
      error: isProductError,
      reset: resetCreateMenu
    }
  ] = useCreateMenuMutation({
    onCompleted: (data) => {

    },
    onError: (error) => {

    },
    update: (cache, { data: { createMenu } }) => {
      // @ts-ignore
      const { getAllMenusByBusinessID } = cache.readQuery({
        query: GetAllMenusByBusinessIdDocument
      });

      cache.writeQuery({
        query: GetAllMenusByBusinessIdDocument,
        data: {
          getAllMenusByBusinessID: [createMenu, ...getAllMenusByBusinessID]
        }
      });
    }
  });

  const [updateMenu] = useUpdateMenuMutation({
    onCompleted: (data) => {

    }
  });

  const [updateMenuInfo] = useUpdateMenuInfoMutation({
    onCompleted: (data) => {

    }
  });

  const [deleteMenu] = useDeleteMenuMutation({
    onCompleted: (data) => {

    },
    update: (cache, { data: { deleteMenu } }) => {
      // @ts-ignore
      const { getAllMenusByBusinessID } = cache.readQuery({
        query: GetAllMenusByBusinessIdDocument
      });
      cache.writeQuery({
        query: GetAllMenusByBusinessIdDocument,
        data: {
          getAllMenusByBusinessID: getAllMenusByBusinessID.filter(menu => menu._id !== deleteMenu._id)
        }
      });
    }
  });


  return {
    allMenusByBusiness: allMenusByBusiness?.getAllMenusByBusinessID ?? [],
    createMenu,
    updateMenu,
    updateMenuInfo,
    deleteMenu
  }

}



export { useMenuMutationHook }