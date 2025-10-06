import { SubjectsData, CreateSubjectPayload, UpdateSubjectPayload } from '../types';
import { loadSubjectsFromCache, createSubjectMock, updateSubjectMock, deleteSubjectMock } from '../mock/db';

export async function getSubjects(): Promise<SubjectsData> {
  return new Promise((res) => setTimeout(() => res(loadSubjectsFromCache()), 150));
}

export async function createSubject(data: CreateSubjectPayload) {
  return new Promise((res) => setTimeout(() => res(createSubjectMock({ ...data, status: 1 })), 150));
}

export async function updateSubject(data: UpdateSubjectPayload) {
  return new Promise((res) => setTimeout(() => res(updateSubjectMock({ ...data } as any)), 150));
}

export async function deleteSubject(id: number) {
  return new Promise((res) => setTimeout(() => { deleteSubjectMock(id); res(undefined); }, 150));
}
