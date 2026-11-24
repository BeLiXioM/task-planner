import { vi, afterEach, test, expect } from "vitest";
import { countActiveTasks } from "./task-utils.js";
import { filterTasks } from "./task-utils.js";
import { isTaskOverdue } from "./task-utils.js";

afterEach(() => {
  vi.useRealTimers();
});

test("считает только невыполненные задачи", () => {
  const tasks = [
    { completed: false },
    { completed: true },
    { completed: false }
  ];

  const result = countActiveTasks(tasks);

  expect(result).toBe(2);
});

test("считает пустой массив", () => {
    const result = countActiveTasks([]);

    expect(result).toBe(0);
});

test("все задачи выполнены", () => {
    const tasks = [
        {completed: true},
        {completed: true}
    ]

    const result = countActiveTasks(tasks);
    expect(result).toBe(0);
});

test("возвращает только активные задачи", () => {
    const tasks = [
        {completed: true},
        {completed: false}
    ]

    const result = filterTasks(tasks, "active");

    expect(result).toEqual([{ completed: false }]);
});

test("возвращает только выполненные задачи", () => {
    const tasks = [
        {completed: true},
        {completed: false}
    ]

    const result = filterTasks(tasks, "completed");

    expect(result).toEqual([{ completed: true }]);
});

test("возвращает все задачи", () => {
    const tasks = [
        {completed: true},
        {completed: false}
    ]

    const result = filterTasks(tasks, "all");

    expect(result).toEqual(tasks);
});

test("вчерашняя невыполненная задача просрочена", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-24T12:00:00"));
    const task = {
    completed: false,
    dueDate: "2026-11-23"
};
 const result = isTaskOverdue(task);
 
 expect(result).toBe(true);
});

test("сегодняшняя невыполненная задача не просрочена", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-24T12:00:00"));
    const task = {
    completed: false,
    dueDate: "2026-11-24"
};
const result = isTaskOverdue(task);
 
 expect(result).toBe(false);
})

test("выполненная задача со вчерашним сроком", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-24T12:00:00"));
    const task = {
    completed: true,
    dueDate: "2026-11-23"
};
const result = isTaskOverdue(task);
 
 expect(result).toBe(false);
})

test("Невыполненная задача без срока", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-24T12:00:00"));
    const task = {
    completed: false,
    dueDate: ""
};
const result = isTaskOverdue(task);
 
 expect(result).toBe(false);
})