import { mount } from '@vue/test-utils'
import { describe, it, beforeEach, afterEach, expect } from 'vitest'
import { createTestApp } from '@/tests/testSetup'
import TodoList from '@/components/TodoList.vue'

describe('TodoList Component', () => {
  let wrapper

  beforeEach(() => {
    localStorage.clear()
    const { pinia } = createTestApp()
    wrapper = mount(TodoList, {
      global: {
        plugins: [pinia],
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders the header properly', () => {
    expect(wrapper.text()).toContain('TODO LIST')
  })

  it('adds a new todo when the add button is clicked', async () => {
    const input = wrapper.find('input[placeholder="Enter a task"]')
    const addButton = wrapper.find('[data-test="add-button"]')
    await input.setValue('New Task')
    await addButton.trigger('click')
    await wrapper.vm.$nextTick()
    const todoItems = wrapper.findAll('[data-test="todo-item"]')
    expect(todoItems.length).toBeGreaterThan(0)
    expect(todoItems[0].text()).toContain('New Task')
  })

  it('toggles a todo from pending to completed', async () => {
    const input = wrapper.find('input[placeholder="Enter a task"]')
    const addButton = wrapper.find('[data-test="add-button"]')
    await input.setValue('Toggle Task')
    await addButton.trigger('click')
    await wrapper.vm.$nextTick()

    const completeButton = wrapper.find('[data-test="complete-button"]')
    await completeButton.trigger('click')
    await wrapper.vm.$nextTick()

    const completedTab = wrapper.find('[data-test="completed-tab"]')
    await completedTab.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Toggle Task')
  })

  it('edits a todo and updates its text', async () => {
    const input = wrapper.find('input[placeholder="Enter a task"]')
    const addButton = wrapper.find('[data-test="add-button"]')
    await input.setValue('Original Task')
    await addButton.trigger('click')
    await wrapper.vm.$nextTick()

    const editButton = wrapper.find('[data-test="edit-button"]')
    await editButton.trigger('click')
    await wrapper.vm.$nextTick()

    const editInput = wrapper.find('[data-test="edit-input"]')
    await editInput.setValue('Updated Task')
    const saveButton = wrapper.find('[data-test="save-button"]')
    await saveButton.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Updated Task')
    expect(wrapper.text()).not.toContain('Task name cannot be empty!')
  })

  it('updates localStorage when a new todo is added', async () => {
    localStorage.clear()
    const input = wrapper.find('input[placeholder="Enter a task"]')
    const addButton = wrapper.find('[data-test="add-button"]')
    await input.setValue('LocalStorage Task')
    await addButton.trigger('click')
    await wrapper.vm.$nextTick()
    const todosFromStorage = JSON.parse(localStorage.getItem('todos'))
    expect(todosFromStorage.some((todo) => todo.text === 'LocalStorage Task')).toBe(true)
  })
})
