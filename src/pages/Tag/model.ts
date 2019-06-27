import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { addTag, queryTag, delTag,bdelTag,updateTag } from './service';

import { TableListType } from './data.d';

export interface StateType {
  data: TableListType;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    add: Effect;
    del:Effect;
    bdel:Effect;
    update: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'tag',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryTag, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call}) {
      const response =yield call(addTag, payload);
      callback && callback(response);
    },
    *del({ payload, callback }, { call }) {
      yield call(delTag, payload);
      callback && callback();
    },
    *bdel({ payload, callback }, { call}) {
      yield call(bdelTag, payload);
      callback && callback();
    },
    *update({ payload, callback }, { call}) {
      const response = yield call(updateTag, payload);
      callback && callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: {
          list: action.payload.data.data,
          pagination: {
            total: action.payload.data.total,
            pageSize: action.payload.data.pageSize,
            current: action.payload.data.current
          }
        },
      };
    },
  },
};

export default Model;
