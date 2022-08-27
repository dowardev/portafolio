import { useUsersStore } from "../store/usersStore";
import { storeToRefs } from "pinia";
import { Graphql, SearchUsersResponse, User } from "../services/interfaces";
import { deleteUserAccount, getUser } from "../services/user";
import { openToastErrror } from "../services/system";
import { searchUsers } from "../services/admin";

export const useUsers = () => {
  const usersStore = useUsersStore();
  const users = storeToRefs(usersStore).users;

  async function loadUsers(params: {
    graphql: Graphql;
    paginatorInfo: { pagination: number; page: number };
    search: string;
    filterOptions: string;
  }): Promise<SearchUsersResponse> {
    const graphqlName = params.graphql.name;
    const graphqlFragment = params.graphql.fragment;
    const refetch = params.graphql.refetch;
    const first = params.paginatorInfo.pagination;
    const page = params.paginatorInfo.page;
    const search = params.search;
    const filterOptions = params.filterOptions;

    try {
      const response = await searchUsers({
        graphql: {
          name: graphqlName,
          fragment: graphqlFragment,
          refetch,
        },
        first,
        page,
        search,
        filterOptions,
      });

      return response;
    } catch (error: any) {
      if (error.message == "Unauthorized") console.log("Unauthorized user");
      openToastErrror(error);
      throw error;
    }
  }

  function updateUsers(params: { users: Array<User> }) {
    const users = params.users;
    usersStore.updateUsersProps({ users });
  }

  async function deleteAccount(params: { password: string }) {
    try {
      await deleteUserAccount({
        password: params.password,
      });
    } catch (e: any) {
      throw e;
    }
  }

  return {
    // functions
    loadUsers,
    deleteAccount,
    updateUsers,

    // props
    users,

    // computed
    // imageProfile,
  };
};
