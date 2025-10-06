import { SchoolYearsData, CreateSchoolYearPayload, UpdateSchoolYearPayload } from '../types';
import { loadSchoolYearsFromCache, createSchoolYearMock, updateSchoolYearMock, deleteSchoolYearMock } from '../mock/db';

export async function getSchoolYears(): Promise<SchoolYearsData> {
  return new Promise((res) => setTimeout(() => res(loadSchoolYearsFromCache()), 150));
}

export async function createSchoolYear(data: CreateSchoolYearPayload) {
  return new Promise((res) => setTimeout(() => res(createSchoolYearMock({ ...data, status: 1 })), 150));
}

export async function updateSchoolYear(data: UpdateSchoolYearPayload) {
  return new Promise((res) => setTimeout(() => res(updateSchoolYearMock({ ...data } as any)), 150));
}

export async function deleteSchoolYear(id: number) {
  return new Promise((res) => setTimeout(() => { deleteSchoolYearMock(id); res(undefined); }, 150));
}
