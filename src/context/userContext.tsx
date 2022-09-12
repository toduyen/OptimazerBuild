import React, { createContext, useContext, useMemo, useReducer } from "react";
import {
  ADD_USER,
  DELETE_USER_SUCCESS,
  EDIT_USER,
  GET_ALL_USER,
  GET_ALL_USER_SUCCESS,
  UPDATE_FILTER_USER,
  UPDATE_USER_SUCCESS,
} from "constants/action";
import { User } from "models/base/user";

// @ts-ignore
const UserContext = createContext();
UserContext.displayName = "UserContext";

type UserStateType = {
  users: Array<User>;
  filter: {
    status: string | null;
  };
};

type UserActionType = {
  type: string;
  payload: any;
};

const initialState: UserStateType = {
  users: [],
  filter: {
    status: "Đang hoạt động",
  },
};

const reducer = (state: UserStateType, action: UserActionType) => {
  switch (action.type) {
    case ADD_USER: {
      return {
        ...state,
        users: [...state.users, action.payload],
      };
    }
    case EDIT_USER: {
      const updateUser = action.payload;
      const updateUsers = state.users.map((user) => {
        if (user.id === updateUser.id) {
          return updateUser;
        }
        return user;
      });
      return {
        ...state,
        users: updateUsers,
      };
    }
    case DELETE_USER_SUCCESS: {
      const deleteUsers = state.users.map((user) => {
        if (user.id === action.payload) {
          return {
            ...user,
            status: "deleted",
          };
        }
        return user;
      });
      return {
        ...state,
        users: deleteUsers,
      };
    }
    case GET_ALL_USER: {
      return {
        ...state,
        users: action.payload,
      };
    }
    case GET_ALL_USER_SUCCESS: {
      return {
        ...state,
        users: action.payload,
      };
    }
    case UPDATE_USER_SUCCESS: {
      const updateUser = action.payload;
      const updateUsers = state.users.map((user) => {
        if (user.id === updateUser.id) {
          return updateUser;
        }
        return user;
      });
      return {
        ...state,
        users: updateUsers,
      };
    }
    case UPDATE_FILTER_USER: {
      return {
        ...state,
        filter: action.payload,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

function UserProvider({ children }: { children: React.ReactElement }) {
  const [controller, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

const useUserController = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUserController should be used inside the UserContextProvider.");
  }

  return context;
};

const addUser = (dispatch: any, user: User) => dispatch({ type: ADD_USER, payload: user });

const deleteUserSuccess = (dispatch: any, id: number) =>
  dispatch({ type: DELETE_USER_SUCCESS, payload: id });

const getAllUserSuccess = (dispatch: any, users: Array<User>) =>
  dispatch({ type: GET_ALL_USER_SUCCESS, payload: users });

const updateUserSuccess = (dispatch: any, user: User) =>
  dispatch({ type: UPDATE_USER_SUCCESS, payload: user });

const updateFilterUser = (dispatch: any, filter: any) =>
  dispatch({ type: UPDATE_FILTER_USER, payload: filter });

export {
  UserProvider,
  useUserController,
  addUser,
  getAllUserSuccess,
  updateUserSuccess,
  deleteUserSuccess,
  updateFilterUser,
};
