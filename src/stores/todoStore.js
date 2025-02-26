import { defineStore } from 'pinia';
import { ref  } from 'vue';
export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: ref(JSON.parse(localStorage.getItem('todos')) || []),
    deletedTodos: ref(JSON.parse(localStorage.getItem('deletedTodos')) || []),
    filter: 'all',
  }),
  actions :{
    addTodo(text){
        const timestamp = Date.now();
        this.todos.push({id: timestamp, text, completed:false});
        this.saveTodos();
    },
    removeTodo(id) {
        const todoIndex = this.todos.findIndex(todo => todo.id === id);
        if (todoIndex !== -1) {
            const todo = this.todos[todoIndex];
           
            this.deletedTodos.push(todo);
            this.todos.splice(todoIndex, 1);
    
            localStorage.setItem('todos', JSON.stringify(this.todos));
            localStorage.setItem('deletedTodos', JSON.stringify(this.deletedTodos));
        } else {
            console.error(`Todo with id ${id} not found`);
        }
    },
    restoreDeleted(id) {
        const todo = this.deletedTodos.find(todo => todo.id === id);
        if (todo) {
            this.todos.push(todo); // Move back to active list
            this.deletedTodos = this.deletedTodos.filter(todo => todo.id !== id);
            this.saveTodos();
            localStorage.setItem('deletedTodos', JSON.stringify(this.deletedTodos)); 
        }
    },
    
    toggleTodo(id){
        const todo = this.todos.find(todo =>todo.id === id);
        if (todo) todo.completed = !todo.completed;
        this.saveTodos();
    },
    updateTodo(id,newText){
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) todo.text = newText;
        this.saveTodos();
    },
    setFilter(type){
        this.filter = type;
    },
    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
        localStorage.setItem('deletedTodos', JSON.stringify(this.deletedTodos));
      }
  },
  
  getters:{
    completedTodos:(state) => state.todos.filter(todo => todo.completed),
    pendingTodos: (state) => state.todos.filter(todo => !todo.completed),
    filteredTodos: (state) => {
        if (state.filter === 'completed') return state.completedTodos;
      if (state.filter === 'pending') return state.pendingTodos;
      return state.todos;
    }
  },
  

});

