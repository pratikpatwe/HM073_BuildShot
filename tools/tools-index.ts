// ===== SET DATA TOOLS =====
import { addTransaction } from "./setData/finance";
import { createHabit, logHabit } from "./setData/habits";
import { createJournalEntry } from "./setData/journal";
import { createTodoTask, markTodoTaskStatus } from "./setData/todo";
import { createCalendarEvent } from "./setData/events";

// ===== DELETE DATA TOOLS =====
import { deleteTransactions } from "./deleteData/finance";
import { deleteHabit } from "./deleteData/habits";
import { deleteJournalEntry } from "./deleteData/journal";
import { deleteTodoTask } from "./deleteData/todo";
import { deleteCalendarEvent } from "./deleteData/events";

// ===== GET DATA TOOLS =====
import { getTransactions } from "./getData/finance";
import { getHabits, getHabitLogs } from "./getData/habits";
import { getJournalEntries } from "./getData/journal";
import { getTodoTasks } from "./getData/todo";
import { getCalendarEvents } from "./getData/events";

/**
 * All available AI tools for setting user data
 */
export const setDataTools = [
    addTransaction,
    createHabit,
    logHabit,
    createJournalEntry,
    createTodoTask,
    markTodoTaskStatus,
    createCalendarEvent
];

/**
 * All available AI tools for deleting user data
 */
export const deleteDataTools = [
    deleteTransactions,
    deleteHabit,
    deleteJournalEntry,
    deleteTodoTask,
    deleteCalendarEvent
];

/**
 * All available AI tools for retrieving user data
 */
export const getDataTools = [
    getTransactions,
    getHabits,
    getHabitLogs,
    getJournalEntries,
    getTodoTasks,
    getCalendarEvents
];

/**
 * Mapping of tool names to their implementations for easy lookup
 */
export const toolsMap: Record<string, any> = {
    // Set Data Tools
    [addTransaction.name]: addTransaction,
    [createHabit.name]: createHabit,
    [logHabit.name]: logHabit,
    [createJournalEntry.name]: createJournalEntry,
    [createTodoTask.name]: createTodoTask,
    [markTodoTaskStatus.name]: markTodoTaskStatus,
    [createCalendarEvent.name]: createCalendarEvent,

    // Delete Data Tools
    [deleteTransactions.name]: deleteTransactions,
    [deleteHabit.name]: deleteHabit,
    [deleteJournalEntry.name]: deleteJournalEntry,
    [deleteTodoTask.name]: deleteTodoTask,
    [deleteCalendarEvent.name]: deleteCalendarEvent,

    // Get Data Tools
    [getTransactions.name]: getTransactions,
    [getHabits.name]: getHabits,
    [getHabitLogs.name]: getHabitLogs,
    [getJournalEntries.name]: getJournalEntries,
    [getTodoTasks.name]: getTodoTasks,
    [getCalendarEvents.name]: getCalendarEvents
};

export const allTools = [...setDataTools, ...deleteDataTools, ...getDataTools];

export default allTools;
