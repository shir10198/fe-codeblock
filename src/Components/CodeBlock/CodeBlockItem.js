import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import './CodeBlockItem.css'
import Editor from "@monaco-editor/react";
import { debounce } from 'lodash'; 


const socket = io('https://be-codeblockapp-aded7327a22d.herokuapp.com/');

const CodeBlockItem = (props) => {
  const {codesObj,setCodesObj,codesSolObj} = props;
  const { codeItem } = useParams(); // code item from the url
  const navigate = useNavigate();

  const [editorValue, setEditorValue] = useState(codesObj[codeItem]); // holds the code state
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    
    fetch('https://be-codeblockapp-aded7327a22d.herokuapp.com/getFirstSocket')
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        let isFirstSocket = data === socket.id;

        setReadOnly(isFirstSocket); // Update the readOnly state based on the response
        if (isFirstSocket) {
          socket.emit('readOnly'); // Send a signal to set the textbox to read-only
        } else {
          socket.emit('editable'); // Send a signal to set the textbox to editable
        }
      })
      .catch((error) => {
        console.log(error);
      });

    socket.on('readOnly', () => {
      setReadOnly(true);
    });

    socket.on('editable', () => {
      setReadOnly(false);
    });

    socket.on('textUpdate', (updatedText) => {
      // Update the text box with the text received from the server
   

    // Set the updated object back to the state
    setCodesObj(updatedText);
    });

   
  }, []);
  const timeoutRef = useRef(null);

  const handleTextChange = (event) => {
    const updatedText = event;

    const updatedCodesObj = { ...codesObj };
    updatedCodesObj[codeItem] = updatedText;

    // Set the updated object back to the state
    setCodesObj(updatedCodesObj);
    // broadcast the updated text to the server
    socket.emit('textUpdate', updatedCodesObj);
  
    clearTimeout(timeoutRef.current);


    timeoutRef.current = setTimeout(() => {
      const data = {
        title: codeItem,
        code: updatedCodesObj[codeItem]
      }
      // Perform the post request after the delay
      fetch('https://be-codeblockapp-aded7327a22d.herokuapp.com/updateCodeBlock',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })   .then((response) => response.json())
      .then((data) => {
        
       console.log(data)
      })
      .catch((error) => {
        console.log(error);
      });;

     

      // Clear the timeout reference after the post request is made
      timeoutRef.current = null;
    }, 3000); // 3 seconds
  };

  const backToLobbyHandler = () => { //navigate to homepage
    navigate('/');
  }

  //Reduce rerenders
  const debouncedHandleTextChange = useRef(
    debounce(handleTextChange, 500)
  ).current;
    //also to reduce rerenders
  useEffect(() => {
    setEditorValue(codesObj[codeItem]);
  }, [codesObj, codeItem]);

  const isWinner = codesSolObj[codeItem] === codesObj[codeItem];//does code equals to solution?
  let winnerMessage = '';
  if(isWinner){
    winnerMessage = <div><h2>You got the solution you little genius!</h2> <img alt="smiley" src="https://images.template.net/99504/free-smiley-face-clipart-r05sr.jpg"/></div>;
  }

  return (
    <div>
      <h1>Code Block - {codeItem}</h1>
      {readOnly && <h2>Hello Mentor</h2>}
      {!readOnly && <h2>Hello Student</h2>}
      {winnerMessage}
    
    <Editor
      className='code-block'
      height="50vh"
      defaultLanguage="javascript"
      value={editorValue}
      options={{readOnly: readOnly}}
      onChange={debouncedHandleTextChange}
    />
    <button onClick={backToLobbyHandler}>Back to Lobby</button>

    </div>
  );
};

export default CodeBlockItem;