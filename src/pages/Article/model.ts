import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { addArticle, queryArticle, delArticle,bdelArticle,updateArticle, queryTag } from './service';

import { TableListType } from './data.d';

export interface StateType {
  tag: Array<any>;
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
    fetchTag: Effect;
    add: Effect;
    del:Effect;
    bdel:Effect;
    update: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
    saveTag: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'article',

  state: {
    tag: [],
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryArticle, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchTag({ }, { call, put }) {
      const response = yield call(queryTag);
      yield put({
        type: 'saveTag',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      yield call(addArticle, payload);
      callback && callback();
    },
    *del({ payload ,callback}, { call, put }) {
      yield call(delArticle, payload);
      callback && callback();
    },
    *bdel({ payload,callback }, { call, put }) {
      yield call(bdelArticle, payload);
      callback && callback();
    },
    *update({ payload, callback }, { call, put }) {
      yield call(updateArticle, payload);
      callback && callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        tag: [
          ...(state as StateType).tag
        ],
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
    saveTag(state, action) {
      return {
        ...state,
        tag: action.payload.data.data,
        data: {
          ...(state as StateType).data
        }
      };
    },
  },
};

export default Model;
