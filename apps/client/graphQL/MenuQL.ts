import { gql, useMutation, useQuery } from "@apollo/client";
import { useAppStore } from "../business-templates/UseAppStore";
import { useGetAllMenusByBusinessIdQuery, useCreateMenuMutation, useUpdateMenuMutation, useUpdateMenuInfoMutation, useDeleteMenuMutation, GetAllMenusByBusinessIdDocument } from "../gen/generated";

const useMenuMutationHook = () => {

  const { data: allMenusByBusiness } = useGetAllMenusByBusinessIdQuery();

  const [createMenu] = useCreateMenuMutation({
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

    },
    updateQueries: {
      getAllMenusByBusinessID: (prev, { mutationResult }) => {
        return Object.assign({}, prev, {
          getAllMenusByBusinessID: mutationResult.data.updateMenu
        });
      }
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