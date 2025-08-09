
import './App.css'
import { Button } from './components/Button'
import { Card } from './components/Card'
import { PlusIcon } from './icons/PlusIcons'
import { ShareIcon } from './icons/ShareIcon'
function App(){
  return <div className='p-4'>
    <div className='flex justify-end gap-4 pb-2'>
    <Button variant='primary' text="Add Content" startIcon={<PlusIcon/>}/>
    <Button variant='secondary' text="Share Thought" startIcon={<ShareIcon/>}/>
    </div>
    <div className='flex gap-4'>
    <Card type='twitter' link="https://x.com/whysooharsh/status/1953926533162193029"  title ="Testing tweet"/>
    <Card type='youtube' link="https://www.youtube.com/watch?v=ph4i-C8UC1w&list=RDph4i-C8UC1w&start_radio=1"  title ="Testing video"/>
  </div>
  </div>
}

export default App