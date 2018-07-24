import { call, put } from "redux-saga/effects";
import {
  registerUserResult,
  loginUserResult,
  logoutUserResult,
  editUserResult
} from "../../actions/index";
import { apiPost, apiGet, apiPatch } from "../../../utils";

export function* register(action) {
  try {
    const register = yield call(apiPost, "/api/register", action.payload);
    yield put(registerUserResult(register));
  } catch (error) {
    yield put(registerUserResult(error));
  }
}

export function* login(action) {
  try {
    const loginUser = yield call(apiPost, "/api/login", action.payload);
    yield put(loginUserResult(loginUser));
  } catch (error) {
    yield put(loginUserResult(error));
  }
}

export function* logout() {
  try {
    const logout = yield call(apiGet, "/api/logout");
    yield put(logoutUserResult(logout));
  } catch (error) {
    yield put(logoutUserResult(error));
  }
}

export function* editUserProfile(action) {
  try {
    const { payload } = action;
    const editProfile = yield call(
      apiPatch,
      `/api/current_user/${payload.id}`,
      payload.val
    );
    yield put(editUserResult(editProfile));
  } catch (error) {
    yield put(editUserResult(error));
  }
}