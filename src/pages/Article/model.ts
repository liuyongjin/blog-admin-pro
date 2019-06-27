import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { addArticle, queryArticle, delArticle,bdelArticle,updateArticle, queryTag,updateArticleStatus } from './service';

import { TableListType } from './data.d';

export interface StateType {
  tag: Array<any>;
  tag_current:number;
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
    updateStatus: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
    saveTag: Reducer<StateType>;
    addTagCurrent: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'article',

  state: {
    tag_current:1,
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
    *fetchTag({}, { call, put,select }) {
      const current = yield select((state:any) => state.article.tag_current);
      yield put({type: 'addTagCurrent'});
      const response = yield call(queryTag,{current:current});
      yield put({
        type: 'saveTag',
        payload: response,
      });
    },
    *updateStatus({payload, callback }, { call}) {
      const response = yield call(updateArticleStatus,payload);
      callback && callback(response);
    },
    *add({ payload, callback }, { call}) {
      const response = yield call(addArticle, payload);
      callback && callback(response);
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
      const response = yield call(updateArticle, payload);
      callback && callback(response);
    },
  },

  reducers: {
    save(state:any, action) {
      return {
        tag: [
          ...(state as StateType).tag
        ],
        tag_current:state.tag_current,
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
    saveTag(state:any, action) {
      return {
        ...state,
        tag_current:state.tag_current,
        tag: state.tag.concat(action.payload.data.data),
        data: {
          ...(state as StateType).data
        }
      };
    },
    addTagCurrent(state:any){
      return {
        ...state,
        tag: [
          ...(state as StateType).tag
        ],
        data: {
          ...(state as StateType).data
        },
        tag_current:state.tag_current+1
      }
    }
  },
};

export default Model;
