import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category, Manager, Email } from '../../../types';

interface ManagerState {
  categories: Category[];
  managers: Manager[];
  emails: Email[];
  loading: boolean;
}

const initialState:ManagerState = {
  categories: [],
  managers: [],
  emails: [],
  loading: false,
} satisfies ManagerState;

const managerSlice = createSlice({
  name: 'manager',
  initialState,
  reducers: {
    setCategories(state, { payload }: PayloadAction<Category[]>) {
      state.categories = payload;
    },
    addCategoryToState(state, { payload }: PayloadAction<Category>) {
      state.categories.push(payload);
    },
    updateCategoryInState(state, { payload }: PayloadAction<Category>) {
      const index = state.categories.findIndex(c => c.id === payload.id);
      if (index !== -1) state.categories[index] = payload;
    },
    removeCategoryFromState(state, { payload }: PayloadAction<number>) {
      state.categories = state.categories.filter(c => c.id !== payload);
    },
    setManagers(state, { payload }: PayloadAction<Manager[]>) {
      state.managers = payload;
    },
    addManagerToState(state, { payload }: PayloadAction<Manager>) {
      state.managers.push(payload);
    },
    updateManagerInState(state, { payload }: PayloadAction<Manager>) {
      const index = state.managers.findIndex(m => m.id === payload.id);
      if (index !== -1) state.managers[index] = payload;
    },
    setEmails(state, { payload }: PayloadAction<Email[]>) {
      state.emails = payload;
    },
    setLoading(state, { payload }: PayloadAction<boolean>) {
      state.loading = payload;
    },
  },
});

export const {
  setCategories, addCategoryToState, updateCategoryInState, removeCategoryFromState,
  setManagers, addManagerToState, updateManagerInState,
  setEmails, setLoading,
} = managerSlice.actions;

export default managerSlice.reducer;