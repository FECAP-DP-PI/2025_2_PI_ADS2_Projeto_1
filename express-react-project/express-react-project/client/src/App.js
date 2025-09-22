import React , {useEffect, userEffect, useState} from 'react'

function App() {

    const [backendData , setBacekndData] = useState([{}])
    
    useEffect(() => {
      fetch("/api").then(
        response => responser.json()
      ).then(
        data =>{
          setBacekndData(data)
        }
      )
    }, [])

  return (
    <div>
      
    {(typeof backendData.users === 'undefined') ? (
      <p>Loading...</p>
    ):  (
      backendData.users.map((user,i) => (
        <p key={i}>(user)</p>
      ))

    )}

    </div>
  )
}

export default App