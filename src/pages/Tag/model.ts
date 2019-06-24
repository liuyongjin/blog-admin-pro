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
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addTag, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *del({ payload }, { call, put }) {
      yield call(delTag, payload);
      yield put({
        type: 'fetch',
      });
    },
    *bdel({ payload }, { call, put }) {
      yield call(bdelTag, payload);
      yield put({
        type: 'fetch',
      });
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateTag, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
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
