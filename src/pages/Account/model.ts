import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import { modifyInfo,modifyAvatar } from './service';

export interface ModalState {
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: ModalState) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: ModalState;
  effects: {
    modifyUserInfo: Effect;
    modifyUserAvatar: Effect;
  };
  reducers: {
  };
}

const Model: ModelType = {
  namespace: 'account',

  state: {
    currentUser: {}
  },

  effects: {
    *modifyUserInfo({callback,payload}, { call }) {
      const response = yield call(modifyInfo,payload);
      callback&&callback(response);
    },
    *modifyUserAvatar({callback,payload}, { call }) {
      const response = yield call(modifyAvatar,payload);
      callback&&callback(response);
    }
  },

  reducers: {
  
  },
};

export default Model;
