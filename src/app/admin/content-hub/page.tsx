import ProtectedRoute from '@/components/ProtectedRoute'
import ContentHub from '@/views/ContentHub'

export default function Page() {
  return (
    <ProtectedRoute>
      <ContentHub />
    </ProtectedRoute>
  )
}
