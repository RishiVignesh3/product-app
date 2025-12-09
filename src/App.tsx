import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { ProductCatalogPage } from './pages/ProductCatalogPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { CartPage } from './pages/CartPage'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <ProductCatalogPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products/:id"
                element={
                  <ProtectedRoute>
                    <ProductDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
