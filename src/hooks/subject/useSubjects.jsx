import { useContext, useState, useEffect, useCallback } from "react";
import Context from "../../context/userContext.jsx";
import getSubjects from "../../services/subjectService/getSubjects.js";
import getSubjectById from "../../services/subjectService/getSubjectById.js";
import createNewSubject from "../../services/subjectService/createSubject.js";
import updateSubject from "../../services/subjectService/updateSubject.js";
import deleteSubject from "../../services/subjectService/deleteSubject.js";
import deleteSubjects from "../../services/subjectService/deleteSubjects.js";
import SubjectErrors from "../../errors/SubjectErrors.js";

/**
 * Custom hook for managing subjects and performing CRUD operations.
 * @returns {Object} - Contains subject list, loading state, error state, and functions for subject operations.
 */
export default function useSubjects() {
  const { jwt } = useContext(Context);
  const [subjects, setSubjects] = useState([]);
  const [stateSubjects, setStateSubjects] = useState({
    loading: false,
    error: null,
  });

  /**
   * Fetches the complete list of subjects.
   * @async
   * @function fetchSubjects
   * @returns {Promise<void>} - Updates the subjects list and loading state.
   * @throws {Object} - Updates error state with the appropriate error message if fetching fails.
   */
  const fetchSubjects = useCallback(async () => {
    setStateSubjects({ loading: true, error: null });
    try {
      const subjects = await getSubjects(jwt);
      setSubjects(subjects.reverse());
      setStateSubjects({ loading: false, error: null });
    } catch (error) {
      const errorCode = error.response?.status;
      const errorMessage = error.response?.data?.message;
      const clientMessage = error.message;
      const handledError = SubjectErrors.handleError({
        code: errorCode,
        error: errorMessage,
        httpError: clientMessage,
      });
      setStateSubjects({
        loading: false,
        error: handledError,
      });
    }
  }, [jwt]);

  /**
   * Fetches a specific subject by its ID.
   * @async
   * @function fetchSubjectById
   * @param {number} subjectId - The ID of the subject to retrieve.
   * @returns {Promise<Object|null>} - The retrieved subject data or null if an error occurs.
   */
  const fetchSubjectById = useCallback(
    async (subjectId) => {
      setStateSubjects({ loading: true, error: null });
      try {
        const subject = await getSubjectById({ subjectId, token: jwt });
        setStateSubjects({ loading: false, error: null });
        return { success: true, data: subject };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = SubjectErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [subjectId],
        });
        setStateSubjects({
          loading: false,
          error: handledError,
        });
        return { success: false, error: handledError };
      }
    },
    [jwt]
  );

  /**
   * Adds a new subject to the list.
   * @async
   * @function addSubject
   * @param {string} subjectName - The name of the subject to add.
   * @returns {Promise<Object>} - Result of the operation with success status and subject or error message.
   * @throws {Object} - Returns an error message if the addition fails.
   */
  const addSubject = useCallback(
    async (subjectName) => {
      try {
        const newSubject = await createNewSubject({ subjectName, token: jwt });
        setSubjects((prevSubjects) => [newSubject, ...prevSubjects]);
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = SubjectErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        return { success: false, error: handledError.message };
      }
    },
    [jwt]
  );

  /**
   * Updates an existing subject by ID.
   * @async
   * @function modifySubject
   * @param {number} id - The ID of the subject to update.
   * @param {string} subjectName - The new name of the subject.
   * @returns {Promise<Object>} - Result of the operation with success status and updated subject or error message.
   * @throws {Object} - Returns an error message if the update fails.
   */
  const modifySubject = useCallback(
    async (id, subjectName) => {
      try {
        const updatedSubject = await updateSubject({
          id,
          subjectName,
          token: jwt,
        });
        const formattedSubject = {
          id: updatedSubject.id,
          subject_name: updatedSubject.subjectName,
        };
        setSubjects((prevSubjects) =>
          prevSubjects.map((subject) =>
            subject.id === id ? formattedSubject : subject
          )
        );
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = SubjectErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [id],
        });
        return { success: false, error: handledError.message };
      }
    },
    [jwt]
  );

  /**
   * Deletes an existing subject by ID.
   * @async
   * @function removeSubject
   * @param {number} id - The ID of the subject to delete.
   * @returns {Promise<Object>} - Result of the operation with success status or error message.
   * @throws {Object} - Returns an error message if the deletion fails.
   */
  const removeSubject = useCallback(
    async (id) => {
      try {
        await deleteSubject({ id, token: jwt });
        setSubjects((prevSubjects) =>
          prevSubjects.filter((subject) => subject.id !== id)
        );
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = SubjectErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [id],
        });
        return { success: false, error: handledError.message };
      }
    },
    [jwt]
  );

  /**
   * Deletes multiple subjects by their IDs.
   * @param {Array<number>} subjectIds - Array of subject IDs to delete.
   * @returns {Promise<Object>} - Success status or error message.
   */
  const deleteSubjectsBatch = useCallback(
    async (subjectIds) => {
      try {
        const success = await deleteSubjects({ subjectIds, token: jwt });
        if (success) {
          setSubjects((prevSubjects) =>
            prevSubjects.filter((subject) => !subjectIds.includes(subject.id))
          );
          return { success: true };
        }
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const subjects =   error.response?.data?.errors?.associatedSubjects?.map(
            (subject) => subject.name
          ) || subjectIds
        const handledError = SubjectErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: subjects,
        });
        return { success: false, error: handledError.message };
      }
    },
    [jwt]
  );

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  return {
    subjects,
    loading: stateSubjects.loading,
    error: stateSubjects.error,
    fetchSubjects,
    fetchSubjectById,
    addSubject,
    modifySubject,
    removeSubject,
    deleteSubjectsBatch,
  };
}
