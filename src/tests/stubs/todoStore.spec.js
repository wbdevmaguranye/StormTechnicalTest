import { describe, it, beforeEach, expect } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTodoStore } from '@/stores/todoStore'

describe('Todo Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('initializes with empty state', () => {
    const store = useTodoStore()
    expect(store.todos).toEqual([])
    expect(store.deletedTodos).toEqual([])
    expect(store.filter).toBe('all')
  })

  it('adds a new todo', () => {
    const store = useTodoStore()
    store.addTodo('Test Todo')
    expect(store.todos.length).toBe(1)
    expect(store.todos[0]).toHaveProperty('text', 'Test Todo')

    const storedTodos = JSON.parse(localStorage.getItem('todos'))
    expect(storedTodos.length).toBe(1)
  })

  it("toggles a todo's completed state", () => {
    const store = useTodoStore()
    store.addTodo('Toggle Todo')
    const todo = store.todos[0]
    expect(todo.completed).toBe(false)

    store.toggleTodo(todo.id)
    expect(todo.completed).toBe(true)

    store.toggleTodo(todo.id)
    expect(todo.completed).toBe(false)
  })

  it("updates a todo's text", () => {
    const store = useTodoStore()
    store.addTodo('Original Text')
    const todo = store.todos[0]
    store.updateTodo(todo.id, 'Updated Text')
    expect(todo.text).toBe('Updated Text')
  })

  it('removes a todo and adds it to deletedTodos', () => {
    const store = useTodoStore()
    store.addTodo('Todo to Delete')
    const todo = store.todos[0]

    store.removeTodo(todo.id)
    expect(store.todos.length).toBe(0)
    expect(store.deletedTodos.length).toBe(1)
    expect(store.deletedTodos[0].text).toBe('Todo to Delete')
  })

  it('restores a deleted todo', () => {
    const store = useTodoStore()
    store.addTodo('Todo to Restore')
    const todo = store.todos[0]

    store.removeTodo(todo.id)
    expect(store.todos.length).toBe(0)

    store.restoreDeleted(todo.id)
    expect(store.todos.length).toBe(1)
    expect(store.todos[0].text).toBe('Todo to Restore')
  })

  it('sets filter correctly', () => {
    const store = useTodoStore()
    store.setFilter('pending')
    expect(store.filter).toBe('pending')
  })

  it('getter: filteredTodos returns todos based on filter', () => {
    const store = useTodoStore()
    store.addTodo('Todo 1')
    store.addTodo('Todo 2')

    store.setFilter('pending')
    expect(store.filteredTodos).toEqual(store.pendingTodos)

    store.setFilter('completed')
    expect(store.filteredTodos).toEqual(store.completedTodos)

    store.setFilter('all')
    expect(store.filteredTodos).toEqual(store.todos)
  })
})
