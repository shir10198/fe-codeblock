import Lobby from './Components/Lobby/Lobby';
import CodeBlockItem from './Components/CodeBlock/CodeBlockItem';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { useState,useEffect } from 'react';



function App() {
  const [codesObj, setCodesObj] = useState({});
  const [codesSolObj, setCodesSolObj] = useState({});

  useEffect(()=>{
    fetch('https://be-codeblockapp-aded7327a22d.herokuapp.com/getCodeBlocks').then(response => {
         if(!response.ok){
             throw new Error('Error with CodeBlock List response');
         }
         return response.json();
    }).then(data => {
      console.log(data)
      const codesObject = {};
      const codesSolObject = {};
      for (const item of data) {
        codesObject[item.title] = item.code;
        codesSolObject[item.title] = item.solution;
      }
     
      setCodesObj(codesObject);
      setCodesSolObj(codesSolObject);
    }).catch(error => {
        console.log(error);
    })
 },[]);

  return (
    <div>
    <Router>
    <Routes>
      <Route exact path="/" 
      element={<Lobby codeBlockNames={Object.keys(codesObj)}/>} 
      />
      <Route
      path="/codeblock/:codeItem"
      element={<CodeBlockItem setCodesObj={setCodesObj} codesSolObj={codesSolObj} codesObj={codesObj}/>} 
    />
    </Routes>

    </Router>
    </div>
  );
}

export default App;
