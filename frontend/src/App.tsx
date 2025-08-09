import './index.css'
import { Button } from './components/ui/Button'
import { PlusIcon } from './icons/Plusicon'

function App() {
 

  return (
    <>
      <Button startIcon={<PlusIcon size="lg"/>}size="sm" variant="primary" text="Share" onClick={() => console.log('Share clicked')} />  

      <Button size="lg" variant="secondary" text="Add Content"   onClick={() => console.log('Add Content clicked')} />  
    </>
  )
}

export default App
