import React from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from './Layout/Layout'
import Todo from './pages/Todo/Todo'
import TodoId from './pages/TodoId/TodoId'


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Todo />
      },
      {
        path: '/TodoId/:id',
        element: <TodoId />
      },
    ]
  }
])
const App = () => {
  return (
    <RouterProvider router={router}></RouterProvider>
  )
}

export default App