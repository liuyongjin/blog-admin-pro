import { queryCurrent} from '@/services/user';

import { Effect } from 'dva';
import { Reducer } from 'redux';

export interface CurrentUser {
  id?: number;
  avatar?: string;
  username?: string;
  nickname?: string;
  create_time?: string;
  delete_time?: string;
  last_login_ip?: string;
  last_login_time?: number;
  update_time?: string;
}

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload.data || {},
      };
    },
  },
};

export default UserModel;
