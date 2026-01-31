import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import PostList from './pages/Posts/PostList'
import PostEdit from './pages/Posts/PostEdit'
import CategoryList from './pages/Categories/CategoryList'
import TagList from './pages/Tags/TagList'
import UserList from './pages/Users/UserList'
import Login from './pages/Login'
import { AuthProvider, useAuth } from './contexts/AuthContext'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center h-screen">読み込み中...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="posts">
              <Route index element={<PostList />} />
              <Route path="create" element={<PostEdit />} />
              <Route path="edit/:id" element={<PostEdit />} />
            </Route>
            <Route path="categories" element={<CategoryList />} />
            <Route path="tags" element={<TagList />} />
            <Route path="users" element={<UserList />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App