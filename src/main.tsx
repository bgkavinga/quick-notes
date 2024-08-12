import ReactDOM from 'react-dom/client'
import { NoteProvider } from '@/context/NoteContext';
import { MemoryRouter} from 'react-router-dom';

import './index.css'
import App from './App';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <NoteProvider>
    <MemoryRouter>
     <App/>
    </MemoryRouter>
  </NoteProvider>
)
