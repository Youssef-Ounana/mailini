import { useEffect, useState } from 'react'
import AppLayout from './components/layout/AppLayout'
import ComposePage from './pages/ComposePage'

function App() {
  const [status, setStatus] = useState('Vérification…')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setStatus(`API : ${data.status}`))
      .catch(() => setStatus('API injoignable'))
  }, [])

  return (
    <AppLayout>
      <ComposePage />
    </AppLayout>
  )
}

export default App