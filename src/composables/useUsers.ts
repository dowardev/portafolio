import { useUsersStore } from "../store/usersStore";
import { storeToRefs } from "pinia";
import { SearchUsersResponse, User } from "../services/interfaces";
import { deleteUserAccount } from "../services/user";
import { useSystem } from "./useSystem";
import {
  searchUsers,
  getUsersPaginated as getUsersPaginated2,
} from "../services/admin";

export const useUsers = () => {
  const usersStore = useUsersStore();
  const users = storeToRefs(usersStore).users;
  const openToastError = useSystem().openToastError;

  async function loadUsers(params: {
    paginatorInfo: { pagination: number; page: number };
    search: string;
    filterOptions: string;
  }): Promise<SearchUsersResponse> {
    const first = params.paginatorInfo.pagination;
    const page = params.paginatorInfo.page;
    const search = params.search;
    const filterOptions = params.filterOptions;

    try {
      const response = await searchUsers({
        first,
        page,
        search,
        filterOptions,
      });

      return response;
    } catch (error: any) {
      if (error.message == "Unauthorized") console.log("Unauthorized user");
      openToastError(error);
      throw error;
    }
  }

  async function getUsersPaginated(params: {
    page: number;
    perPage: number;
  }): Promise<SearchUsersResponse> {
    const { page, perPage } = params;

    try {
      const response = await getUsersPaginated2({
        page,
        perPage,
      });

      return response;
    } catch (error: any) {
      if (error.message == "Unauthorized") console.log("Unauthorized user");
      openToastError(error);
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
    getUsersPaginated,
  };
};
